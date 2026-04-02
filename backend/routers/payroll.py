# ATC Master Platform - Payroll & SCHADS Management API
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel

router = APIRouter(prefix="/payroll", tags=["payroll"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


# SCHADS Award Rates (2025-2026)
SCHADS_RATES = {
    "level_2": {
        "name": "Social and Community Services Employee Level 2",
        "weekday": 38.08,
        "saturday": 57.12,
        "sunday": 76.16,
        "public_holiday": 95.20,
        "evening": 42.65,  # 6pm-midnight
        "night": 44.15,    # midnight-6am
    },
    "level_3": {
        "name": "Social and Community Services Employee Level 3",
        "weekday": 40.12,
        "saturday": 60.18,
        "sunday": 80.24,
        "public_holiday": 100.30,
        "evening": 44.93,
        "night": 46.54,
    },
    "level_4": {
        "name": "Social and Community Services Employee Level 4",
        "weekday": 43.25,
        "saturday": 64.88,
        "sunday": 86.50,
        "public_holiday": 108.13,
        "evening": 48.44,
        "night": 50.17,
    }
}


class PayrollEntry(BaseModel):
    staff_id: str
    staff_name: str
    period_start: str
    period_end: str
    shifts: List[dict]
    total_hours: float
    weekday_hours: float
    saturday_hours: float
    sunday_hours: float
    public_holiday_hours: float
    evening_hours: float
    gross_pay: float
    super_contribution: float
    net_pay: float
    status: str = "pending"


@router.get("/rates")
async def get_schads_rates():
    """Get current SCHADS award rates"""
    return SCHADS_RATES


@router.get("/calculate")
async def calculate_payroll(
    staff_id: str,
    period_start: str,
    period_end: str
):
    """Calculate payroll for a staff member for a period"""
    
    # Get staff details
    staff = await db.staff.find_one({"staff_id": staff_id}, {"_id": 0})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Get completed shifts for the period
    shifts = await db.shifts.find({
        "staff_id": staff_id,
        "status": "completed",
        "date": {"$gte": period_start, "$lte": period_end}
    }, {"_id": 0}).to_list(1000)
    
    # Calculate hours by type
    weekday_hours = 0
    saturday_hours = 0
    sunday_hours = 0
    evening_hours = 0
    total_hours = 0
    
    for shift in shifts:
        hours = shift.get("hours", 0)
        total_hours += hours
        
        # Parse date to determine day type
        date_str = shift.get("date", "")
        try:
            date_obj = datetime.strptime(date_str, "%Y-%m-%d")
            day_of_week = date_obj.weekday()  # 0=Monday, 6=Sunday
            
            if day_of_week == 5:  # Saturday
                saturday_hours += hours
            elif day_of_week == 6:  # Sunday
                sunday_hours += hours
            else:
                weekday_hours += hours
        except:
            weekday_hours += hours
    
    # Get base rate (default to level 2)
    base_rate = staff.get("rate", SCHADS_RATES["level_2"]["weekday"])
    saturday_rate = base_rate * 1.5
    sunday_rate = base_rate * 2.0
    
    # Calculate gross pay
    gross_pay = (
        (weekday_hours * base_rate) +
        (saturday_hours * saturday_rate) +
        (sunday_hours * sunday_rate)
    )
    
    # Superannuation (11.5% as of 2025)
    super_rate = 0.115
    super_contribution = round(gross_pay * super_rate, 2)
    
    return {
        "staff_id": staff_id,
        "staff_name": staff.get("name"),
        "period": f"{period_start} to {period_end}",
        "total_shifts": len(shifts),
        "hours": {
            "total": total_hours,
            "weekday": weekday_hours,
            "saturday": saturday_hours,
            "sunday": sunday_hours,
            "evening": evening_hours
        },
        "rates": {
            "weekday": base_rate,
            "saturday": saturday_rate,
            "sunday": sunday_rate
        },
        "pay": {
            "gross": round(gross_pay, 2),
            "super": super_contribution,
            "net_estimate": round(gross_pay - (gross_pay * 0.2), 2)  # Rough tax estimate
        },
        "shifts": shifts
    }


@router.get("/summary")
async def get_payroll_summary(period_start: str, period_end: str):
    """Get payroll summary for all staff for a period"""
    
    # Get all staff
    staff_list = await db.staff.find({}, {"_id": 0}).to_list(1000)
    
    summaries = []
    total_gross = 0
    total_hours = 0
    total_super = 0
    
    for staff in staff_list:
        # Get completed shifts
        shifts = await db.shifts.find({
            "staff_id": staff["staff_id"],
            "status": "completed",
            "date": {"$gte": period_start, "$lte": period_end}
        }, {"_id": 0}).to_list(1000)
        
        hours = sum(s.get("hours", 0) for s in shifts)
        base_rate = staff.get("rate", 38.08)
        gross = hours * base_rate
        super_amount = gross * 0.115
        
        total_hours += hours
        total_gross += gross
        total_super += super_amount
        
        summaries.append({
            "staff_id": staff["staff_id"],
            "name": staff["name"],
            "role": staff.get("role"),
            "shifts": len(shifts),
            "hours": hours,
            "gross_pay": round(gross, 2),
            "super": round(super_amount, 2)
        })
    
    return {
        "period": f"{period_start} to {period_end}",
        "staff": summaries,
        "totals": {
            "staff_count": len(summaries),
            "total_hours": total_hours,
            "total_gross": round(total_gross, 2),
            "total_super": round(total_super, 2),
            "total_cost": round(total_gross + total_super, 2)
        }
    }


@router.post("/process")
async def process_payroll(period_start: str, period_end: str):
    """Process payroll for all staff"""
    import uuid
    
    # Get summary
    summary = await get_payroll_summary(period_start, period_end)
    
    # Create payroll record
    payroll_id = f"payroll_{uuid.uuid4().hex[:12]}"
    payroll_doc = {
        "payroll_id": payroll_id,
        "period_start": period_start,
        "period_end": period_end,
        "staff_entries": summary["staff"],
        "totals": summary["totals"],
        "status": "processed",
        "processed_at": datetime.now(timezone.utc).isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.payroll.insert_one(payroll_doc)
    payroll_doc.pop("_id", None)
    
    return payroll_doc


@router.get("/history")
async def get_payroll_history(limit: int = 10):
    """Get payroll processing history"""
    payrolls = await db.payroll.find(
        {}, {"_id": 0}
    ).sort("processed_at", -1).limit(limit).to_list(limit)
    
    return payrolls


@router.get("/{payroll_id}")
async def get_payroll(payroll_id: str):
    """Get a specific payroll record"""
    payroll = await db.payroll.find_one({"payroll_id": payroll_id}, {"_id": 0})
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    return payroll
