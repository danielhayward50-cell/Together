# ATC Master Platform - MongoDB Models
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
import uuid


def generate_id(prefix: str = "") -> str:
    """Generate a unique ID with optional prefix"""
    return f"{prefix}{uuid.uuid4().hex[:12]}" if prefix else uuid.uuid4().hex[:12]


# ==================== USER MODELS ====================
class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: str = "staff"  # owner, staff, client


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "staff"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    user_id: str
    email: str
    name: str
    role: str
    picture: Optional[str] = None
    created_at: Optional[str] = None


class TokenResponse(BaseModel):
    user: UserResponse
    message: str = "Login successful"


# ==================== STAFF MODELS ====================
class ComplianceDoc(BaseModel):
    name: str
    number: Optional[str] = None
    expiry: str
    status: str = "valid"  # valid, expiring, expired, pending


class StaffMember(BaseModel):
    staff_id: str = Field(default_factory=lambda: generate_id("staff_"))
    name: str
    role: str = "Support Worker"
    email: EmailStr
    phone: str
    address: str
    tfn: Optional[str] = None
    bsb: Optional[str] = None
    acc: Optional[str] = None
    sf: Optional[str] = None  # Super fund
    sn: Optional[str] = None  # Super member number
    rate: float = 38.08  # SCHADS hourly rate
    compliance: List[ComplianceDoc] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class StaffCreate(BaseModel):
    name: str
    role: str = "Support Worker"
    email: EmailStr
    phone: str
    address: str
    rate: float = 38.08


# ==================== CLIENT MODELS ====================
class ClientModel(BaseModel):
    client_id: str = Field(default_factory=lambda: generate_id("client_"))
    name: str
    ndis_number: str
    phone: str
    email: EmailStr
    address: str
    emergency_contact: Optional[str] = None
    emergency_phone: Optional[str] = None
    dob: Optional[str] = None
    goals: List[str] = []
    plan_manager: Optional[str] = None
    plan_manager_email: Optional[str] = None
    support_coordinator: Optional[str] = None
    funding_type: str = "Plan Managed"
    plan_start_date: Optional[str] = None
    plan_end_date: Optional[str] = None
    weekly_hours: float = 0
    support_workers: List[str] = []
    likes: List[str] = []
    triggers: List[str] = []
    status: str = "active"
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ClientCreate(BaseModel):
    name: str
    ndis_number: str
    phone: str
    email: EmailStr
    address: str
    goals: List[str] = []
    weekly_hours: float = 0


# ==================== SHIFT MODELS ====================
class ShiftModel(BaseModel):
    shift_id: str = Field(default_factory=lambda: generate_id("shift_"))
    date: str
    participant: str  # Client name
    client_id: Optional[str] = None
    worker: str  # Staff name
    staff_id: Optional[str] = None
    start_time: str
    end_time: str
    hours: float
    km: float = 0
    status: str = "scheduled"  # scheduled, completed, cancelled
    activities: List[str] = []
    engagement: List[str] = []
    support: List[str] = []
    goals: List[str] = []
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ShiftCreate(BaseModel):
    date: str
    participant: str
    client_id: Optional[str] = None
    worker: str
    staff_id: Optional[str] = None
    start_time: str
    end_time: str
    hours: float
    km: float = 0
    status: str = "scheduled"


# ==================== INVOICE MODELS ====================
class InvoiceLine(BaseModel):
    date: str
    description: str
    ndis_code: str
    qty: float
    unit: str = "hours"
    rate: float
    total: float


class InvoiceModel(BaseModel):
    invoice_id: str = Field(default_factory=lambda: generate_id("inv_"))
    invoice_no: str
    date: str
    period: str
    client: str
    client_id: Optional[str] = None
    ndis_number: str
    worker: str
    staff_id: Optional[str] = None
    funding_manager: Optional[str] = None
    lines: List[InvoiceLine] = []
    total_hours: float = 0
    total_km: float = 0
    total_travel: float = 0
    total_payable: float = 0
    status: str = "draft"  # draft, sent, paid, overdue, pending
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class InvoiceCreate(BaseModel):
    client: str
    client_id: Optional[str] = None
    ndis_number: str
    worker: str
    period: str
    lines: List[InvoiceLine] = []


# ==================== REPORT MODELS ====================
class ReportSection(BaseModel):
    title: str
    content: str


class ReportModel(BaseModel):
    report_id: str = Field(default_factory=lambda: generate_id("report_"))
    type: str = "daily"  # daily, weekly, monthly, incident
    title: str
    date: str
    author: str
    status: str = "completed"
    participant: str
    client_id: Optional[str] = None
    ndis_number: Optional[str] = None
    hours: float = 0
    km: float = 0
    mood: Optional[str] = None
    shift_time: Optional[str] = None
    sections: List[ReportSection] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ReportCreate(BaseModel):
    type: str = "daily"
    title: str
    date: str
    participant: str
    client_id: Optional[str] = None
    hours: float = 0
    km: float = 0
    mood: Optional[str] = None
    sections: List[ReportSection] = []


# ==================== LEAD/CRM MODELS ====================
class LeadModel(BaseModel):
    lead_id: str = Field(default_factory=lambda: generate_id("lead_"))
    name: str
    organization: str
    role: str
    email: EmailStr
    phone: str
    service: Optional[str] = None
    status: str = "draft"  # draft, contacted, responded, converted, lost
    priority: str = "medium"  # low, medium, high
    notes: Optional[str] = None
    last_contacted: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class LeadCreate(BaseModel):
    name: str
    organization: str
    role: str
    email: EmailStr
    phone: str
    service: Optional[str] = None
    priority: str = "medium"


# ==================== COMPLIANCE MODELS ====================
class ComplianceModel(BaseModel):
    compliance_id: str = Field(default_factory=lambda: generate_id("comp_"))
    staff_id: str
    staff_name: str
    name: str
    number: Optional[str] = None
    expiry: str
    status: str = "valid"  # valid, expiring, expired, pending
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class ComplianceCreate(BaseModel):
    staff_id: str
    staff_name: str
    name: str
    number: Optional[str] = None
    expiry: str
