# ATC Master Platform - Dashboard & Analytics API
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'atc_platform')]

# Models
class KPIData(BaseModel):
    monthly_revenue: float
    outreach_roi: float
    ndis_burn_rate_per_day: float
    critical_alerts: int
    alerts: List[dict]

class StatCard(BaseModel):
    title: str
    value: str
    change: Optional[str] = None
    trend: Optional[str] = None

# Routes
@router.get("/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    
    # Calculate revenue (sum of completed shifts for current month)
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    
    # Get shifts for current month
    shifts = await db.shifts.find({
        "date": {"$gte": month_start.strftime("%Y-%m-%d")},
        "status": "completed"
    }).to_list(None)
    
    total_hours = sum(shift.get("hours", 0) for shift in shifts)
    hourly_rate = 70.23  # NDIS rate
    monthly_revenue = total_hours * hourly_rate
    
    # Get client count
    client_count = await db.clients.count_documents({})
    
    # Get staff count
    staff_count = await db.staff.count_documents({})
    
    # Get compliance score
    compliance_docs = await db.compliance.find({}).to_list(None)
    if compliance_docs:
        valid_docs = [doc for doc in compliance_docs if doc.get("status") == "valid"]
        compliance_score = int((len(valid_docs) / len(compliance_docs)) * 100)
    else:
        compliance_score = 100
    
    # Get pending invoices
    pending_invoices = await db.invoices.count_documents({"status": {"$in": ["draft", "pending"]}})
    
    return {
        "revenue": {
            "amount": monthly_revenue,
            "change": 12,
            "period": now.strftime("%B %Y")
        },
        "clients": {
            "total": client_count,
            "active": client_count
        },
        "staff": {
            "total": staff_count
        },
        "compliance": {
            "score": compliance_score
        },
        "invoices": {
            "pending": pending_invoices
        }
    }

@router.get("/kpis")
async def get_kpis():
    """Get Key Performance Indicators"""
    
    # Get current month revenue
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    
    shifts = await db.shifts.find({
        "date": {"$gte": month_start.strftime("%Y-%m-%d")},
        "status": "completed"
    }).to_list(None)
    
    total_hours = sum(shift.get("hours", 0) for shift in shifts)
    monthly_revenue = total_hours * 70.23
    
    # Calculate NDIS burn rate
    days_in_month = 30  # Approximate
    burn_rate_per_day = monthly_revenue / days_in_month if days_in_month > 0 else 0
    
    # Get compliance alerts
    compliance_docs = await db.compliance.find({}).to_list(None)
    alerts = []
    critical_count = 0
    
    for doc in compliance_docs:
        if doc.get("status") == "expired":
            alerts.append({
                "type": "critical",
                "alert": f"{doc.get('name')} expired",
                "staff": doc.get("staff_name", "Unknown")
            })
            critical_count += 1
        elif doc.get("status") == "expiring":
            alerts.append({
                "type": "warning",
                "alert": f"{doc.get('name')} expiring soon",
                "staff": doc.get("staff_name", "Unknown")
            })
    
    return {
        "monthly_revenue": round(monthly_revenue, 2),
        "outreach_roi": 24.5,  # Mock data - calculate from actual outreach
        "ndis_burn_rate_per_day": round(burn_rate_per_day, 2),
        "critical_alerts": critical_count,
        "alerts": alerts
    }

@router.get("/recent-reports")
async def get_recent_reports(limit: int = 5):
    """Get recent shift reports"""
    reports = await db.reports.find().sort("date", -1).limit(limit).to_list(limit)
    return reports

@router.get("/upcoming-shifts")
async def get_upcoming_shifts(limit: int = 10):
    """Get upcoming scheduled shifts"""
    today = datetime.utcnow().strftime("%Y-%m-%d")
    shifts = await db.shifts.find({
        "date": {"$gte": today},
        "status": {"$in": ["scheduled", "confirmed"]}
    }).sort("date", 1).limit(limit).to_list(limit)
    return shifts

@router.get("/monthly-summary")
async def get_monthly_summary():
    """Get monthly summary statistics"""
    now = datetime.utcnow()
    month_start = datetime(now.year, now.month, 1)
    
    # Get all completed shifts for the month
    shifts = await db.shifts.find({
        "date": {"$gte": month_start.strftime("%Y-%m-%d")},
        "status": "completed"
    }).to_list(None)
    
    total_shifts = len(shifts)
    total_hours = sum(shift.get("hours", 0) for shift in shifts)
    total_km = sum(shift.get("km", 0) for shift in shifts)
    
    # Calculate earnings
    hourly_rate = 70.23
    km_rate = 0.95
    shift_earnings = total_hours * hourly_rate
    travel_earnings = total_km * km_rate
    total_earnings = shift_earnings + travel_earnings
    
    return {
        "month": now.strftime("%B %Y"),
        "total_shifts": total_shifts,
        "total_hours": total_hours,
        "total_km": total_km,
        "shift_earnings": round(shift_earnings, 2),
        "travel_earnings": round(travel_earnings, 2),
        "total_earnings": round(total_earnings, 2)
    }
