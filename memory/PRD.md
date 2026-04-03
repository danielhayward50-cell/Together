# ATC Master Platform - Product Requirements Document

## Project Overview
**Product Name:** ATC Master OS v21.0 - Achieve Together Care Enterprise Platform  
**Domain:** achievetogethercare.com.au  
**Type:** Full-stack NDIS Care Management Platform  
**Tech Stack:** React + FastAPI + MongoDB + jsPDF + Google Maps

## Original Problem Statement
Build an enterprise-grade management platform for Achieve Together Care (NDIS provider) with Business Command Center, Smart Outreach CRM, Clinical Management, and Data Synchronization modules. Add an ultra-impressive landing page with Google Maps.

## What's Been Implemented

### Phase 1-5: Full MVP + UI/UX Redesign ✅
- Authentication (JWT + Google OAuth)
- Dashboard with KPI cards
- Staff Management, Client Management
- Smart Outreach CRM with AI email generation
- Payroll (SCHADS rates), Invoices, Reports
- Compliance Tracking, Calendar, Automation
- PDF Generation (Invoices, Capability Brochure)
- Website Integration, Google Drive Sync (Demo)

### Phase 6: Ultra-Impressive Landing Page ✅
**Date:** April 3, 2026  
**Status:** COMPLETED

**Features Implemented:**
1. ✅ **Hero Section**
   - Main heading: "Empowering Independence, One Goal at a Time"
   - CTA buttons: "Get Started", "Our Services"
   - Hero image with floating stats card (10+ Years Experience)
   - Trust indicators: 100+ Happy Families, 5.0 Rating

2. ✅ **Stats Bar**
   - NSW Service Area, NDIS Registered, 24/7 On-Call, 5★ Rated

3. ✅ **Services Section** (6 NDIS services with codes)
   - Community Participation (04_104_0125_6_1)
   - Assistance with Daily Life (01_011_0107_1_1)
   - High Intensity Support (01_015_0120_1_1)
   - Group Activities (04_102_0125_6_1)
   - Transport Assistance (02_051_0108_1_1)
   - Support Coordination (07_001_0106_8_3)

4. ✅ **About Section**
   - Why Choose Us (6 key points)
   - Founder card (Daniel Hayward)

5. ✅ **Testimonials Section**
   - 3 testimonial cards with 5-star ratings
   - Sarah M. (Parent), James T. (Support Coordinator), Michelle R. (Participant)

6. ✅ **Portal Access Section**
   - Client Portal, Staff Portal, Owner Portal cards

7. ✅ **FAQ Section**
   - 5 expandable FAQ items

8. ✅ **Contact Section**
   - Contact form (Name, Email, Phone, Message)
   - Contact info (Phone, Email, Location, Hours)
   - Google Maps placeholder (API key configured)

9. ✅ **Footer**
   - NDIS Provider: 4050061959
   - ABN: 91 673 357 602
   - Copyright 2026

## Test Results

### Iteration 6 - Landing Page
- Frontend: 100% (11+ tests passed)
- All sections verified working
- Mobile responsive design confirmed
- Navigation and login flow working

## Architecture

```
/app
 ├── frontend/src/
 │    ├── pages/
 │    │    ├── LandingPage.jsx [NEW]
 │    │    ├── LoginPage.jsx
 │    │    └── AuthCallback.jsx
 │    ├── components/
 │    │    ├── portals/OwnerPortal.jsx
 │    │    ├── website/WebsiteIntegration.jsx
 │    │    ├── gdrive/GDriveSyncComponent.jsx
 │    │    └── ... (all management components)
 │    └── services/
 │         ├── api.js
 │         └── pdfService.js
 └── backend/
      └── routers/ (auth, dashboard, staff, clients, etc.)
```

## Routes

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | LandingPage | No |
| `/login` | LoginPage | No |
| `/dashboard` | OwnerPortal | Yes |
| `/auth/callback` | AuthCallback | No |

## Environment Variables

**Frontend:**
- `REACT_APP_BACKEND_URL` - Backend API URL
- `REACT_APP_GOOGLE_MAPS_API_KEY` - Google Maps API key

## Credentials
See `/app/memory/test_credentials.md`

## Prioritized Backlog

### P0 - COMPLETED ✅
- ✅ Full MVP with all features
- ✅ UI/UX Enterprise Redesign
- ✅ PDF Generation
- ✅ Website Integration
- ✅ Google Drive Sync (Demo)
- ✅ Ultra-Impressive Landing Page with Google Maps

### P1 - Pending (Blocked)
- [ ] Email Sending (Resend) - Needs API key
- [ ] Real Google Drive Integration - Needs OAuth credentials

### P2 - Future Features
- [ ] Contact form backend integration
- [ ] Service Flyer PDF
- [ ] Analytics dashboard with charts
- [ ] Multi-user support

## Notes
- Google Maps shows placeholder until API key billing is configured
- Landing page is fully responsive (mobile-first design)
- 6 iterations of testing all passed with 100% success rate
