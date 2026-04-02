# ATC Master Platform - Invoice Management API
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timezone

router = APIRouter(prefix="/invoices", tags=["invoices"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


@router.get("")
async def get_all_invoices(
    status: Optional[str] = None,
    client_id: Optional[str] = None
):
    """Get all invoices with optional filters"""
    query = {}
    if status:
        query["status"] = status
    if client_id:
        query["client_id"] = client_id
    
    invoices = await db.invoices.find(query, {"_id": 0}).sort("date", -1).to_list(1000)
    return invoices


@router.get("/{invoice_id}")
async def get_invoice(invoice_id: str):
    """Get a specific invoice"""
    invoice = await db.invoices.find_one({"invoice_id": invoice_id}, {"_id": 0})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return invoice


@router.post("")
async def create_invoice(invoice_data: dict):
    """Create a new invoice"""
    import uuid
    invoice_id = f"inv_{uuid.uuid4().hex[:12]}"
    
    # Generate invoice number
    count = await db.invoices.count_documents({})
    invoice_no = f"ATC-{datetime.now().year}-{count + 1:03d}"
    
    # Calculate totals
    lines = invoice_data.get("lines", [])
    total_hours = sum(line.get("qty", 0) for line in lines if line.get("unit") == "hours")
    total_km = sum(line.get("qty", 0) for line in lines if line.get("unit") == "km")
    total_travel = sum(line.get("total", 0) for line in lines if line.get("unit") == "km")
    total_payable = sum(line.get("total", 0) for line in lines)
    
    invoice_doc = {
        "invoice_id": invoice_id,
        "invoice_no": invoice_no,
        "date": invoice_data.get("date", datetime.now(timezone.utc).strftime("%Y-%m-%d")),
        "period": invoice_data.get("period"),
        "client": invoice_data.get("client"),
        "client_id": invoice_data.get("client_id"),
        "ndis_number": invoice_data.get("ndis_number"),
        "worker": invoice_data.get("worker"),
        "staff_id": invoice_data.get("staff_id"),
        "funding_manager": invoice_data.get("funding_manager"),
        "lines": lines,
        "total_hours": total_hours,
        "total_km": total_km,
        "total_travel": total_travel,
        "total_payable": total_payable,
        "status": "draft",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.invoices.insert_one(invoice_doc)
    invoice_doc.pop("_id", None)
    return invoice_doc


@router.put("/{invoice_id}")
async def update_invoice(invoice_id: str, invoice_data: dict):
    """Update an invoice"""
    existing = await db.invoices.find_one({"invoice_id": invoice_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Recalculate totals if lines changed
    if "lines" in invoice_data:
        lines = invoice_data["lines"]
        invoice_data["total_hours"] = sum(line.get("qty", 0) for line in lines if line.get("unit") == "hours")
        invoice_data["total_km"] = sum(line.get("qty", 0) for line in lines if line.get("unit") == "km")
        invoice_data["total_travel"] = sum(line.get("total", 0) for line in lines if line.get("unit") == "km")
        invoice_data["total_payable"] = sum(line.get("total", 0) for line in lines)
    
    invoice_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.invoices.update_one(
        {"invoice_id": invoice_id},
        {"$set": invoice_data}
    )
    
    updated = await db.invoices.find_one({"invoice_id": invoice_id}, {"_id": 0})
    return updated


@router.delete("/{invoice_id}")
async def delete_invoice(invoice_id: str):
    """Delete an invoice"""
    result = await db.invoices.delete_one({"invoice_id": invoice_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Invoice deleted"}


@router.post("/{invoice_id}/send")
async def send_invoice(invoice_id: str):
    """Mark invoice as sent"""
    existing = await db.invoices.find_one({"invoice_id": invoice_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    await db.invoices.update_one(
        {"invoice_id": invoice_id},
        {"$set": {"status": "sent", "sent_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Invoice sent"}


@router.post("/{invoice_id}/paid")
async def mark_invoice_paid(invoice_id: str):
    """Mark invoice as paid"""
    existing = await db.invoices.find_one({"invoice_id": invoice_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    await db.invoices.update_one(
        {"invoice_id": invoice_id},
        {"$set": {"status": "paid", "paid_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"message": "Invoice marked as paid"}


@router.post("/generate-from-shifts")
async def generate_invoice_from_shifts(data: dict):
    """Generate invoice from completed shifts"""
    client_id = data.get("client_id")
    period = data.get("period")  # e.g., "February 2026"
    
    # Get client details
    client = await db.clients.find_one({"client_id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    
    # Parse period to get date range
    # This is simplified - in production, properly parse the period
    shifts = await db.shifts.find({
        "client_id": client_id,
        "status": "completed"
    }, {"_id": 0}).to_list(1000)
    
    if not shifts:
        raise HTTPException(status_code=400, detail="No completed shifts found")
    
    # Build invoice lines
    hourly_rate = 70.23  # NDIS weekday rate
    km_rate = 0.95
    
    lines = []
    for shift in shifts:
        if shift.get("hours", 0) > 0:
            lines.append({
                "date": shift["date"],
                "description": f"Community Access Support - {shift['participant']}",
                "ndis_code": "01_002_0107_1_1",
                "qty": shift["hours"],
                "unit": "hours",
                "rate": hourly_rate,
                "total": round(shift["hours"] * hourly_rate, 2)
            })
        if shift.get("km", 0) > 0:
            lines.append({
                "date": shift["date"],
                "description": "Provider Travel",
                "ndis_code": "09_799_0106_6_3",
                "qty": shift["km"],
                "unit": "km",
                "rate": km_rate,
                "total": round(shift["km"] * km_rate, 2)
            })
    
    # Create invoice
    invoice_data = {
        "client": client["name"],
        "client_id": client_id,
        "ndis_number": client.get("ndis_number", ""),
        "worker": shifts[0].get("worker", ""),
        "period": period,
        "funding_manager": client.get("plan_manager", ""),
        "lines": lines
    }
    
    return await create_invoice(invoice_data)
