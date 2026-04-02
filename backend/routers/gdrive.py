# ATC Platform - Google Drive Router (Mock/Placeholder)
from fastapi import APIRouter
from datetime import datetime, timezone
from typing import List, Optional
from pydantic import BaseModel

router = APIRouter(prefix="/gdrive", tags=["Google Drive"])


class FolderInfo(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    files: int
    subfolders: List[str]


class FileInfo(BaseModel):
    name: str
    folder: str
    modified: str
    type: str


class DriveStatusResponse(BaseModel):
    connected: bool
    last_sync: Optional[str]
    folders: List[FolderInfo]
    recent_files: List[FileInfo]


class SyncResponse(BaseModel):
    success: bool
    message: str
    synced_at: str


# Mock data for demo
MOCK_FOLDERS = [
    FolderInfo(
        id="01",
        name="01 - Staff Records",
        icon="👤",
        color="blue",
        files=47,
        subfolders=["Compliance Docs", "Contracts", "Training Certs", "ID Copies"]
    ),
    FolderInfo(
        id="02",
        name="02 - Finance",
        icon="💰",
        color="emerald",
        files=156,
        subfolders=["Invoices 2026", "Payroll", "Tax Records", "Bank Statements"]
    ),
    FolderInfo(
        id="03",
        name="03 - Participants",
        icon="❤️",
        color="pink",
        files=89,
        subfolders=["Care Plans", "Incident Reports", "Progress Notes", "Agreements"]
    ),
    FolderInfo(
        id="04",
        name="04 - Operations",
        icon="⚙️",
        color="slate",
        files=23,
        subfolders=["Rosters", "Policies", "Templates", "Meeting Notes"]
    ),
    FolderInfo(
        id="05",
        name="05 - Marketing",
        icon="🚀",
        color="violet",
        files=34,
        subfolders=["Brochures", "Social Media", "Website Assets", "Outreach Logs"]
    ),
    FolderInfo(
        id="06",
        name="06 - Compliance",
        icon="🛡️",
        color="amber",
        files=18,
        subfolders=["NDIS Audits", "Certifications", "Insurance", "Risk Assessments"]
    )
]

MOCK_FILES = [
    FileInfo(name="INV-2026-0042_Shaun_Case.pdf", folder="02 - Finance", modified="2 hours ago", type="pdf"),
    FileInfo(name="Daniel_WWCC_2026.pdf", folder="01 - Staff Records", modified="1 day ago", type="pdf"),
    FileInfo(name="March_Roster_v3.xlsx", folder="04 - Operations", modified="2 days ago", type="xlsx"),
    FileInfo(name="Capability_Brochure_2026.pdf", folder="05 - Marketing", modified="3 days ago", type="pdf"),
    FileInfo(name="Risk_Assessment_Q1.docx", folder="06 - Compliance", modified="1 week ago", type="docx")
]


@router.get("/status", response_model=DriveStatusResponse)
async def get_drive_status():
    """
    Get Google Drive connection status and folder structure.
    NOTE: This is a mock endpoint. Real implementation requires Google OAuth credentials.
    """
    return DriveStatusResponse(
        connected=False,  # Would be True if OAuth is configured
        last_sync=None,
        folders=MOCK_FOLDERS,
        recent_files=MOCK_FILES
    )


@router.post("/sync", response_model=SyncResponse)
async def sync_drive():
    """
    Trigger a Google Drive sync.
    NOTE: This is a mock endpoint. Real implementation requires Google OAuth credentials.
    """
    # In a real implementation, this would:
    # 1. Connect to Google Drive API
    # 2. Sync files based on folder structure
    # 3. Update local database with file metadata
    # 4. Return sync status
    
    return SyncResponse(
        success=True,
        message="Sync completed (demo mode - no actual files synced)",
        synced_at=datetime.now(timezone.utc).isoformat()
    )


@router.post("/connect")
async def connect_drive():
    """
    Initiate Google OAuth flow.
    NOTE: This requires Google API credentials to be configured.
    """
    return {
        "message": "Google Drive OAuth requires API credentials",
        "setup_instructions": [
            "1. Go to Google Cloud Console",
            "2. Create a new project or select existing",
            "3. Enable Google Drive API",
            "4. Create OAuth 2.0 credentials",
            "5. Add authorized redirect URIs",
            "6. Download credentials and configure in .env"
        ]
    }
