# ATC Master Platform - Product Requirements Document

## Original Problem Statement
Build the "ATC Master Platform" (Achieve Together Care), an ultra-impressive, enterprise-grade NDIS management console for managing Owner, Staff, and Client portals.

### User's Explicit Requirements:
- "Make it look absolutely stunning like a brochure"
- "Better ATC branding"
- "Files organized by days/weeks/months, appointments, invoices, shift reports, contacts, BSB reports, NDIS forms"
- "Better PDF viewer"
- "Better uploads/downloads"
- "AI built-in"
- "Better layout everything"

---

## Core Modules

### 1. Authentication & Authorization
- JWT-based authentication with role-based access (Owner, Staff, Client)
- Google OAuth integration via Emergent
- Demo credentials for testing

### 2. Owner Portal Dashboard
- Premium KPI cards (Revenue, Active Clients, Compliance, Pending Invoices)
- Quick action buttons
- Recent reports table
- Staff overview
- Active participants

### 3. Document Hub (NEW - April 2026)
- **8 Organized Folders**:
  - Appointments (scheduled sessions & meetings)
  - Invoices & Remittances (financial documents)
  - Shift Reports (daily support documentation)
  - Contacts & BSB (contact info & banking details)
  - NDIS Forms (service agreements & plans)
  - Compliance Docs (certifications & audits)
  - Recent Files (recently accessed)
  - Bin (deleted files)
- Grid/List view toggle
- File preview modal
- Upload functionality
- Search & filter
- Sync status indicator
- Storage stats bar

### 4. NDIS Form Filler
- **6 Form Templates**:
  - Service Agreement
  - Progress Notes
  - Incident Report
  - Support Plan
  - Risk Assessment
  - Shift Report
- Quick auto-fill from client/worker selection
- PDF generation with brochure-quality styling
- Form preview panel

### 5. Smart Outreach (CRM)
- Lead management
- Pipeline stages
- AI-powered email composer
- Contact history

### 6. Staff Management
- Staff profiles
- Compliance tracking
- Scheduling

### 7. Client Management
- Client profiles with full details
- NDIS numbers
- Service history
- Emergency contacts

### 8. Payroll & Invoicing
- SCHADS rates integration
- Invoice generation with premium PDF styling
- Payment tracking

### 9. Calendar & Scheduling
- Full calendar view
- Shift management
- Appointment booking

### 10. Public Landing Page
- Hero section with booking CTA
- Services showcase
- Testimonials
- Contact form
- Google Maps integration (generic Sydney location)

---

## What's Been Implemented (April 2026)

### Completed Features:
1. ✅ Authentication system with JWT + Google OAuth
2. ✅ Owner Portal with full navigation
3. ✅ Dashboard with premium KPI cards
4. ✅ Document Hub with 8 organized folders
5. ✅ NDIS Form Filler with 6 templates + PDF generation
6. ✅ Smart Outreach CRM
7. ✅ Staff & Client Management
8. ✅ Invoice Management with brochure-quality PDFs
9. ✅ Calendar & Scheduling
10. ✅ Public Landing Page with contact/booking forms
11. ✅ Inquiries & Bookings Management
12. ✅ WordPress "Owner Login" redirect integration
13. ✅ **Premium UI/UX Overhaul** (April 3, 2026):
    - Deep forest green sidebar (#1B3B36)
    - Terracotta (#C16E5A) and teal (#14B8B6) accents
    - Rounded 2xl cards (16px radius)
    - Gradient icons on folders and form types
    - Outfit + Manrope typography
    - Glass-morphism header
    - Premium animations
    - Brochure-quality PDF styling

### Testing Status:
- **Iteration 7**: 100% frontend tests passing
- All navigation flows verified
- PDF generation confirmed working
- Document Hub folder navigation tested

---

## Pending/Backlog

### P0 (Critical):
- None currently

### P1 (High Priority):
- Real Google Drive OAuth integration (currently demo mode)
- WordPress homepage professional images update (Elementor automation blocked)
- Resend email integration for CRM (needs API key)

### P2 (Medium Priority):
- Clinical OS polish
- Quick Shift Reporting AI enhancements
- Multi-turn conversation sessions with DB storage

### P3 (Low Priority):
- Advanced analytics dashboard
- Mobile app considerations
- Export/import functionality

---

## Technical Architecture

### Frontend (React + Tailwind)
- `/app/frontend/src/components/portals/OwnerPortal.jsx` - Main dashboard
- `/app/frontend/src/components/documents/DocumentHub.jsx` - File management
- `/app/frontend/src/components/forms/NDISFormFiller.jsx` - Form generator
- `/app/frontend/src/pages/HomePage.jsx` - Public landing page
- `/app/frontend/src/services/pdfService.js` - PDF generation

### Backend (FastAPI + MongoDB)
- `/app/backend/server.py` - Main server
- `/app/backend/routers/` - API routes
- `/app/backend/models/` - Data models

### Database Schema (MongoDB):
- Users, Staff, Clients, Leads, Shifts, Invoices, Reports, ContactInquiries, Bookings

---

## Design System

### Colors:
- Primary: #1B3B36 (Deep Forest Green)
- Primary Light: #2A5A53
- Accent: #C16E5A (Terracotta)
- Teal: #14B8B6
- Background: #FDFCFB (Warm White)
- Surface: #FFFFFF
- Secondary: #F4F5F4 (Sand)
- Text: #1B3B36
- Muted: #6B7270
- Border: #E8EAE9

### Typography:
- Headings: Outfit (font-heading)
- Body: Manrope

### Components:
- Cards: rounded-2xl (16px radius)
- Buttons: rounded-full (pill-shaped)
- Inputs: rounded-xl (12px radius)

---

## Third-Party Integrations

| Service | Status | Notes |
|---------|--------|-------|
| Emergent LLM (GPT-4o) | ✅ Active | Using Emergent Universal Key |
| Google OAuth | ✅ Active | Emergent-managed |
| Google Maps | ✅ Active | User API key provided |
| G-Drive Sync | ⚠️ Demo Mode | Needs OAuth credentials |
| Resend Email | ❌ Blocked | Needs API key |
| WordPress | ✅ Integrated | Owner login redirect working |

---

## Credentials

See `/app/memory/test_credentials.md` for test accounts.
