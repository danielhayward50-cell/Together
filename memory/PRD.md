# ATC Master Platform - Product Requirements Document

## Project Overview
**Product Name:** ATC Master OS v20.0 - Achieve Together Care Enterprise Platform  
**Domain:** achievetogethercare.com.au  
**Type:** Full-stack NDIS Care Management Platform  
**Tech Stack:** React + FastAPI + MongoDB + jsPDF

## Original Problem Statement
Build an enterprise-grade management platform for Achieve Together Care (NDIS provider) with the same structure as the reference design but better - featuring Business Command Center, Smart Outreach CRM, Clinical Management, and Data Synchronization modules.

## User Personas
1. **Business Owner (Daniel Hayward)** - Primary user managing operations, outreach, revenue, and compliance
2. **Support Coordinators** - Recipients of outreach emails
3. **Care Workers** - Future users for clinical incident logging

## What's Been Implemented

### Phase 1-4: Full MVP Complete ✅
- Authentication (JWT + Google OAuth)
- Dashboard with KPI cards
- Staff Management with compliance tracking
- Client Management with goals
- Smart Outreach CRM with AI email generation
- Payroll (SCHADS rates)
- Invoice Management
- Report Management
- Compliance Tracking
- Calendar scheduling
- Automation tools

### Phase 5: UI/UX Enterprise Redesign ✅
**Date:** April 2, 2026
- Swiss/High-Contrast enterprise aesthetic
- New design system with CSS classes
- Control Room Grid layout

### Phase 6: PDF, Website & G-Drive Integration ✅
**Date:** April 2, 2026  
**Status:** COMPLETED

**1. PDF Generation (jsPDF + jspdf-autotable)**
- ✅ Invoice PDF download (`/app/frontend/src/services/pdfService.js`)
- ✅ Capability Brochure generation (3-page professional PDF)
- ✅ Download and Preview functionality

**2. Website Integration**
- ✅ Website Integration page (`/app/frontend/src/components/website/WebsiteIntegration.jsx`)
- ✅ Stats display (Pages Live, Draft, Visitors, Referrals)
- ✅ Website preview with link to achievetogethercare.com.au
- ✅ Marketing Materials section (Brochure download)
- ✅ WordPress admin link

**3. Google Drive Sync (DEMO MODE)**
- ✅ G-Drive Sync page (`/app/frontend/src/components/gdrive/GDriveSyncComponent.jsx`)
- ✅ 6 folder structure display
- ✅ Recent files list
- ✅ Force Sync button
- ✅ Wednesday Master Sync schedule
- ⚠️ **MOCKED API** - Requires Google OAuth credentials for real sync

## Test Results (April 2, 2026)

### Iteration 5 - PDF, Website & G-Drive
- Backend: 100% (39/39 tests passed)
- Frontend: 100% (22 UI flows verified)
- Bugs Fixed: 2 (G-Drive prefix, jspdf-autotable import)
- All new features working correctly

## Architecture

```
/app
 ├── frontend/src/
 │    ├── components/
 │    │    ├── portals/ (OwnerPortal.jsx - 13 nav items)
 │    │    ├── website/ (WebsiteIntegration.jsx) [NEW]
 │    │    ├── gdrive/ (GDriveSyncComponent.jsx) [NEW]
 │    │    ├── crm/ (SmartOutreach.jsx)
 │    │    ├── staff/ (StaffManagement.jsx)
 │    │    ├── clients/ (ClientManagement.jsx)
 │    │    ├── invoices/ (InvoiceManagement.jsx + PDF)
 │    │    ├── payroll/ (PayrollManagement.jsx)
 │    │    └── compliance/ (ComplianceManagement.jsx)
 │    ├── services/
 │    │    ├── api.js
 │    │    └── pdfService.js [NEW]
 │    └── App.js
 └── backend/
      ├── routers/
      │    ├── auth.py, dashboard.py, staff.py, clients.py
      │    ├── ai.py, payroll.py, compliance.py
      │    └── gdrive.py [NEW - MOCKED]
      └── server.py
```

## Prioritized Backlog

### P0 - COMPLETED ✅
- ✅ Full-stack MVP with all core features
- ✅ UI/UX Enterprise Redesign
- ✅ PDF Generation
- ✅ Website Integration
- ✅ Google Drive Sync (Demo Mode)

### P1 - Email Sending Integration (BLOCKED)
- [ ] Resend API integration for actual email delivery
- **BLOCKED:** User doesn't have a RESEND_API_KEY

### P1 - Real Google Drive Integration
- [ ] Google OAuth configuration
- [ ] Real file sync with Drive API
- **REQUIRES:** Google Cloud Console project + OAuth credentials

### P3 - Future Features
- [ ] Service Flyer PDF
- [ ] Digital Business Card vCard
- [ ] Analytics dashboard with charts
- [ ] Multi-user support (team members)
- [ ] Incident logging and tracking

## API Endpoints

### New Endpoints (Phase 6)
- `GET /api/gdrive/status` - Get Drive status and folders (MOCKED)
- `POST /api/gdrive/sync` - Trigger sync (MOCKED)
- `POST /api/gdrive/connect` - Initiate OAuth (returns setup instructions)

## Credentials
See `/app/memory/test_credentials.md`

## Notes
- All 5 testing iterations passed with 100% success rate
- PDF generation is client-side (no server dependency)
- Google Drive is in demo mode until OAuth credentials are provided
- Email sending requires Resend API key from user
