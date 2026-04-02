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
   - `MainLayout.jsx` - Master layout wrapper
   - `Sidebar.jsx` - Dark gradient sidebar with navigation
   - `Header.jsx` - Dynamic page header with action buttons

2. ✅ Dashboard Components
   - `StatCard.jsx` - Reusable metric cards with variants
   - `CommandCenter.jsx` - Business dashboard with stats + calendar (with day headers)
   - `ClinicalHub.jsx` - Incident management with active monitoring
   - `Finance.jsx` - SCHADS rates, payroll, and net disbursement
   - `GDriveSync.jsx` - G-Drive folder structure visualization

3. ✅ Modals
   - `EmailPreviewModal.jsx` - Professional email preview (deprecated in v17.2)
   - `ClinicalReportModal.jsx` - Clinical data entry with AI generation

4. ✅ Mock Data
   - Dashboard stats (revenue, roster success 100%, burn rate, alerts)
   - Finance data (SCHADS $38.08/hr, Core Support $70.23/hr, Net: $1,934.46)
   - G-Drive folder structure (Participants, Finance)
   - Incident tracking (Shaun Case: Behavior of Concern)

**Features Working:**
- ✅ Navigation between 4 modules (Command, Clinical, Finance, Sync)
- ✅ Command Center dashboard with 4 stat cards + calendar with day headers
- ✅ Clinical Hub with incident management and sync status
- ✅ Finance/Payroll module with SCHADS rates and tax calculations
- ✅ G-Drive Sync with folder visualization and force sweep
- ✅ Clinical report modal with date, KM, billing window, narrative
- ✅ Responsive hover states and animations
- ✅ Glass-morphism effects throughout
- ✅ Professional typography (Inter + Outfit)

### Phase 2: Enhanced Features ✅
**Date:** April 2, 2026  
**Status:** Completed

**New Modules:**
- ✅ Finance/Payroll with SCHADS rates, tax deductions, net disbursement
- ✅ Clinical Hub with incident management
- ✅ G-Drive Sync with folder structure
- ✅ Clinical Report Modal with AI generation placeholder

**Removed:**
- Smart Outreach CRM (replaced with Clinical Hub focus)

## Prioritized Backlog

### P0 - Backend Foundation (Next Phase)
- [ ] Authentication system for business owner login
- [ ] MongoDB models for:
  - Leads/Contacts
  - Clinical activities
  - Dashboard metrics
  - Incidents
- [ ] REST API endpoints:
  - GET/POST /api/leads
  - GET/POST /api/activities
  - GET /api/dashboard/stats
  - POST /api/emails/send

### P1 - AI Integration
- [ ] AI-powered email generation for CRM outreach
  - Integration: Use Emergent LLM key
  - Personalize emails based on lead role/organization
- [ ] Clinical report generation

### P2 - Advanced Features
- [ ] PDF generation for capability brochures
- [ ] G-Drive sync functionality
- [ ] Incident logging and tracking
- [ ] Email scheduling and batch sending
- [ ] Analytics dashboard

### P3 - Enhancements
- [ ] Email tracking (opens, responses)
- [ ] Calendar event management
- [ ] Multi-user support (team members)
- [ ] Mobile responsive optimization

## Next Tasks
1. **Backend Development** - Build FastAPI endpoints for leads, activities, and dashboard stats
2. **Database Setup** - Create MongoDB collections and seed initial data
3. **Frontend-Backend Integration** - Replace mock data with real API calls
4. **Authentication** - Implement login system for Daniel Hayward
5. **Testing** - End-to-end testing with testing agent

## API Contracts (To Be Implemented)

### Dashboard Stats
```
GET /api/dashboard/stats
Response: {
  revenue: { amount, change, period },
  outreachROI: { percentage, newIntakes },
  ndisBurnRate: { dailyRate, percentage },
  complianceAlert: { count, message }
}
```

### Leads Management
```
GET /api/leads
Response: [{ id, name, organization, role, service, email, phone, status, priority }]

POST /api/leads
Body: { name, organization, role, service, email, phone }
```

### Email Sending
```
POST /api/emails/send
Body: { leadId, subject, body, attachments }
```

## Notes
- Frontend built with Shadcn UI components (not used yet, but available)
- All mock data centralized in `/app/frontend/src/mock/mockData.js`
- Design matches $20k+ agency quality with attention to micro-interactions
- Calendar currently shows static March 2026 grid
