# ATC Master Platform - Client Management API
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/clients", tags=["clients"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


@router.get("")
async def get_all_clients():
    """Get all clients"""
    clients = await db.clients.find({}, {"_id": 0}).to_list(1000)
    return clients


@router.get("/{client_id}")
async def get_client(client_id: str):
    """Get a specific client"""
    client = await db.clients.find_one({"client_id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("")
async def create_client(client_data: dict):
    """Create a new client"""
    import uuid
    client_id = f"client_{uuid.uuid4().hex[:12]}"
    
    client_doc = {
        "client_id": client_id,
        "name": client_data.get("name"),
        "ndis_number": client_data.get("ndis_number"),
        "phone": client_data.get("phone"),
        "email": client_data.get("email"),
        "address": client_data.get("address", ""),
        "emergency_contact": client_data.get("emergency_contact"),
        "emergency_phone": client_data.get("emergency_phone"),
        "dob": client_data.get("dob"),
        "goals": client_data.get("goals", []),
        "plan_manager": client_data.get("plan_manager"),
        "plan_manager_email": client_data.get("plan_manager_email"),
        "support_coordinator": client_data.get("support_coordinator"),
        "funding_type": client_data.get("funding_type", "Plan Managed"),
        "plan_start_date": client_data.get("plan_start_date"),
        "plan_end_date": client_data.get("plan_end_date"),
        "weekly_hours": client_data.get("weekly_hours", 0),
        "support_workers": client_data.get("support_workers", []),
        "likes": client_data.get("likes", []),
        "triggers": client_data.get("triggers", []),
        "status": "active",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.clients.insert_one(client_doc)
    client_doc.pop("_id", None)
    return client_doc


@router.put("/{client_id}")
async def update_client(client_id: str, client_data: dict):
    """Update a client"""
    existing = await db.clients.find_one({"client_id": client_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Client not found")
    
    client_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.clients.update_one(
        {"client_id": client_id},
        {"$set": client_data}
    )
    
    updated = await db.clients.find_one({"client_id": client_id}, {"_id": 0})
    return updated


@router.delete("/{client_id}")
async def delete_client(client_id: str):
    """Delete a client"""
    result = await db.clients.delete_one({"client_id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    return {"message": "Client deleted"}


@router.get("/{client_id}/shifts")
async def get_client_shifts(client_id: str):
    """Get all shifts for a client"""
    shifts = await db.shifts.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return shifts


@router.get("/{client_id}/invoices")
async def get_client_invoices(client_id: str):
    """Get all invoices for a client"""
    invoices = await db.invoices.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return invoices
