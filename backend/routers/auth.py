# ATC Master Platform - Authentication & User Management
# Supports both JWT email/password and Emergent Google OAuth
from fastapi import APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr
from datetime import datetime, timezone, timedelta
from typing import Optional
import bcrypt
import jwt
import os
import secrets
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["authentication"])

# JWT Configuration
JWT_SECRET = os.environ.get("JWT_SECRET", secrets.token_hex(32))
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


# ==================== PASSWORD UTILITIES ====================
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


# ==================== JWT UTILITIES ====================
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "type": "access"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "type": "refresh"
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


# ==================== AUTH HELPERS ====================
async def get_current_user(request: Request) -> dict:
    """Extract and validate user from cookie or Authorization header"""
    # Try cookie first
    token = request.cookies.get("access_token")
    
    # Fallback to Authorization header
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    
    # Also check session_token cookie (for Google OAuth)
    if not token:
        session_token = request.cookies.get("session_token")
        if session_token:
            # Verify session token from database
            session = await db.user_sessions.find_one(
                {"session_token": session_token},
                {"_id": 0}
            )
            if session:
                expires_at = session.get("expires_at")
                if isinstance(expires_at, str):
                    expires_at = datetime.fromisoformat(expires_at)
                if expires_at.tzinfo is None:
                    expires_at = expires_at.replace(tzinfo=timezone.utc)
                
                if expires_at > datetime.now(timezone.utc):
                    user = await db.users.find_one(
                        {"user_id": session["user_id"]},
                        {"_id": 0, "password_hash": 0}
                    )
                    if user:
                        return user
            raise HTTPException(status_code=401, detail="Session expired")
    
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one(
            {"user_id": payload["sub"]},
            {"_id": 0, "password_hash": 0}
        )
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== MODELS ====================
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "staff"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class PasswordReset(BaseModel):
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str


class GoogleSessionRequest(BaseModel):
    session_id: str


# ==================== BRUTE FORCE PROTECTION ====================
async def check_brute_force(identifier: str) -> bool:
    """Check if identifier is locked out due to too many failed attempts"""
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    if attempts:
        if attempts.get("locked_until"):
            locked_until = attempts["locked_until"]
            if isinstance(locked_until, str):
                locked_until = datetime.fromisoformat(locked_until)
            if locked_until.tzinfo is None:
                locked_until = locked_until.replace(tzinfo=timezone.utc)
            if locked_until > datetime.now(timezone.utc):
                return True
    return False


async def record_failed_attempt(identifier: str):
    """Record a failed login attempt"""
    now = datetime.now(timezone.utc)
    attempts = await db.login_attempts.find_one({"identifier": identifier})
    
    if attempts:
        count = attempts.get("count", 0) + 1
        update = {"$set": {"count": count, "last_attempt": now.isoformat()}}
        
        # Lock after 5 failed attempts for 15 minutes
        if count >= 5:
            locked_until = now + timedelta(minutes=15)
            update["$set"]["locked_until"] = locked_until.isoformat()
        
        await db.login_attempts.update_one({"identifier": identifier}, update)
    else:
        await db.login_attempts.insert_one({
            "identifier": identifier,
            "count": 1,
            "last_attempt": now.isoformat()
        })


async def clear_failed_attempts(identifier: str):
    """Clear failed attempts on successful login"""
    await db.login_attempts.delete_one({"identifier": identifier})


# ==================== AUTH ROUTES ====================
@router.post("/register")
async def register(user_data: UserRegister, response: Response):
    """Register a new user with email/password"""
    email = user_data.email.lower()
    
    # Check if email already exists
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    import uuid
    user_id = f"user_{uuid.uuid4().hex[:12]}"
    now = datetime.now(timezone.utc)
    
    user_doc = {
        "user_id": user_id,
        "email": email,
        "name": user_data.name,
        "role": user_data.role,
        "password_hash": hash_password(user_data.password),
        "auth_provider": "email",
        "created_at": now.isoformat()
    }
    
    await db.users.insert_one(user_doc)
    
    # Create tokens
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    # Set cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/"
    )
    
    return {
        "user": {
            "user_id": user_id,
            "email": email,
            "name": user_data.name,
            "role": user_data.role
        },
        "message": "Registration successful"
    }


@router.post("/login")
async def login(credentials: UserLogin, request: Request, response: Response):
    """Login with email/password"""
    email = credentials.email.lower()
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"
    
    # Check brute force lockout
    if await check_brute_force(identifier):
        raise HTTPException(status_code=429, detail="Too many failed attempts. Try again later.")
    
    # Find user
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if not user:
        await record_failed_attempt(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not user.get("password_hash") or not verify_password(credentials.password, user["password_hash"]):
        await record_failed_attempt(identifier)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Clear failed attempts
    await clear_failed_attempts(identifier)
    
    # Create tokens
    access_token = create_access_token(user["user_id"], email)
    refresh_token = create_refresh_token(user["user_id"])
    
    # Set cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,
        path="/"
    )
    
    return {
        "user": {
            "user_id": user["user_id"],
            "email": user["email"],
            "name": user.get("name"),
            "role": user.get("role"),
            "picture": user.get("picture")
        },
        "message": "Login successful"
    }


@router.get("/me")
async def get_me(request: Request):
    """Get current authenticated user"""
    user = await get_current_user(request)
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "name": user.get("name"),
        "role": user.get("role"),
        "picture": user.get("picture")
    }


@router.post("/logout")
async def logout(response: Response):
    """Logout - clear cookies"""
    response.delete_cookie(key="access_token", path="/")
    response.delete_cookie(key="refresh_token", path="/")
    response.delete_cookie(key="session_token", path="/")
    return {"message": "Logged out successfully"}


@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    """Refresh access token"""
    refresh = request.cookies.get("refresh_token")
    if not refresh:
        raise HTTPException(status_code=401, detail="No refresh token")
    
    try:
        payload = jwt.decode(refresh, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        
        user = await db.users.find_one(
            {"user_id": payload["sub"]},
            {"_id": 0}
        )
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        
        # Create new access token
        access_token = create_access_token(user["user_id"], user["email"])
        
        response.set_cookie(
            key="access_token",
            value=access_token,
            httponly=True,
            secure=False,
            samesite="lax",
            max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            path="/"
        )
        
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid refresh token")


@router.post("/forgot-password")
async def forgot_password(data: PasswordReset):
    """Request password reset"""
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    
    # Don't reveal if email exists
    if not user:
        return {"message": "If the email exists, a reset link will be sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=1)
    
    await db.password_reset_tokens.insert_one({
        "token": reset_token,
        "email": email,
        "expires_at": expires_at.isoformat(),
        "used": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    # Log reset link (in production, send via email)
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
    reset_link = f"{frontend_url}/reset-password?token={reset_token}"
    print(f"PASSWORD RESET LINK: {reset_link}")
    
    return {"message": "If the email exists, a reset link will be sent", "debug_token": reset_token}


@router.post("/reset-password")
async def reset_password(data: PasswordResetConfirm):
    """Reset password with token"""
    token_doc = await db.password_reset_tokens.find_one(
        {"token": data.token, "used": False}
    )
    
    if not token_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired token")
    
    # Check expiry
    expires_at = token_doc["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Token expired")
    
    # Update password
    await db.users.update_one(
        {"email": token_doc["email"]},
        {"$set": {"password_hash": hash_password(data.new_password)}}
    )
    
    # Mark token as used
    await db.password_reset_tokens.update_one(
        {"token": data.token},
        {"$set": {"used": True}}
    )
    
    return {"message": "Password reset successful"}


# ==================== GOOGLE OAUTH ROUTES ====================
@router.post("/google/session")
async def exchange_google_session(data: GoogleSessionRequest, response: Response):
    """Exchange Emergent Google OAuth session_id for session token"""
    try:
        # Call Emergent Auth to get session data
        async with httpx.AsyncClient() as client:
            auth_response = await client.get(
                "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
                headers={"X-Session-ID": data.session_id},
                timeout=10.0
            )
        
        if auth_response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid session")
        
        session_data = auth_response.json()
        email = session_data.get("email", "").lower()
        name = session_data.get("name", "")
        picture = session_data.get("picture", "")
        session_token = session_data.get("session_token", "")
        
        if not email or not session_token:
            raise HTTPException(status_code=400, detail="Invalid session data")
        
        # Check if user exists
        import uuid
        user = await db.users.find_one({"email": email}, {"_id": 0})
        
        if user:
            # Update existing user
            await db.users.update_one(
                {"email": email},
                {"$set": {
                    "name": name,
                    "picture": picture,
                    "last_login": datetime.now(timezone.utc).isoformat()
                }}
            )
            user_id = user["user_id"]
        else:
            # Create new user
            user_id = f"user_{uuid.uuid4().hex[:12]}"
            await db.users.insert_one({
                "user_id": user_id,
                "email": email,
                "name": name,
                "picture": picture,
                "role": "staff",
                "auth_provider": "google",
                "created_at": datetime.now(timezone.utc).isoformat()
            })
        
        # Store session
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        await db.user_sessions.insert_one({
            "user_id": user_id,
            "session_token": session_token,
            "expires_at": expires_at.isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        
        # Set session cookie
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            secure=True,
            samesite="none",
            max_age=7 * 24 * 60 * 60,
            path="/"
        )
        
        return {
            "user": {
                "user_id": user_id,
                "email": email,
                "name": name,
                "role": user.get("role", "staff") if user else "staff",
                "picture": picture
            },
            "message": "Google login successful"
        }
    except httpx.RequestError as e:
        raise HTTPException(status_code=500, detail=f"Auth service error: {str(e)}")


# ==================== ADMIN SEEDING ====================
async def seed_admin():
    """Seed admin user on startup"""
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@achievetogethercare.com.au")
    admin_password = os.environ.get("ADMIN_PASSWORD", "ATCAdmin2026!")
    
    existing = await db.users.find_one({"email": admin_email})
    
    if existing is None:
        import uuid
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        await db.users.insert_one({
            "user_id": user_id,
            "email": admin_email,
            "name": "Daniel Hayward",
            "role": "owner",
            "password_hash": hash_password(admin_password),
            "auth_provider": "email",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        print(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing.get("password_hash", "")):
        # Update password if changed
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        print(f"Admin password updated: {admin_email}")
    else:
        print(f"Admin user exists: {admin_email}")


async def create_indexes():
    """Create MongoDB indexes"""
    await db.users.create_index("email", unique=True)
    await db.users.create_index("user_id", unique=True)
    await db.user_sessions.create_index("session_token")
    await db.user_sessions.create_index("user_id")
    await db.login_attempts.create_index("identifier")
    await db.password_reset_tokens.create_index("token")
    await db.password_reset_tokens.create_index("expires_at", expireAfterSeconds=0)
    print("Database indexes created")
