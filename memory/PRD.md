# ATC Master Platform - Product Requirements Document

## Project Overview
**Product Name:** ATC Master OS v19.0 - Achieve Together Care Enterprise Platform  
**Domain:** achievetogethercare.com.au  
**Type:** Full-stack NDIS Care Management Platform  
**Tech Stack:** React + FastAPI + MongoDB

## Original Problem Statement
Build an enterprise-grade management platform for Achieve Together Care (NDIS provider) with the same structure as the reference design but better - featuring Business Command Center, Smart Outreach CRM, Clinical Management, and Data Synchronization modules.

## User Personas
1. **Business Owner (Daniel Hayward)** - Primary user managing operations, outreach, revenue, and compliance
2. **Support Coordinators** - Recipients of outreach emails
3. **Care Workers** - Future users for clinical incident logging

## Core Design Requirements (Updated April 2, 2026)
- **Brand Identity:**
  - Colors: Dark Navy (#0A1628), Teal (#14B8B6), Lavender (#B794F4)
  - Typography: Manrope (headings), IBM Plex Sans (body/tables)
  - Style: Swiss/High-Contrast Enterprise Healthcare

- **Design Patterns (NEW):**
  - Control Room Grid layout for dashboards
  - Max 8px border-radius (no bubble/ultra-rounded cards)
  - Dense but structured spacing (p-4 to p-6)
  - 1px solid borders with subtle #E2E8F0 color
  - Data tables with atc-table class for consistent styling
  - Badge system: atc-badge-success, atc-badge-warning, atc-badge-danger, atc-badge-info
  - Button system: atc-btn-primary, atc-btn-secondary, atc-btn-danger, atc-btn-accent

- **Layout:**
  - 256px dark navy sidebar
  - Dense 14px height header
  - Full-height layout with scrolling content area

## What's Been Implemented

### Phase 1-4: Full MVP Complete ✅
(Previous phases completed - see CHANGELOG.md)

### Phase 5: UI/UX Enterprise Redesign ✅
**Date:** April 2, 2026  
**Status:** COMPLETED

**Design System Updates:**
1. ✅ New CSS design system in `/app/frontend/src/index.css`
   - CSS variables for ATC brand colors
   - Manrope font for headings, IBM Plex Sans for body
   - Enterprise table styling (.atc-table)
   - Badge system (.atc-badge-*)
   - Button system (.atc-btn-*)
   - Input/Label styling (.atc-input, .atc-label)
   - Alert banners (.atc-alert-*)
   - Card styling (.atc-card)

2. ✅ Dashboard Redesign (`OwnerPortal.jsx`)
   - KPI cards with Control Room Grid layout
   - Quick Actions panel
   - Recent Reports table
   - Staff Overview section
   - Active Participants section
   - Compact header with search bar
   - Online status indicator

3. ✅ Staff Management Redesign (`StaffManagement.jsx`)
   - Stats row: Total Staff, Valid Docs, Expiring, Expired
   - Data table with compliance status badges
   - Search and filter functionality
   - Staff detail modal with compliance documents

4. ✅ Client Management Redesign (`ClientManagement.jsx`)
   - Stats row: Total Clients, Weekly Hours, Plan/Self Managed
   - Data table with NDIS info and funding badges
   - Search functionality
   - Client detail modal with goals, likes, triggers

5. ✅ Smart Outreach CRM Redesign (`SmartOutreach.jsx`)
   - Stats row: Total Leads, Ready to Send, Contacted, Converted
   - Bulk actions bar (Bulk SMS, Send Batch)
   - Leads table with role and status badges
   - AI email generation modal with dark header

## Test Results (April 2, 2026)

### Iteration 4 - UI/UX Enterprise Redesign
- Backend: 100% (34/34 tests passed)
- Frontend: 100% (25 UI flows verified)
- Design System: All CSS classes rendering correctly
- No issues found

## Prioritized Backlog

### P0 - COMPLETED ✅
- ✅ Full-stack MVP with all core features
- ✅ UI/UX Enterprise Redesign

### P1 - Email Sending Integration (BLOCKED)
- [ ] Resend API integration for actual email delivery
- **BLOCKED:** User doesn't have a RESEND_API_KEY

### P2 - WordPress & Drive Integration
- [ ] WordPress integration for achievetogethercare.com.au
- [ ] Google Drive sync backend connection

### P3 - Advanced Features
- [ ] PDF generation for invoices/brochures
- [ ] Incident logging and tracking
- [ ] Analytics dashboard with charts
- [ ] Multi-user support (team members)

## API Contracts
(See previous PRD for full API documentation)

## Notes
- All 4 testing iterations passed with 100% success rate
- New enterprise design follows Swiss/High-Contrast aesthetic
- Email sending requires user to provide Resend API key
