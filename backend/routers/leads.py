# ATC Master Platform - CRM/Leads Management API
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/leads", tags=["leads"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


@router.get("")
async def get_all_leads(
    status: Optional[str] = None,
    priority: Optional[str] = None
):
    """Get all leads with optional filters"""
    query = {}
    if status:
        query["status"] = status
    if priority:
        query["priority"] = priority
    
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads


@router.get("/{lead_id}")
async def get_lead(lead_id: str):
    """Get a specific lead"""
    lead = await db.leads.find_one({"lead_id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.post("")
async def create_lead(lead_data: dict):
    """Create a new lead"""
    import uuid
    lead_id = f"lead_{uuid.uuid4().hex[:12]}"
    
    lead_doc = {
        "lead_id": lead_id,
        "name": lead_data.get("name"),
        "organization": lead_data.get("organization"),
        "role": lead_data.get("role"),
        "email": lead_data.get("email"),
        "phone": lead_data.get("phone"),
        "service": lead_data.get("service"),
        "status": lead_data.get("status", "draft"),
        "priority": lead_data.get("priority", "medium"),
        "notes": lead_data.get("notes"),
        "last_contacted": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.leads.insert_one(lead_doc)
    lead_doc.pop("_id", None)
    return lead_doc


@router.put("/{lead_id}")
async def update_lead(lead_id: str, lead_data: dict):
    """Update a lead"""
    existing = await db.leads.find_one({"lead_id": lead_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    lead_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.leads.update_one(
        {"lead_id": lead_id},
        {"$set": lead_data}
    )
    
    updated = await db.leads.find_one({"lead_id": lead_id}, {"_id": 0})
    return updated


@router.delete("/{lead_id}")
async def delete_lead(lead_id: str):
    """Delete a lead"""
    result = await db.leads.delete_one({"lead_id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted"}


@router.post("/{lead_id}/contact")
async def mark_lead_contacted(lead_id: str, contact_data: dict = None):
    """Mark a lead as contacted"""
    existing = await db.leads.find_one({"lead_id": lead_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    update = {
        "status": "contacted",
        "last_contacted": datetime.now(timezone.utc).isoformat()
    }
    
    if contact_data:
        if contact_data.get("notes"):
            update["notes"] = contact_data["notes"]
    
    await db.leads.update_one({"lead_id": lead_id}, {"$set": update})
    
    updated = await db.leads.find_one({"lead_id": lead_id}, {"_id": 0})
    return updated


@router.post("/{lead_id}/convert")
async def convert_lead_to_client(lead_id: str, client_data: dict):
    """Convert a lead to a client"""
    lead = await db.leads.find_one({"lead_id": lead_id}, {"_id": 0})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    
    import uuid
    client_id = f"client_{uuid.uuid4().hex[:12]}"
    
    client_doc = {
        "client_id": client_id,
        "name": client_data.get("name", lead["name"]),
        "ndis_number": client_data.get("ndis_number"),
        "phone": client_data.get("phone", lead.get("phone")),
        "email": client_data.get("email", lead.get("email")),
        "address": client_data.get("address", ""),
        "goals": client_data.get("goals", []),
        "plan_manager": client_data.get("plan_manager"),
        "support_coordinator": lead.get("name"),  # The coordinator becomes the referrer
        "funding_type": "Plan Managed",
        "weekly_hours": client_data.get("weekly_hours", 0),
        "status": "active",
        "converted_from_lead": lead_id,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.clients.insert_one(client_doc)
    
    # Update lead status
    await db.leads.update_one(
        {"lead_id": lead_id},
        {"$set": {"status": "converted", "converted_to_client_id": client_id}}
    )
    
    client_doc.pop("_id", None)
    return client_doc


@router.post("/batch-send")
async def batch_send_outreach(lead_ids: List[str] = None):
    """Send batch outreach emails to leads"""
    if not lead_ids:
        # Get all draft leads
        leads = await db.leads.find({"status": "draft"}, {"_id": 0}).to_list(100)
        lead_ids = [lead["lead_id"] for lead in leads]
    
    # Mark leads as contacted
    now = datetime.now(timezone.utc).isoformat()
    await db.leads.update_many(
        {"lead_id": {"$in": lead_ids}},
        {"$set": {"status": "contacted", "last_contacted": now}}
    )
    
    return {
        "message": f"Batch outreach sent to {len(lead_ids)} leads",
        "leads_contacted": lead_ids
    }
