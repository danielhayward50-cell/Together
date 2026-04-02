# ATC Master Platform - Compliance Tracking API
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from pydantic import BaseModel

router = APIRouter(prefix="/compliance", tags=["compliance"])

# MongoDB connection - will be set from server.py
db = None

def set_database(database):
    global db
    db = database


# Required compliance documents for NDIS workers
REQUIRED_DOCUMENTS = [
    {"name": "NDIS Worker Screening Check", "validity_years": 5, "critical": True},
    {"name": "Working with Children Check", "validity_years": 5, "critical": True},
    {"name": "National Police Check", "validity_years": 3, "critical": True},
    {"name": "First Aid Certificate", "validity_years": 3, "critical": True},
    {"name": "CPR Certificate", "validity_years": 1, "critical": True},
    {"name": "NDIS Worker Orientation Module", "validity_years": None, "critical": True},
    {"name": "Driver's Licence", "validity_years": 5, "critical": False},
    {"name": "Car Insurance", "validity_years": 1, "critical": False},
    {"name": "Car Registration", "validity_years": 1, "critical": False},
    {"name": "COVID-19 Vaccination", "validity_years": None, "critical": False},
    {"name": "Manual Handling Training", "validity_years": 2, "critical": False},
    {"name": "Medication Administration", "validity_years": 2, "critical": False},
]


class ComplianceAlert(BaseModel):
    staff_id: str
    staff_name: str
    document_name: str
    expiry_date: str
    days_until_expiry: int
    status: str  # expired, expiring_soon, expiring
    critical: bool


@router.get("/requirements")
async def get_compliance_requirements():
    """Get list of required compliance documents"""
    return REQUIRED_DOCUMENTS


@router.get("/dashboard")
async def get_compliance_dashboard():
    """Get compliance dashboard overview"""
    
    # Get all staff with compliance
    staff_list = await db.staff.find({}, {"_id": 0}).to_list(1000)
    
    today = datetime.now(timezone.utc).date()
    
    all_docs = []
    expired = []
    expiring_30 = []  # Within 30 days
    expiring_60 = []  # Within 60 days
    valid = []
    missing = []
    
    for staff in staff_list:
        compliance_docs = staff.get("compliance", [])
        doc_names = [d.get("name") for d in compliance_docs]
        
        # Check for missing required docs
        for req in REQUIRED_DOCUMENTS:
            if req["critical"] and req["name"] not in doc_names:
                missing.append({
                    "staff_id": staff["staff_id"],
                    "staff_name": staff["name"],
                    "document_name": req["name"],
                    "critical": True
                })
        
        # Check expiry status
        for doc in compliance_docs:
            expiry = doc.get("expiry", "N/A")
            doc_info = {
                "staff_id": staff["staff_id"],
                "staff_name": staff["name"],
                "document_name": doc.get("name"),
                "document_number": doc.get("number"),
                "expiry_date": expiry,
                "status": doc.get("status", "valid")
            }
            
            all_docs.append(doc_info)
            
            if expiry == "N/A" or expiry == "Never":
                valid.append(doc_info)
                continue
            
            try:
                expiry_date = datetime.strptime(expiry, "%Y-%m-%d").date()
                days_until = (expiry_date - today).days
                doc_info["days_until_expiry"] = days_until
                
                if days_until < 0:
                    doc_info["status"] = "expired"
                    expired.append(doc_info)
                elif days_until <= 30:
                    doc_info["status"] = "expiring_soon"
                    expiring_30.append(doc_info)
                elif days_until <= 60:
                    doc_info["status"] = "expiring"
                    expiring_60.append(doc_info)
                else:
                    valid.append(doc_info)
            except:
                valid.append(doc_info)
    
    # Calculate compliance score
    total_required = len(staff_list) * len([r for r in REQUIRED_DOCUMENTS if r["critical"]])
    compliant_count = total_required - len(missing) - len(expired)
    compliance_score = int((compliant_count / total_required) * 100) if total_required > 0 else 100
    
    return {
        "compliance_score": compliance_score,
        "total_staff": len(staff_list),
        "total_documents": len(all_docs),
        "summary": {
            "valid": len(valid),
            "expired": len(expired),
            "expiring_30_days": len(expiring_30),
            "expiring_60_days": len(expiring_60),
            "missing_critical": len(missing)
        },
        "alerts": {
            "expired": expired[:10],
            "expiring_soon": expiring_30[:10],
            "expiring": expiring_60[:10],
            "missing": missing[:10]
        }
    }


@router.get("/staff/{staff_id}")
async def get_staff_compliance(staff_id: str):
    """Get compliance status for a specific staff member"""
    
    staff = await db.staff.find_one({"staff_id": staff_id}, {"_id": 0})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    today = datetime.now(timezone.utc).date()
    compliance_docs = staff.get("compliance", [])
    doc_names = [d.get("name") for d in compliance_docs]
    
    # Check each document
    documents = []
    for doc in compliance_docs:
        expiry = doc.get("expiry", "N/A")
        status = "valid"
        days_until = None
        
        if expiry not in ["N/A", "Never"]:
            try:
                expiry_date = datetime.strptime(expiry, "%Y-%m-%d").date()
                days_until = (expiry_date - today).days
                
                if days_until < 0:
                    status = "expired"
                elif days_until <= 30:
                    status = "expiring_soon"
                elif days_until <= 60:
                    status = "expiring"
            except:
                pass
        
        documents.append({
            "name": doc.get("name"),
            "number": doc.get("number"),
            "expiry": expiry,
            "status": status,
            "days_until_expiry": days_until
        })
    
    # Check for missing required docs
    missing = []
    for req in REQUIRED_DOCUMENTS:
        if req["name"] not in doc_names:
            missing.append({
                "name": req["name"],
                "critical": req["critical"],
                "validity_years": req["validity_years"]
            })
    
    # Calculate staff compliance score
    total_critical = len([r for r in REQUIRED_DOCUMENTS if r["critical"]])
    missing_critical = len([m for m in missing if m["critical"]])
    expired_critical = len([d for d in documents if d["status"] == "expired"])
    compliant = total_critical - missing_critical - expired_critical
    score = int((compliant / total_critical) * 100) if total_critical > 0 else 100
    
    return {
        "staff_id": staff_id,
        "staff_name": staff["name"],
        "compliance_score": score,
        "documents": documents,
        "missing": missing,
        "summary": {
            "total": len(documents),
            "valid": len([d for d in documents if d["status"] == "valid"]),
            "expired": len([d for d in documents if d["status"] == "expired"]),
            "expiring_soon": len([d for d in documents if d["status"] == "expiring_soon"]),
            "expiring": len([d for d in documents if d["status"] == "expiring"]),
            "missing_required": len(missing)
        }
    }


@router.post("/staff/{staff_id}/document")
async def add_compliance_document(staff_id: str, doc_data: dict):
    """Add a compliance document to a staff member"""
    
    staff = await db.staff.find_one({"staff_id": staff_id})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Determine status based on expiry
    expiry = doc_data.get("expiry", "N/A")
    status = "valid"
    
    if expiry not in ["N/A", "Never"]:
        try:
            today = datetime.now(timezone.utc).date()
            expiry_date = datetime.strptime(expiry, "%Y-%m-%d").date()
            days_until = (expiry_date - today).days
            
            if days_until < 0:
                status = "expired"
            elif days_until <= 30:
                status = "expiring"
        except:
            pass
    
    doc_data["status"] = status
    doc_data["added_at"] = datetime.now(timezone.utc).isoformat()
    
    await db.staff.update_one(
        {"staff_id": staff_id},
        {"$push": {"compliance": doc_data}}
    )
    
    return {"message": "Document added", "document": doc_data}


@router.put("/staff/{staff_id}/document/{doc_name}")
async def update_compliance_document(staff_id: str, doc_name: str, doc_data: dict):
    """Update a compliance document"""
    
    staff = await db.staff.find_one({"staff_id": staff_id})
    if not staff:
        raise HTTPException(status_code=404, detail="Staff not found")
    
    # Update the specific document
    await db.staff.update_one(
        {"staff_id": staff_id, "compliance.name": doc_name},
        {"$set": {
            "compliance.$.number": doc_data.get("number"),
            "compliance.$.expiry": doc_data.get("expiry"),
            "compliance.$.status": doc_data.get("status", "valid"),
            "compliance.$.updated_at": datetime.now(timezone.utc).isoformat()
        }}
    )
    
    return {"message": "Document updated"}


@router.delete("/staff/{staff_id}/document/{doc_name}")
async def delete_compliance_document(staff_id: str, doc_name: str):
    """Delete a compliance document"""
    
    await db.staff.update_one(
        {"staff_id": staff_id},
        {"$pull": {"compliance": {"name": doc_name}}}
    )
    
    return {"message": "Document deleted"}


@router.get("/expiring")
async def get_expiring_documents(days: int = 30):
    """Get all documents expiring within specified days"""
    
    staff_list = await db.staff.find({}, {"_id": 0}).to_list(1000)
    today = datetime.now(timezone.utc).date()
    
    expiring = []
    
    for staff in staff_list:
        for doc in staff.get("compliance", []):
            expiry = doc.get("expiry", "N/A")
            if expiry in ["N/A", "Never"]:
                continue
            
            try:
                expiry_date = datetime.strptime(expiry, "%Y-%m-%d").date()
                days_until = (expiry_date - today).days
                
                if 0 <= days_until <= days:
                    expiring.append({
                        "staff_id": staff["staff_id"],
                        "staff_name": staff["name"],
                        "document_name": doc.get("name"),
                        "document_number": doc.get("number"),
                        "expiry_date": expiry,
                        "days_until_expiry": days_until
                    })
            except:
                pass
    
    # Sort by days until expiry
    expiring.sort(key=lambda x: x["days_until_expiry"])
    
    return expiring
