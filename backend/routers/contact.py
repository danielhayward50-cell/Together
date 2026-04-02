# Contact & Booking Router
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, timezone
from bson import ObjectId
import os

router = APIRouter(prefix="/contact", tags=["contact"])

# Get MongoDB connection
def get_db():
    from pymongo import MongoClient
    client = MongoClient(os.environ.get("MONGO_URL"))
    return client[os.environ.get("DB_NAME", "atc_platform")]

# Models
class ContactInquiry(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    source: Optional[str] = "landing_page"

class BookingRequest(BaseModel):
    name: str
    email: EmailStr
    phone: str
    preferred_date: str
    preferred_time: str
    service_type: str
    notes: Optional[str] = None

class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str]
    message: str
    source: str
    status: str
    created_at: str

class BookingResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    preferred_date: str
    preferred_time: str
    service_type: str
    notes: Optional[str]
    status: str
    created_at: str

# Contact Inquiry Endpoints
@router.post("/inquiry", response_model=dict)
async def submit_inquiry(inquiry: ContactInquiry):
    """Submit a contact inquiry from the landing page"""
    db = get_db()
    
    inquiry_doc = {
        "name": inquiry.name,
        "email": inquiry.email,
        "phone": inquiry.phone,
        "message": inquiry.message,
        "source": inquiry.source,
        "status": "new",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = db.contact_inquiries.insert_one(inquiry_doc)
    
    return {
        "success": True,
        "message": "Thank you for your inquiry! We'll get back to you within 24 hours.",
        "inquiry_id": str(result.inserted_id)
    }

@router.get("/inquiries", response_model=List[ContactResponse])
async def get_inquiries(status: Optional[str] = None, limit: int = 50):
    """Get all contact inquiries (for admin dashboard)"""
    db = get_db()
    
    query = {}
    if status:
        query["status"] = status
    
    inquiries = list(db.contact_inquiries.find(query, {"_id": 1, "name": 1, "email": 1, "phone": 1, "message": 1, "source": 1, "status": 1, "created_at": 1}).sort("created_at", -1).limit(limit))
    
    return [
        ContactResponse(
            id=str(inq["_id"]),
            name=inq["name"],
            email=inq["email"],
            phone=inq.get("phone"),
            message=inq["message"],
            source=inq.get("source", "landing_page"),
            status=inq.get("status", "new"),
            created_at=inq.get("created_at", "")
        )
        for inq in inquiries
    ]

@router.patch("/inquiry/{inquiry_id}/status")
async def update_inquiry_status(inquiry_id: str, status: str):
    """Update inquiry status (new, contacted, converted, archived)"""
    db = get_db()
    
    valid_statuses = ["new", "contacted", "converted", "archived"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = db.contact_inquiries.update_one(
        {"_id": ObjectId(inquiry_id)},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    
    return {"success": True, "message": f"Inquiry status updated to {status}"}

# Booking/Consultation Endpoints
@router.post("/booking", response_model=dict)
async def submit_booking(booking: BookingRequest):
    """Submit a consultation booking request"""
    db = get_db()
    
    booking_doc = {
        "name": booking.name,
        "email": booking.email,
        "phone": booking.phone,
        "preferred_date": booking.preferred_date,
        "preferred_time": booking.preferred_time,
        "service_type": booking.service_type,
        "notes": booking.notes,
        "status": "pending",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    
    result = db.consultation_bookings.insert_one(booking_doc)
    
    return {
        "success": True,
        "message": "Your consultation request has been submitted! We'll confirm your appointment within 24 hours.",
        "booking_id": str(result.inserted_id)
    }

@router.get("/bookings", response_model=List[BookingResponse])
async def get_bookings(status: Optional[str] = None, limit: int = 50):
    """Get all consultation bookings (for admin dashboard)"""
    db = get_db()
    
    query = {}
    if status:
        query["status"] = status
    
    bookings = list(db.consultation_bookings.find(query, {"_id": 1, "name": 1, "email": 1, "phone": 1, "preferred_date": 1, "preferred_time": 1, "service_type": 1, "notes": 1, "status": 1, "created_at": 1}).sort("created_at", -1).limit(limit))
    
    return [
        BookingResponse(
            id=str(b["_id"]),
            name=b["name"],
            email=b["email"],
            phone=b["phone"],
            preferred_date=b["preferred_date"],
            preferred_time=b["preferred_time"],
            service_type=b["service_type"],
            notes=b.get("notes"),
            status=b.get("status", "pending"),
            created_at=b.get("created_at", "")
        )
        for b in bookings
    ]

@router.patch("/booking/{booking_id}/status")
async def update_booking_status(booking_id: str, status: str):
    """Update booking status (pending, confirmed, completed, cancelled)"""
    db = get_db()
    
    valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    result = db.consultation_bookings.update_one(
        {"_id": ObjectId(booking_id)},
        {"$set": {"status": status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"success": True, "message": f"Booking status updated to {status}"}

# Stats endpoint for dashboard
@router.get("/stats")
async def get_contact_stats():
    """Get contact and booking statistics"""
    db = get_db()
    
    # Count inquiries by status
    inquiry_stats = {
        "total": db.contact_inquiries.count_documents({}),
        "new": db.contact_inquiries.count_documents({"status": "new"}),
        "contacted": db.contact_inquiries.count_documents({"status": "contacted"}),
        "converted": db.contact_inquiries.count_documents({"status": "converted"})
    }
    
    # Count bookings by status
    booking_stats = {
        "total": db.consultation_bookings.count_documents({}),
        "pending": db.consultation_bookings.count_documents({"status": "pending"}),
        "confirmed": db.consultation_bookings.count_documents({"status": "confirmed"}),
        "completed": db.consultation_bookings.count_documents({"status": "completed"})
    }
    
    return {
        "inquiries": inquiry_stats,
        "bookings": booking_stats
    }
