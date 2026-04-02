# ATC Master Platform - Product Requirements Document

## Project Overview
**Product Name:** ATC Master OS v20.0 - Achieve Together Care Enterprise Platform  
**Domain:** achievetogethercare.com.au  
**Type:** Full-stack NDIS Care Management Platform  
**Tech Stack:** React + FastAPI + MongoDB + jsPDF + Google Maps API

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

### Phase 7: Public Landing Page with Google Maps ✅
**Date:** April 2, 2026  
**Status:** COMPLETED

**1. Public Landing Page (`/app/frontend/src/pages/HomePage.jsx`)**
- ✅ Hero Section: "More Than Just Care" headline with gradient text
- ✅ NDIS Registered Provider badge
- ✅ Trust indicators (NDIS Registered, Fully Insured, Experienced Team, 24/7 Support)
- ✅ Two CTAs: "Book Free Consultation" modal and "Explore Services"
- ✅ Smooth scroll navigation

**2. Services Section**
- ✅ 4 service cards with gradient icons
- ✅ Capacity Building, Daily Living Support, Community Access, Plan Management
- ✅ Hover animations and Learn More links

**3. How It Works Section**
- ✅ 4-step process with numbered cards
- ✅ Get in Touch → Initial Consultation → Personalized Plan → Begin Your Journey

**4. Testimonials Section**
- ✅ 3 testimonial cards with gradient backgrounds
- ✅ 5-star ratings with user names and roles

**5. Contact Section with Google Maps**
- ✅ Contact form with backend storage (MongoDB)
- ✅ Form submission with success message
- ✅ Google Maps embed with dark theme styling
- ✅ Sydney location with custom marker
- ✅ Contact info cards (Phone, Email, Address)

**6. Booking System**
- ✅ "Book Free Consultation" modal with full form
- ✅ Service type selection, date/time picker
- ✅ Backend API for storing bookings (`/api/contact/booking`)
- ✅ Booking stats endpoint (`/api/contact/stats`)

**7. Backend Contact/Booking APIs (`/app/backend/routers/contact.py`)**
- ✅ POST `/api/contact/inquiry` - Store contact inquiries
- ✅ GET `/api/contact/inquiries` - List all inquiries
- ✅ PATCH `/api/contact/inquiry/{id}/status` - Update inquiry status
- ✅ POST `/api/contact/booking` - Store consultation bookings
- ✅ GET `/api/contact/bookings` - List all bookings
- ✅ PATCH `/api/contact/booking/{id}/status` - Update booking status
- ✅ GET `/api/contact/stats` - Get inquiry/booking statistics

**8. Routing Refactor**
- ✅ `/` → Public landing page (no auth required)
- ✅ `/login` → Login page
- ✅ `/dashboard` → Protected Owner Portal

## Test Results (April 2, 2026)

### Iteration 6 - Public Landing Page with Google Maps
- Frontend: 100% (40+ UI flows verified)
- All landing page sections working correctly
- Google Maps API integrated with dark theme
- Login flow redirects to dashboard successfully

## Architecture

```
/app
 ├── frontend/src/
 │    ├── pages/
 │    │    ├── HomePage.jsx [NEW - Public Landing Page]
 │    │    ├── LoginPage.jsx
 │    │    └── AuthCallback.jsx
 │    ├── components/
 │    │    ├── portals/ (OwnerPortal.jsx - 13 nav items)
 │    │    ├── website/ (WebsiteIntegration.jsx)
 │    │    ├── gdrive/ (GDriveSyncComponent.jsx)
 │    │    ├── crm/ (SmartOutreach.jsx)
 │    │    ├── staff/ (StaffManagement.jsx)
 │    │    ├── clients/ (ClientManagement.jsx)
 │    │    ├── invoices/ (InvoiceManagement.jsx + PDF)
 │    │    ├── payroll/ (PayrollManagement.jsx)
 │    │    └── compliance/ (ComplianceManagement.jsx)
 │    ├── services/
 │    │    ├── api.js
 │    │    └── pdfService.js
 │    └── App.js (Updated routing)
 └── backend/
      ├── routers/
      │    ├── auth.py, dashboard.py, staff.py, clients.py
      │    ├── ai.py, payroll.py, compliance.py
      │    └── gdrive.py [MOCKED]
      └── server.py
```

## Prioritized Backlog

### P0 - COMPLETED ✅
- ✅ Full-stack MVP with all core features
- ✅ UI/UX Enterprise Redesign
- ✅ PDF Generation
- ✅ Website Integration
- ✅ Google Drive Sync (Demo Mode)
- ✅ Public Landing Page with Google Maps

### P1 - Email Sending Integration (BLOCKED)
- [ ] Resend API integration for actual email delivery
- **BLOCKED:** User doesn't have a RESEND_API_KEY

### P1 - Real Google Drive Integration
- [ ] Google OAuth configuration
- [ ] Real file sync with Drive API
- **REQUIRES:** Google Cloud Console project + OAuth credentials

### P2 - Future Features
- [ ] Service Flyer PDF
- [ ] Digital Business Card vCard
- [ ] Analytics dashboard with charts
- [ ] Multi-user support (team members)
- [ ] Incident logging and tracking
- [ ] Clinical OS enhancements
- [ ] Quick Shift Reporting AI workflows

## API Endpoints

### Contact & Booking Endpoints (Phase 7) - NEW
- `POST /api/contact/inquiry` - Submit contact inquiry (stored in MongoDB)
- `GET /api/contact/inquiries` - List all inquiries (admin)
- `PATCH /api/contact/inquiry/{id}/status` - Update inquiry status
- `POST /api/contact/booking` - Submit consultation booking
- `GET /api/contact/bookings` - List all bookings (admin)
- `PATCH /api/contact/booking/{id}/status` - Update booking status
- `GET /api/contact/stats` - Get inquiry/booking statistics

### Google Drive Endpoints (Phase 6)
- `GET /api/gdrive/status` - Get Drive status and folders (MOCKED)
- `POST /api/gdrive/sync` - Trigger sync (MOCKED)
- `POST /api/gdrive/connect` - Initiate OAuth (returns setup instructions)

## Credentials
See `/app/memory/test_credentials.md`

## Notes
- All 6 testing iterations passed with 100% success rate
- PDF generation is client-side (no server dependency)
- Google Drive is in demo mode until OAuth credentials are provided
- Email sending requires Resend API key from user
- Google Maps API Key configured in frontend/.env
- Contact form and booking system now fully functional with MongoDB storage
- New MongoDB collections: `contact_inquiries`, `consultation_bookings`
