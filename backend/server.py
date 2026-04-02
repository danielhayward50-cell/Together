# ATC Master Platform - Main Server
from dotenv import load_dotenv
from pathlib import Path

# Load env vars FIRST before any other imports
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from datetime import datetime, timezone

# Import routers
from routers import auth, dashboard, staff, clients, shifts, invoices, reports, leads, ai, payroll, compliance, gdrive

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Set database for all routers
auth.set_database(db)
dashboard.set_database(db)
staff.set_database(db)
clients.set_database(db)
shifts.set_database(db)
invoices.set_database(db)
reports.set_database(db)
leads.set_database(db)
ai.set_database(db)
payroll.set_database(db)
compliance.set_database(db)

# Create the main app
app = FastAPI(title="ATC Master Platform API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check route
@api_router.get("/")
async def root():
    return {"message": "ATC Master Platform API", "status": "online"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now(timezone.utc).isoformat()}

# Include all routers
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(staff.router)
api_router.include_router(clients.router)
api_router.include_router(shifts.router)
api_router.include_router(invoices.router)
api_router.include_router(reports.router)
api_router.include_router(leads.router)
api_router.include_router(ai.router)
api_router.include_router(payroll.router)
api_router.include_router(compliance.router)
api_router.include_router(gdrive.router)

# Include the main router in the app
app.include_router(api_router)

# CORS Configuration
frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:3000")
cors_origins = os.environ.get('CORS_ORIGINS', '*').split(',')

# Add frontend URL to allowed origins
if frontend_url not in cors_origins and '*' not in cors_origins:
    cors_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=cors_origins if '*' not in cors_origins else ["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


async def seed_initial_data():
    """Seed initial data for demo purposes"""
    
    # Check if data already exists
    staff_count = await db.staff.count_documents({})
    if staff_count > 0:
        logger.info("Data already seeded, skipping...")
        return
    
    logger.info("Seeding initial data...")
    
    # Seed Staff
    staff_doc = {
        "staff_id": "staff_danielhayward",
        "name": "Daniel Hayward",
        "role": "Support Worker",
        "email": "daniel@achievetogethercare.com",
        "phone": "0422 492 736",
        "address": "Nowra, NSW 2541",
        "tfn": "123456789",
        "bsb": "067-873",
        "acc": "207-436-73",
        "sf": "AustralianSuper",
        "sn": "AS123456",
        "rate": 38.08,
        "compliance": [
            {"name": "First Aid Certificate", "number": "FA2024-12345", "expiry": "2026-08-15", "status": "valid"},
            {"name": "NDIS Worker Orientation", "expiry": "2027-01-10", "status": "valid"},
            {"name": "Police Check", "number": "PC-NSW-2024-67890", "expiry": "2027-03-20", "status": "valid"},
            {"name": "Working with Children Check", "number": "WWCC-NSW-12345", "expiry": "2029-06-30", "status": "valid"},
            {"name": "Driver's Licence", "number": "NSW-DL-456789", "expiry": "2028-11-15", "status": "valid"},
            {"name": "Car Insurance", "expiry": "2026-12-01", "status": "valid"},
            {"name": "COVID-19 Vaccination", "expiry": "N/A", "status": "valid"},
        ],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.staff.insert_one(staff_doc)
    
    # Seed Client
    client_doc = {
        "client_id": "client_shauncase",
        "name": "Shaun Case",
        "ndis_number": "431005774",
        "phone": "0412 345 678",
        "email": "shaun.case@email.com",
        "address": "123 Main Street, Nowra NSW 2541",
        "emergency_contact": "Mary Case (Mother)",
        "emergency_phone": "0423 456 789",
        "dob": "1982-10-12",
        "goals": [
            "Improve daily living skills and independence",
            "Develop social connections in community",
            "Increase participation in recreational activities",
            "Build confidence in public transport use",
        ],
        "plan_manager": "Plan Partners NSW",
        "plan_manager_email": "support@planpartners.com.au",
        "support_coordinator": "Emma Wilson",
        "funding_type": "Plan Managed",
        "plan_start_date": "2025-07-01",
        "plan_end_date": "2026-06-30",
        "weekly_hours": 15,
        "support_workers": ["Daniel Hayward"],
        "likes": [
            "Shopping at local supermarket",
            "Watching movies and TV shows",
            "Listening to music (especially 80s rock)",
            "Going to cafes for coffee",
            "Walking in parks"
        ],
        "triggers": [
            "Unexpected changes to schedule",
            "Loud environments or noise",
            "Being told 'no' directly"
        ],
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.clients.insert_one(client_doc)
    
    # Seed Shifts
    shifts_data = [
        {
            "shift_id": "shift_001",
            "date": "2026-02-09",
            "participant": "Shaun Case",
            "client_id": "client_shauncase",
            "worker": "Daniel Hayward",
            "staff_id": "staff_danielhayward",
            "start_time": "09:00",
            "end_time": "15:00",
            "hours": 6,
            "km": 15,
            "status": "completed",
            "activities": [
                "Supported Shaun with morning routine and personal care",
                "Accompanied to local shops for grocery shopping",
                "Practiced budgeting skills at supermarket",
            ],
            "engagement": [
                "Shaun was in good mood and cooperative throughout shift",
                "Engaged well in conversation during shopping",
                "Demonstrated improved decision-making with purchases",
            ],
            "support": [
                "Provided assistance with shower and personal grooming",
                "Supported community access and social interaction",
                "Encouraged independence in shopping choices",
            ],
            "goals": [
                "Goal 1: Improve daily living skills and independence",
                "Goal 3: Increase community participation and social connections",
            ],
            "notes": "Successful shift. Shaun showed great progress with budgeting.",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "shift_id": "shift_002",
            "date": "2026-03-15",
            "participant": "Shaun Case",
            "client_id": "client_shauncase",
            "worker": "Daniel Hayward",
            "staff_id": "staff_danielhayward",
            "start_time": "10:00",
            "end_time": "14:00",
            "hours": 4,
            "km": 10,
            "status": "scheduled",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.shifts.insert_many(shifts_data)
    
    # Seed Reports
    report_doc = {
        "report_id": "report_001",
        "type": "daily",
        "title": "Daily Shift Report - Shaun Case",
        "date": "2026-02-09",
        "author": "Daniel Hayward",
        "status": "completed",
        "participant": "Shaun Case",
        "client_id": "client_shauncase",
        "ndis_number": "431005774",
        "hours": 6,
        "km": 15,
        "mood": "Happy and engaged",
        "shift_time": "09:00 - 15:00",
        "sections": [
            {"title": "Summary", "content": "6-hour community access shift. Shaun was in good spirits throughout."},
            {"title": "Activities", "content": "Shopping at local supermarket, budgeting practice, social interaction"},
        ],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.reports.insert_one(report_doc)
    
    # Seed Invoice
    invoice_doc = {
        "invoice_id": "inv_001",
        "invoice_no": "ATC-2026-001",
        "date": "2026-02-28",
        "period": "February 2026",
        "client": "Shaun Case",
        "client_id": "client_shauncase",
        "ndis_number": "431005774",
        "worker": "Daniel Hayward",
        "staff_id": "staff_danielhayward",
        "funding_manager": "Plan Partners NSW",
        "lines": [
            {
                "date": "2026-02-09",
                "description": "Community Access Support",
                "ndis_code": "01_002_0107_1_1",
                "qty": 6,
                "unit": "hours",
                "rate": 70.23,
                "total": 421.38,
            },
            {
                "date": "2026-02-09",
                "description": "Provider Travel",
                "ndis_code": "09_799_0106_6_3",
                "qty": 15,
                "unit": "km",
                "rate": 0.95,
                "total": 14.25,
            },
        ],
        "total_hours": 6,
        "total_km": 15,
        "total_travel": 14.25,
        "total_payable": 435.63,
        "status": "draft",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.invoices.insert_one(invoice_doc)
    
    # Seed CRM Leads
    leads_data = [
        {
            "lead_id": "lead_001",
            "name": "Sarah Williams",
            "organization": "North West Co.",
            "role": "Support Coordinator",
            "email": "sarah.w@nwco.com.au",
            "phone": "0412 888 999",
            "status": "draft",
            "priority": "high",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "lead_id": "lead_002",
            "name": "Michael Chen",
            "organization": "Sydney Care Partners",
            "role": "Team Coordinator",
            "email": "m.chen@sydneycare.com.au",
            "phone": "0423 567 890",
            "status": "draft",
            "priority": "medium",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "lead_id": "lead_003",
            "name": "Emma Thompson",
            "organization": "Central Coast Support",
            "role": "Support Coordinator",
            "email": "emma.t@ccsupp.com.au",
            "phone": "0434 123 456",
            "status": "draft",
            "priority": "medium",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "lead_id": "lead_004",
            "name": "David Kumar",
            "organization": "Western Sydney Hub",
            "role": "Plan Manager",
            "email": "d.kumar@wshub.com.au",
            "phone": "0445 789 012",
            "status": "draft",
            "priority": "high",
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "lead_id": "lead_005",
            "name": "Lisa Anderson",
            "organization": "North Shore Coaching",
            "role": "Recovery Coach",
            "email": "lisa@nscoach.com.au",
            "phone": "0456 234 567",
            "status": "draft",
            "priority": "low",
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]
    await db.leads.insert_many(leads_data)
    
    logger.info("Initial data seeded successfully!")


@app.on_event("startup")
async def startup_event():
    """Startup event handler"""
    logger.info("Starting ATC Master Platform API...")
    
    # Create indexes
    await auth.create_indexes()
    
    # Create additional indexes
    await db.staff.create_index("staff_id", unique=True)
    await db.staff.create_index("email")
    await db.clients.create_index("client_id", unique=True)
    await db.clients.create_index("ndis_number")
    await db.shifts.create_index("shift_id", unique=True)
    await db.shifts.create_index("date")
    await db.shifts.create_index("client_id")
    await db.shifts.create_index("staff_id")
    await db.invoices.create_index("invoice_id", unique=True)
    await db.invoices.create_index("invoice_no", unique=True)
    await db.reports.create_index("report_id", unique=True)
    await db.leads.create_index("lead_id", unique=True)
    
    # Seed admin user
    await auth.seed_admin()
    
    # Seed initial demo data
    await seed_initial_data()
    
    # Write test credentials
    credentials_path = Path("/app/memory/test_credentials.md")
    credentials_path.parent.mkdir(parents=True, exist_ok=True)
    credentials_content = """# ATC Platform Test Credentials

## Admin Account
- **Email:** admin@achievetogethercare.com.au
- **Password:** ATCAdmin2026!
- **Role:** owner

## Auth Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login with email/password
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Logout
- POST /api/auth/refresh - Refresh token
- POST /api/auth/forgot-password - Request password reset
- POST /api/auth/reset-password - Reset password
- POST /api/auth/google/session - Exchange Google OAuth session

## API Endpoints
- GET/POST /api/staff - Staff CRUD
- GET/POST /api/clients - Client CRUD
- GET/POST /api/shifts - Shift CRUD
- GET/POST /api/invoices - Invoice CRUD
- GET/POST /api/reports - Report CRUD
- GET/POST /api/leads - CRM Lead CRUD
- GET /api/dashboard/stats - Dashboard statistics
- GET /api/dashboard/kpis - Key Performance Indicators

## Test Data
- Staff: Daniel Hayward (staff_danielhayward)
- Client: Shaun Case (client_shauncase)
- 5 CRM Leads pre-seeded
"""
    credentials_path.write_text(credentials_content)
    
    logger.info("ATC Master Platform API started successfully!")


@app.on_event("shutdown")
async def shutdown_db_client():
    """Shutdown event handler"""
    logger.info("Shutting down ATC Master Platform API...")
    client.close()
