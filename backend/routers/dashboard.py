# ATC Master Platform - Dashboard & Analytics API
from fastapi import APIRouter, HTTPException
from datetime import datetime, timezone
from typing import List, Optional

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


@router.get("/stats")
async def get_dashboard_stats():
    """Get dashboard statistics"""
    now = datetime.now(timezone.utc)
    month_start = f"{now.year}-{now.month:02d}-01"
    
    # Get shifts for current month
    shifts = await db.shifts.find({
        "date": {"$gte": month_start},
        "status": "completed"
    }, {"_id": 0}).to_list(None)
    
    total_hours = sum(shift.get("hours", 0) for shift in shifts)
    hourly_rate = 70.23  # NDIS rate
    monthly_revenue = total_hours * hourly_rate
    
    # Get counts
    client_count = await db.clients.count_documents({})
    staff_count = await db.staff.count_documents({})
    
    # Get compliance data
    staff_list = await db.staff.find({}, {"_id": 0, "compliance": 1, "name": 1}).to_list(None)
    all_docs = []
    for staff in staff_list:
        for doc in staff.get("compliance", []):
            doc["staff_name"] = staff.get("name")
            all_docs.append(doc)
    
    valid_docs = [d for d in all_docs if d.get("status") == "valid"]
    expired_docs = [d for d in all_docs if d.get("status") == "expired"]
    expiring_docs = [d for d in all_docs if d.get("status") == "expiring"]
    
    compliance_score = int((len(valid_docs) / len(all_docs)) * 100) if all_docs else 100
    
    # Get pending invoices
    pending_invoices = await db.invoices.count_documents({"status": {"$in": ["draft", "pending"]}})
    total_invoices = await db.invoices.count_documents({})
    
    return {
        "revenue": {
            "amount": round(monthly_revenue, 2),
            "change": 12,
            "period": now.strftime("%b %Y")
        },
        "clients": {
            "total": client_count,
            "active": client_count
        },
        "staff": {
            "total": staff_count
        },
        "compliance": {
            "score": compliance_score,
            "expired": len(expired_docs),
            "expiring": len(expiring_docs),
            "expired_docs": expired_docs[:5],
            "expiring_docs": expiring_docs[:5]
        },
        "invoices": {
            "pending": pending_invoices,
            "total": total_invoices
        }
    }


@router.get("/kpis")
async def get_kpis():
    """Get Key Performance Indicators"""
    now = datetime.now(timezone.utc)
    month_start = f"{now.year}-{now.month:02d}-01"
    
    shifts = await db.shifts.find({
        "date": {"$gte": month_start},
        "status": "completed"
    }, {"_id": 0}).to_list(None)
    
    total_hours = sum(shift.get("hours", 0) for shift in shifts)
    monthly_revenue = total_hours * 70.23
    
    # Calculate burn rate
    days_in_month = 30
    burn_rate_per_day = monthly_revenue / days_in_month if days_in_month > 0 else 0
    
    # Get alerts from compliance
    staff_list = await db.staff.find({}, {"_id": 0, "compliance": 1, "name": 1}).to_list(None)
    alerts = []
    critical_count = 0
    
    for staff in staff_list:
        for doc in staff.get("compliance", []):
            if doc.get("status") == "expired":
                alerts.append({
                    "type": "critical",
                    "alert": f"{doc.get('name')} expired",
                    "staff": staff.get("name", "Unknown")
                })
                critical_count += 1
            elif doc.get("status") == "expiring":
                alerts.append({
                    "type": "warning",
                    "alert": f"{doc.get('name')} expiring soon",
                    "staff": staff.get("name", "Unknown")
                })
    
    # Get leads stats
    leads_count = await db.leads.count_documents({})
    contacted_leads = await db.leads.count_documents({"status": "contacted"})
    converted_leads = await db.leads.count_documents({"status": "converted"})
    
    outreach_roi = (converted_leads / leads_count * 100) if leads_count > 0 else 0
    
    return {
        "monthly_revenue": round(monthly_revenue, 2),
        "outreach_roi": round(outreach_roi, 1),
        "new_intakes": converted_leads,
        "ndis_burn_rate_per_day": round(burn_rate_per_day, 2),
        "burn_rate_percentage": 72,  # Mock percentage
        "critical_alerts": critical_count,
        "alerts": alerts[:10]
    }


@router.get("/recent-reports")
async def get_recent_reports(limit: int = 5):
    """Get recent shift reports"""
    reports = await db.reports.find({}, {"_id": 0}).sort("date", -1).limit(limit).to_list(limit)
    return reports


@router.get("/upcoming-shifts")
async def get_upcoming_shifts(limit: int = 10):
    """Get upcoming scheduled shifts"""
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    shifts = await db.shifts.find({
        "date": {"$gte": today},
        "status": {"$in": ["scheduled", "confirmed"]}
    }, {"_id": 0}).sort("date", 1).limit(limit).to_list(limit)
    return shifts


@router.get("/monthly-summary")
async def get_monthly_summary():
    """Get monthly summary statistics"""
    now = datetime.now(timezone.utc)
    month_start = f"{now.year}-{now.month:02d}-01"
    
    shifts = await db.shifts.find({
        "date": {"$gte": month_start},
        "status": "completed"
    }, {"_id": 0}).to_list(None)
    
    total_shifts = len(shifts)
    total_hours = sum(shift.get("hours", 0) for shift in shifts)
    total_km = sum(shift.get("km", 0) for shift in shifts)
    
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


@router.get("/calendar/{year}/{month}")
async def get_calendar_data(year: int, month: int):
    """Get calendar data for a specific month"""
    start_date = f"{year}-{month:02d}-01"
    
    if month == 12:
        end_date = f"{year + 1}-01-01"
    else:
        end_date = f"{year}-{month + 1:02d}-01"
    
    shifts = await db.shifts.find({
        "date": {"$gte": start_date, "$lt": end_date}
    }, {"_id": 0}).sort("date", 1).to_list(1000)
    
    # Group by date
    calendar_data = {}
    for shift in shifts:
        date = shift["date"]
        if date not in calendar_data:
            calendar_data[date] = []
        calendar_data[date].append(shift)
    
    return {
        "year": year,
        "month": month,
        "shifts_by_date": calendar_data,
        "total_shifts": len(shifts)
    }
