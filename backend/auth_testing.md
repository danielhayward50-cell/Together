# ATC Platform - Authentication Testing Playbook

## Test Credentials
- Admin Email: admin@achievetogethercare.com.au
- Admin Password: ATCAdmin2026!
- Admin Role: owner

## Auth Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login with email/password
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Logout
- POST /api/auth/refresh - Refresh token
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password with token
- POST /api/auth/google/session - Exchange Google OAuth session_id

## Testing Steps

### Step 1: MongoDB Verification
```bash
mongosh
use test_database
db.users.find({role: "owner"}).pretty()
db.users.findOne({role: "owner"}, {password_hash: 1})
```
Verify: bcrypt hash starts with `$2b$`, indexes exist on users.email (unique)

### Step 2: API Testing - Login
```bash
API_URL=$(grep REACT_APP_BACKEND_URL /app/frontend/.env | cut -d '=' -f2)
curl -c cookies.txt -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@achievetogethercare.com.au","password":"ATCAdmin2026!"}'
```

### Step 3: API Testing - Get Current User
```bash
curl -b cookies.txt "$API_URL/api/auth/me"
```

### Step 4: API Testing - Register New User
```bash
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test User","role":"staff"}'
```

## Google OAuth Testing

### Create Test Session
```bash
mongosh --eval "
use('test_database');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  auth_provider: 'google',
  created_at: new Date()
});
db.user_sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

### Test with Session Token
```bash
curl -X GET "$API_URL/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"
```

## Success Indicators
- /api/auth/login returns user data and sets cookies
- /api/auth/me returns user data
- Dashboard loads without redirect to login

## Failure Indicators
- "User not found" errors
- 401 Unauthorized responses
- Redirect to login page
