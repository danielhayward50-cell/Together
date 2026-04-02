# ATC Master Platform - Shift Management API
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/shifts", tags=["shifts"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


@router.get("")
async def get_all_shifts(
    status: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    staff_id: Optional[str] = None,
    client_id: Optional[str] = None
):
    """Get all shifts with optional filters"""
    query = {}
    
    if status:
        query["status"] = status
    if date_from:
        query["date"] = {"$gte": date_from}
    if date_to:
        if "date" in query:
            query["date"]["$lte"] = date_to
        else:
            query["date"] = {"$lte": date_to}
    if staff_id:
        query["staff_id"] = staff_id
    if client_id:
        query["client_id"] = client_id
    
    shifts = await db.shifts.find(query, {"_id": 0}).sort("date", -1).to_list(1000)
    return shifts


@router.get("/{shift_id}")
async def get_shift(shift_id: str):
    """Get a specific shift"""
    shift = await db.shifts.find_one({"shift_id": shift_id}, {"_id": 0})
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    return shift


@router.post("")
async def create_shift(shift_data: dict):
    """Create a new shift"""
    import uuid
    shift_id = f"shift_{uuid.uuid4().hex[:12]}"
    
    shift_doc = {
        "shift_id": shift_id,
        "date": shift_data.get("date"),
        "participant": shift_data.get("participant"),
        "client_id": shift_data.get("client_id"),
        "worker": shift_data.get("worker"),
        "staff_id": shift_data.get("staff_id"),
        "start_time": shift_data.get("start_time"),
        "end_time": shift_data.get("end_time"),
        "hours": shift_data.get("hours", 0),
        "km": shift_data.get("km", 0),
        "status": shift_data.get("status", "scheduled"),
        "activities": shift_data.get("activities", []),
        "engagement": shift_data.get("engagement", []),
        "support": shift_data.get("support", []),
        "goals": shift_data.get("goals", []),
        "notes": shift_data.get("notes"),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.shifts.insert_one(shift_doc)
    shift_doc.pop("_id", None)
    return shift_doc


@router.put("/{shift_id}")
async def update_shift(shift_id: str, shift_data: dict):
    """Update a shift"""
    existing = await db.shifts.find_one({"shift_id": shift_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    shift_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.shifts.update_one(
        {"shift_id": shift_id},
        {"$set": shift_data}
    )
    
    updated = await db.shifts.find_one({"shift_id": shift_id}, {"_id": 0})
    return updated


@router.delete("/{shift_id}")
async def delete_shift(shift_id: str):
    """Delete a shift"""
    result = await db.shifts.delete_one({"shift_id": shift_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Shift not found")
    return {"message": "Shift deleted"}


@router.post("/{shift_id}/complete")
async def complete_shift(shift_id: str, completion_data: dict):
    """Mark a shift as completed with report data"""
    existing = await db.shifts.find_one({"shift_id": shift_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    update = {
        "status": "completed",
        "activities": completion_data.get("activities", []),
        "engagement": completion_data.get("engagement", []),
        "support": completion_data.get("support", []),
        "goals": completion_data.get("goals", []),
        "notes": completion_data.get("notes"),
        "completed_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.shifts.update_one({"shift_id": shift_id}, {"$set": update})
    
    updated = await db.shifts.find_one({"shift_id": shift_id}, {"_id": 0})
    return updated


@router.get("/calendar/month/{year}/{month}")
async def get_shifts_for_month(year: int, month: int):
    """Get all shifts for a specific month"""
    start_date = f"{year}-{month:02d}-01"
    
    # Calculate end date
    if month == 12:
        end_date = f"{year + 1}-01-01"
    else:
        end_date = f"{year}-{month + 1:02d}-01"
    
    shifts = await db.shifts.find({
        "date": {"$gte": start_date, "$lt": end_date}
    }, {"_id": 0}).sort("date", 1).to_list(1000)
    
    return shifts
