# ATC Master Platform - Product Requirements Document

## Project Overview
**Product Name:** ATC Master OS v18.0 - Achieve Together Care Enterprise Platform  
**Domain:** achievetogethercare.com.au  
**Type:** Full-stack NDIS Care Management Platform  
**Tech Stack:** React + FastAPI + MongoDB

## Original Problem Statement
Build an enterprise-grade management platform for Achieve Together Care (NDIS provider) with the same structure as the reference design but better - featuring Business Command Center, Smart Outreach CRM, Clinical Management, and Data Synchronization modules.

## User Personas
1. **Business Owner (Daniel Hayward)** - Primary user managing operations, outreach, revenue, and compliance
2. **Support Coordinators** - Recipients of outreach emails
3. **Care Workers** - Future users for clinical incident logging

## Core Design Requirements (Static)
- **Brand Identity:**
  - Colors: Dark Navy (#0A1628), Lavender (#B794F4), Teal (#14B8B6)
  - Typography: Inter (body), Outfit (headers)
  - Style: Enterprise, bold, italic uppercase headers
  
- **Design Patterns:**
  - Glass-morphism effects with backdrop blur
  - Extreme rounded corners (24px-80px)
  - Dark sidebar with gradient
  - Lavender accent for active states
  - Teal for CTAs and success states
  - Ultra-rounded stat cards (48px)
  - Pulse animations for live indicators

- **Layout:**
  - 288px fixed sidebar (72 in Tailwind units)
  - Full-height layout with no scroll on main container
  - Content scrolls within main area

## What's Been Implemented

### Phase 1: Frontend MVP with Mock Data ✅
**Date:** April 2, 2026  
**Status:** Completed

**Components Created:**
1. ✅ Layout System
   - `OwnerPortal.jsx` - Main dashboard with sidebar navigation
   - Dark gradient sidebar with navigation
   - Dynamic page header with action buttons

2. ✅ Dashboard Components
   - `StatCard` - Reusable metric cards with variants
   - Dashboard with stats + recent reports
   - Quick Actions (Create Invoice, Process Payroll, Quick Report)

3. ✅ CRM Components
   - `SmartOutreach.jsx` - CRM with leads table, email modal, batch send

4. ✅ Calendar & Automation
   - `ComprehensiveCalendar.jsx` - Full calendar with shift management
   - `QuickShiftReport.jsx` - AI-assisted shift reporting

### Phase 2: Backend API Development ✅
**Date:** April 2, 2026  
**Status:** Completed

**Backend Components:**
1. ✅ Authentication System
   - JWT email/password authentication with httpOnly cookies
   - Google OAuth integration (Emergent Auth)
   - Admin seeding on startup
   - Brute force protection
   - Password reset flow

2. ✅ MongoDB Models & Collections
   - users (with user_id, email, password_hash, role)
   - staff (with compliance documents)
   - clients (with NDIS info, goals, preferences)
   - shifts (with activities, engagement, support, goals)
   - invoices (with line items, NDIS codes)
   - reports (with sections)
   - leads (CRM contacts)

3. ✅ REST API Endpoints
   - `/api/auth/*` - Authentication (login, register, logout, me, refresh, forgot-password, reset-password, google/session)
   - `/api/dashboard/*` - Stats, KPIs, calendar data
   - `/api/staff/*` - Staff CRUD with compliance
   - `/api/clients/*` - Client CRUD
   - `/api/shifts/*` - Shift CRUD with completion
   - `/api/invoices/*` - Invoice CRUD with generation from shifts
   - `/api/reports/*` - Report CRUD
   - `/api/leads/*` - CRM lead CRUD with batch send

4. ✅ Seed Data
   - Admin user (Daniel Hayward)
   - 1 Staff member
   - 1 Client (Shaun Case)
   - 5 CRM Leads
   - 2 Shifts
   - 1 Invoice
   - 1 Report

### Phase 3: Frontend-Backend Integration ✅
**Date:** April 2, 2026  
**Status:** Completed

**Integration Work:**
1. ✅ API Service (`/app/frontend/src/services/api.js`)
   - Axios instance with credentials
   - All API methods for auth, dashboard, staff, clients, shifts, invoices, reports, leads

2. ✅ Auth Context (`/app/frontend/src/context/AuthContext.jsx`)
   - Login/Register/Logout methods
   - Google OAuth support
   - Protected routes

3. ✅ Login Page (`/app/frontend/src/pages/LoginPage.jsx`)
   - Email/password form
   - Google login button
   - Demo credentials display

4. ✅ Dashboard Updates
   - Real data from /api/dashboard/stats
   - User profile from auth context

5. ✅ CRM Updates
   - Real leads from /api/leads
   - Batch send functionality
   - Status updates

### Phase 4: Management Pages ✅
**Date:** April 2, 2026  
**Status:** Completed

**Pages Created:**
1. ✅ Staff Management (`/app/frontend/src/components/staff/StaffManagement.jsx`)
   - Staff grid with cards
   - Compliance status badges
   - Detail modal with all 7 compliance documents
   - Add/Edit staff form

2. ✅ Client Management (`/app/frontend/src/components/clients/ClientManagement.jsx`)
   - Client grid with NDIS info
   - Detail modal with goals, likes, triggers
   - Add/Edit client form with goal management

3. ✅ Invoice Management (`/app/frontend/src/components/invoices/InvoiceManagement.jsx`)
   - Invoice table with status badges
   - Stats row (total, draft, sent, paid)
   - Detail modal with NDIS line items
   - Send/Mark Paid actions
   - Generate Invoice from shifts

4. ✅ Report Management (`/app/frontend/src/components/reports/ReportManagement.jsx`)
   - Report grid with type filters
   - Detail modal with mood, summary, activities
   - Author and participant info

### Phase 5: AI & Advanced Features ✅
**Date:** April 2, 2026  
**Status:** Completed

**Features Implemented:**
1. ✅ AI Email Generation (`/app/backend/routers/ai.py`)
   - Integration: Emergent LLM Key with GPT-4o
   - Generates personalized outreach emails
   - Role-aware content (Support Coordinator, Plan Manager, Recovery Coach)
   - ATC branding and signature included

2. ✅ SCHADS Payroll Management (`/app/backend/routers/payroll.py` + `/app/frontend/src/components/payroll/PayrollManagement.jsx`)
   - SCHADS Award rates (Level 2, 3, 4)
   - Weekday/Saturday/Sunday/Public Holiday rates
   - Payroll calculation for pay periods
   - Superannuation (11.5%) calculation
   - Process payroll with history tracking

3. ✅ Compliance Tracking (`/app/backend/routers/compliance.py` + `/app/frontend/src/components/compliance/ComplianceManagement.jsx`)
   - Compliance dashboard with score
   - 12 required documents (6 critical for NDIS)
   - Expired/Expiring/Missing document alerts
   - Staff-level compliance detail
   - Add/update/delete compliance documents

4. ✅ Smart Outreach CRM Updates
   - AI-powered email generation modal
   - Regenerate email button
   - Personalized subject lines
   - Professional NDIS industry tone

### Issues Fixed ✅
1. ✅ Smart Outreach CRM sidebar navigation - Added 'crm' to navItems array

## Prioritized Backlog

### P0 - Completed ✅
- ✅ Staff Management page (list, create, edit, delete)
- ✅ Client Management page (list, create, edit, delete)
- ✅ Invoices page with NDIS invoice generation
- ✅ Reports page with shift report viewing

### P1 - AI Integration ✅
- ✅ AI-powered email generation for CRM outreach (GPT-4o via Emergent LLM)
- ✅ Payroll page - SCHADS award compliant
- ✅ Compliance page - Document tracking and alerts

### P2 - Advanced Features
- [ ] PDF generation for invoices/brochures
- [ ] G-Drive sync functionality  
- [ ] Email scheduling and batch sending with actual email delivery
- [ ] Analytics dashboard with charts

### P2 - Advanced Features
- [ ] PDF generation for capability brochures and invoices
- [ ] G-Drive sync functionality
- [ ] Incident logging and tracking
- [ ] Email scheduling and batch sending
- [ ] Analytics dashboard

### P3 - WordPress & Enhancements
- [ ] WordPress integration for achievetogethercare.com.au (separate site with links)
- [ ] Email tracking (opens, responses)
- [ ] Calendar event management
- [ ] Multi-user support (team members)
- [ ] Mobile responsive optimization

## API Contracts (Implemented)

### Dashboard Stats
```
GET /api/dashboard/stats
Response: {
  revenue: { amount, change, period },
  clients: { total, active },
  staff: { total },
  compliance: { score, expired, expiring },
  invoices: { pending, total }
}
```

### Authentication
```
POST /api/auth/login
Body: { email, password }
Response: { user: { user_id, email, name, role }, message }

POST /api/auth/register
Body: { email, password, name, role }
Response: { user: {...}, message }

GET /api/auth/me
Response: { user_id, email, name, role, picture }
```

### Leads Management
```
GET /api/leads
Response: [{ lead_id, name, organization, role, email, phone, status, priority }]

POST /api/leads
Body: { name, organization, role, email, phone }
Response: { lead_id, ... }

POST /api/leads/{lead_id}/contact
Response: { lead_id, status: "contacted", last_contacted }

POST /api/leads/batch-send
Response: { message, leads_contacted: [] }
```

## Test Results (April 2, 2026)

### Iteration 1 - Auth, Dashboard, CRM
- Backend: 100% (18/18 tests passed)
- Frontend: 100% (all UI flows working)
- See `/app/test_reports/iteration_1.json` for details

### Iteration 2 - Management Pages
- Backend: 100% (18/18 tests passed)
- Frontend: 100% (all UI flows working)
- Staff Management: Working with compliance docs display
- Client Management: Working with goals, likes, triggers
- Invoices: Working with NDIS line items and totals
- Reports: Working with mood and filter tabs
- See `/app/test_reports/iteration_2.json` for details

### Iteration 3 - AI & Advanced Features
- Backend: 100% (34/34 tests passed - 18 existing + 16 new)
- Frontend: 100% (all UI flows working)
- AI Email Generation: Working with GPT-4o personalization
- Payroll: SCHADS rates, calculation, processing
- Compliance: Dashboard, alerts, staff-level tracking
- See `/app/test_reports/iteration_3.json` for details

## Notes
- Frontend built with Shadcn UI components
- All mock data moved to API - no frontend mocking
- Design matches $20k+ agency quality with micro-interactions
- Calendar shows dynamic data from API
