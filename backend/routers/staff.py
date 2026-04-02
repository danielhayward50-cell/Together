# ATC Master Platform - Staff Management API
from fastapi import APIRouter, HTTPException, Request
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/staff", tags=["staff"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


@router.get("")
async def get_all_staff():
    """Get all staff members"""
    staff = await db.staff.find({}, {"_id": 0}).to_list(1000)
    return staff


@router.get("/{staff_id}")
async def get_staff_member(staff_id: str):
    """Get a specific staff member"""
    staff = await db.staff.find_one({"staff_id": staff_id}, {"_id": 0})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff


@router.post("")
async def create_staff_member(staff_data: dict):
    """Create a new staff member"""
    import uuid
    staff_id = f"staff_{uuid.uuid4().hex[:12]}"
    
    staff_doc = {
        "staff_id": staff_id,
        "name": staff_data.get("name"),
        "role": staff_data.get("role", "Support Worker"),
        "email": staff_data.get("email"),
        "phone": staff_data.get("phone"),
        "address": staff_data.get("address", ""),
        "tfn": staff_data.get("tfn"),
        "bsb": staff_data.get("bsb"),
        "acc": staff_data.get("acc"),
        "sf": staff_data.get("sf"),
        "sn": staff_data.get("sn"),
        "rate": staff_data.get("rate", 38.08),
        "compliance": staff_data.get("compliance", []),
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.staff.insert_one(staff_doc)
    staff_doc.pop("_id", None)
    return staff_doc


@router.put("/{staff_id}")
async def update_staff_member(staff_id: str, staff_data: dict):
    """Update a staff member"""
    existing = await db.staff.find_one({"staff_id": staff_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Staff member not found")
    
    staff_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.staff.update_one(
        {"staff_id": staff_id},
        {"$set": staff_data}
    )
    
    updated = await db.staff.find_one({"staff_id": staff_id}, {"_id": 0})
    return updated


@router.delete("/{staff_id}")
async def delete_staff_member(staff_id: str):
    """Delete a staff member"""
    result = await db.staff.delete_one({"staff_id": staff_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return {"message": "Staff member deleted"}


@router.get("/{staff_id}/compliance")
async def get_staff_compliance(staff_id: str):
    """Get compliance documents for a staff member"""
    staff = await db.staff.find_one({"staff_id": staff_id}, {"_id": 0})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff.get("compliance", [])


@router.post("/{staff_id}/compliance")
async def add_compliance_doc(staff_id: str, doc_data: dict):
    """Add a compliance document to a staff member"""
    existing = await db.staff.find_one({"staff_id": staff_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Staff member not found")
    
    await db.staff.update_one(
        {"staff_id": staff_id},
        {"$push": {"compliance": doc_data}}
    )
    
    return {"message": "Compliance document added"}
