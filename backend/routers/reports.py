# ATC Master Platform - Reports API
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/reports", tags=["reports"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


@router.get("")
async def get_all_reports(
    type: Optional[str] = None,
    client_id: Optional[str] = None,
    limit: int = 50
):
    """Get all reports with optional filters"""
    query = {}
    if type:
        query["type"] = type
    if client_id:
        query["client_id"] = client_id
    
    reports = await db.reports.find(query, {"_id": 0}).sort("date", -1).limit(limit).to_list(limit)
    return reports


@router.get("/{report_id}")
async def get_report(report_id: str):
    """Get a specific report"""
    report = await db.reports.find_one({"report_id": report_id}, {"_id": 0})
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report


@router.post("")
async def create_report(report_data: dict):
    """Create a new report"""
    import uuid
    report_id = f"report_{uuid.uuid4().hex[:12]}"
    
    report_doc = {
        "report_id": report_id,
        "type": report_data.get("type", "daily"),
        "title": report_data.get("title"),
        "date": report_data.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d")),
        "author": report_data.get("author"),
        "status": report_data.get("status", "completed"),
        "participant": report_data.get("participant"),
        "client_id": report_data.get("client_id"),
        "ndis_number": report_data.get("ndis_number"),
        "hours": report_data.get("hours", 0),
        "km": report_data.get("km", 0),
        "mood": report_data.get("mood"),
        "shift_time": report_data.get("shift_time"),
        "sections": report_data.get("sections", []),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.reports.insert_one(report_doc)
    report_doc.pop("_id", None)
    return report_doc


@router.put("/{report_id}")
async def update_report(report_id: str, report_data: dict):
    """Update a report"""
    existing = await db.reports.find_one({"report_id": report_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Report not found")
    
    report_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.reports.update_one(
        {"report_id": report_id},
        {"$set": report_data}
    )
    
    updated = await db.reports.find_one({"report_id": report_id}, {"_id": 0})
    return updated


@router.delete("/{report_id}")
async def delete_report(report_id: str):
    """Delete a report"""
    result = await db.reports.delete_one({"report_id": report_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Report not found")
    return {"message": "Report deleted"}


@router.post("/from-shift/{shift_id}")
async def create_report_from_shift(shift_id: str, report_data: dict):
    """Create a report from a completed shift"""
    shift = await db.shifts.find_one({"shift_id": shift_id}, {"_id": 0})
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    
    # Get client info
    client = None
    if shift.get("client_id"):
        client = await db.clients.find_one({"client_id": shift["client_id"]}, {"_id": 0})
    
    import uuid
    report_id = f"report_{uuid.uuid4().hex[:12]}"
    
    report_doc = {
        "report_id": report_id,
        "type": "daily",
        "title": f"Daily Shift Report - {shift.get('participant', 'Unknown')}",
        "date": shift.get("date"),
        "author": shift.get("worker"),
        "status": "completed",
        "participant": shift.get("participant"),
        "client_id": shift.get("client_id"),
        "ndis_number": client.get("ndis_number") if client else None,
        "hours": shift.get("hours", 0),
        "km": shift.get("km", 0),
        "mood": report_data.get("mood"),
        "shift_time": f"{shift.get('start_time', '')} - {shift.get('end_time', '')}",
        "sections": report_data.get("sections", [
            {"title": "Summary", "content": report_data.get("summary", "")},
            {"title": "Activities", "content": ", ".join(shift.get("activities", []))},
            {"title": "Goals Progress", "content": ", ".join(shift.get("goals", []))}
        ]),
        "shift_id": shift_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.reports.insert_one(report_doc)
    report_doc.pop("_id", None)
    return report_doc
