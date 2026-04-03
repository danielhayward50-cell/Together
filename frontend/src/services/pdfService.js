// ATC Platform - Premium PDF Generation Service
// Brochure-Quality Professional Documents
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

// ATC Premium Brand Colors
const COLORS = {
  primary: [27, 59, 54],       // #1B3B36 - Deep Forest Green
  primaryLight: [42, 90, 83],  // #2A5A53 - Lighter Green
  accent: [193, 110, 90],      // #C16E5A - Terracotta
  teal: [20, 184, 182],        // #14B8B6 - Teal
  text: [27, 59, 54],          // #1B3B36 - Primary text
  muted: [107, 114, 112],      // #6B7270 - Muted text
  light: [253, 252, 251],      // #FDFCFB - Warm white
  sand: [244, 245, 244],       // #F4F5F4 - Sand background
  border: [232, 234, 233],     // #E8EAE9 - Border
  white: [255, 255, 255],
};

/**
 * Generate a professional brochure-quality PDF invoice
 * @param {Object} invoice - Invoice data object
 * @returns {jsPDF} - PDF document
 */
export function generateInvoicePDF(invoice) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Premium Header with gradient effect (simulated with rectangles)
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 55, 'F');
  
  // Accent line
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 55, pageWidth, 4, 'F');
  
  // ATC Logo Circle
  doc.setFillColor(...COLORS.teal);
  doc.circle(25, 27, 12, 'F');
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('ATC', 25, 30, { align: 'center' });
  
  // Company Name & Details
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Achieve Together Care', 45, 25);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('NDIS Registered Provider', 45, 33);
  doc.setFontSize(8);
  doc.text('ABN: XX XXX XXX XXX', 45, 40);
  
  // Invoice Label - Right Side
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', pageWidth - 20, 20, { align: 'right' });
  
  // Invoice Number Badge
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(pageWidth - 55, 25, 35, 14, 2, 2, 'F');
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(9);
  doc.text(invoice.invoice_no || 'INV-0000', pageWidth - 37.5, 34, { align: 'center' });
  
  // Date below badge
  doc.setTextColor(...COLORS.light);
  doc.setFontSize(8);
  doc.text(invoice.date || new Date().toLocaleDateString(), pageWidth - 20, 48, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(...COLORS.text);
  
  // Content starts after header
  let yPos = 75;
  
  // Bill To Section - Left
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(15, yPos - 5, 85, 50, 3, 3, 'F');
  
  // Accent bar on left
  doc.setFillColor(...COLORS.teal);
  doc.rect(15, yPos - 5, 3, 50, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL TO', 25, yPos + 3);
  
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.text);
  doc.text(invoice.client || 'Client Name', 25, yPos + 14);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text(`NDIS: ${invoice.ndis_number || 'N/A'}`, 25, yPos + 23);
  doc.text(`Plan Manager: ${invoice.funding_manager || 'N/A'}`, 25, yPos + 31);
  
  // Service Period Section - Right
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(110, yPos - 5, 85, 50, 3, 3, 'F');
  
  doc.setFillColor(...COLORS.accent);
  doc.rect(110, yPos - 5, 3, 50, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE DETAILS', 120, yPos + 3);
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.text(`Period: ${invoice.period || 'N/A'}`, 120, yPos + 14);
  doc.text(`Worker: ${invoice.worker || 'N/A'}`, 120, yPos + 23);
  doc.text(`Invoice Date: ${invoice.date || 'N/A'}`, 120, yPos + 31);
  
  // Line Items Table
  yPos = 140;
  
  const tableData = (invoice.lines || []).map(line => [
    line.date || '',
    line.description || '',
    line.ndis_code || '',
    `${line.qty} ${line.unit || 'hrs'}`,
    `$${(line.rate || 0).toFixed(2)}`,
    `$${(line.total || 0).toFixed(2)}`
  ]);
  
  autoTable(doc, {
    startY: yPos,
    head: [['Date', 'Description', 'NDIS Code', 'Qty', 'Rate', 'Total']],
    body: tableData,
    theme: 'plain',
    styles: {
      fontSize: 9,
      cellPadding: 5,
      font: 'helvetica',
    },
    headStyles: {
      fillColor: COLORS.primary,
      textColor: COLORS.white,
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 55 },
      2: { cellWidth: 28, fontSize: 8 },
      3: { cellWidth: 18, halign: 'right' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: COLORS.sand,
    },
  });
  
  // Totals Section
  const finalY = doc.lastAutoTable.finalY + 15;
  
  // Totals Box with premium styling
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(pageWidth - 95, finalY, 80, 60, 4, 4, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  
  doc.text('Total Hours:', pageWidth - 90, finalY + 14);
  doc.text('Total KM:', pageWidth - 90, finalY + 24);
  doc.text('Travel Cost:', pageWidth - 90, finalY + 34);
  
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text(`${invoice.total_hours || 0}h`, pageWidth - 20, finalY + 14, { align: 'right' });
  doc.text(`${invoice.total_km || 0}km`, pageWidth - 20, finalY + 24, { align: 'right' });
  doc.text(`$${(invoice.total_travel || 0).toFixed(2)}`, pageWidth - 20, finalY + 34, { align: 'right' });
  
  // Total Payable Line
  doc.setDrawColor(...COLORS.accent);
  doc.setLineWidth(0.5);
  doc.line(pageWidth - 90, finalY + 42, pageWidth - 20, finalY + 42);
  
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.text('TOTAL PAYABLE:', pageWidth - 90, finalY + 52);
  
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text(`$${(invoice.total_payable || 0).toFixed(2)}`, pageWidth - 20, finalY + 52, { align: 'right' });
  
  // Payment Details Footer
  const footerY = Math.max(finalY + 80, pageHeight - 60);
  
  doc.setFillColor(...COLORS.primary);
  doc.roundedRect(15, footerY, pageWidth - 30, 40, 4, 4, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.teal);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT DETAILS', 25, footerY + 12);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.white);
  doc.text('Bank: Commonwealth Bank of Australia', 25, footerY + 22);
  doc.text('BSB: XXX-XXX | Account: XXXX XXXX', 25, footerY + 30);
  
  doc.text('Reference: ' + (invoice.invoice_no || 'INV-XXXX'), 130, footerY + 22);
  doc.text('ABN: XX XXX XXX XXX', 130, footerY + 30);
  
  // Footer text
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('Thank you for choosing Achieve Together Care', pageWidth / 2, pageHeight - 12, { align: 'center' });
  doc.text('achievetogethercare.com.au | 0422 492 736 | daniel@achievetogethercare.com.au', pageWidth / 2, pageHeight - 6, { align: 'center' });
  
  return doc;
}

/**
 * Generate a brochure-quality NDIS Service Agreement PDF
 * @param {Object} data - Agreement data
 * @returns {jsPDF} - PDF document
 */
export function generateServiceAgreementPDF(data = {}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Premium Header
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 60, 'F');
  
  // Teal accent strip
  doc.setFillColor(...COLORS.teal);
  doc.rect(0, 60, pageWidth, 5, 'F');
  
  // ATC Logo Circle
  doc.setFillColor(...COLORS.teal);
  doc.circle(30, 30, 15, 'F');
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('ATC', 30, 34, { align: 'center' });
  
  // Company Name
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(22);
  doc.text('Achieve Together Care', 55, 28);
  
  // Subtitle
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.teal);
  doc.text('NDIS REGISTERED PROVIDER', 55, 38);
  
  // Document Title - Right
  doc.setTextColor(...COLORS.white);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE AGREEMENT', pageWidth - 20, 25, { align: 'right' });
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('NDIS Support Services Contract', pageWidth - 20, 34, { align: 'right' });
  
  // Date badge
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(pageWidth - 55, 42, 40, 12, 2, 2, 'F');
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.white);
  doc.text(data.date || new Date().toLocaleDateString(), pageWidth - 35, 50, { align: 'center' });
  
  // Agreement Reference
  let yPos = 80;
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(15, yPos - 5, pageWidth - 30, 20, 3, 3, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('AGREEMENT REFERENCE', 20, yPos + 3);
  
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.text);
  doc.text(data.reference || `ATC-SA-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`, 20, yPos + 12);
  
  // Parties Section Header
  yPos = 110;
  doc.setFillColor(...COLORS.teal);
  doc.rect(15, yPos, 3, 12, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTIES TO THIS AGREEMENT', 22, yPos + 8);
  
  // Service Provider Box
  yPos = 130;
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(15, yPos, 85, 55, 4, 4, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE PROVIDER', 20, yPos + 10);
  
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.text('Achieve Together Care Pty Ltd', 20, yPos + 22);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('NDIS Registered Provider', 20, yPos + 32);
  doc.text('ABN: XX XXX XXX XXX', 20, yPos + 42);
  
  // Participant Box
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(110, yPos, 85, 55, 4, 4, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accent);
  doc.setFont('helvetica', 'bold');
  doc.text('PARTICIPANT', 115, yPos + 10);
  
  doc.setFontSize(11);
  doc.setTextColor(...COLORS.text);
  doc.text(data.participant_name || 'Participant Name', 115, yPos + 22);
  
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text(`NDIS: ${data.ndis_number || 'XXXXXXXXXXX'}`, 115, yPos + 32);
  doc.text(data.phone || '04XX XXX XXX', 115, yPos + 42);
  
  // Service Details Section
  yPos = 200;
  doc.setFillColor(...COLORS.teal);
  doc.rect(15, yPos, 3, 12, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE DETAILS', 22, yPos + 8);
  
  // Service Details Grid
  yPos = 220;
  const gridWidth = (pageWidth - 45) / 2;
  
  // Start Date
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(15, yPos, gridWidth, 22, 3, 3, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE START DATE', 20, yPos + 8);
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.text(data.start_date || new Date().toLocaleDateString(), 20, yPos + 17);
  
  // End Date
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(25 + gridWidth, yPos, gridWidth, 22, 3, 3, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICE END DATE', 30 + gridWidth, yPos + 8);
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.text(data.end_date || 'Ongoing', 30 + gridWidth, yPos + 17);
  
  // Services Provided
  yPos += 28;
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(15, yPos, pageWidth - 30, 22, 3, 3, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('SERVICES PROVIDED', 20, yPos + 8);
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.text(data.services || 'As per NDIS plan', 20, yPos + 17);
  
  // Hourly Rate & Funding Type
  yPos += 28;
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(15, yPos, gridWidth, 22, 3, 3, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('HOURLY RATE', 20, yPos + 8);
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.text(data.hourly_rate || 'SCHADS Award rates apply', 20, yPos + 17);
  
  doc.setFillColor(...COLORS.sand);
  doc.roundedRect(25 + gridWidth, yPos, gridWidth, 22, 3, 3, 'F');
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('FUNDING TYPE', 30 + gridWidth, yPos + 8);
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'normal');
  doc.text(data.funding_type || 'Plan Managed', 30 + gridWidth, yPos + 17);
  
  // Key Terms Section
  yPos += 35;
  doc.setFillColor(...COLORS.teal);
  doc.rect(15, yPos, 3, 12, 'F');
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text('KEY TERMS & CONDITIONS', 22, yPos + 8);
  
  // Terms list
  yPos += 18;
  const terms = [
    '1. Services will be delivered in accordance with the NDIS Price Guide and Quality Standards.',
    '2. Either party may cancel or reschedule with 48 hours notice without charge.',
    '3. Cancellations within 48 hours may incur charges as per NDIS guidelines.',
    '4. Privacy and confidentiality will be maintained in accordance with Australian Privacy Principles.',
    '5. This agreement can be reviewed or terminated by either party with 14 days written notice.'
  ];
  
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'normal');
  
  terms.forEach((term, i) => {
    doc.text(term, 20, yPos + (i * 8));
  });
  
  // Footer with branding
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, pageHeight - 25, pageWidth, 25, 'F');
  
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.light);
  doc.text('Achieve Together Care Pty Ltd | NDIS Provider No: XXXXXXXXX | ABN: XX XXX XXX XXX', pageWidth / 2, pageHeight - 15, { align: 'center' });
  doc.text('Ph: 0422 492 736 | Email: admin@achievetogethercare.com.au | Web: achievetogethercare.com.au', pageWidth / 2, pageHeight - 8, { align: 'center' });
  
  // Page indicator
  doc.setTextColor(...COLORS.muted);
  doc.text('Page 1 of 1', pageWidth - 15, pageHeight - 8, { align: 'right' });
  
  return doc;
}

/**
 * Generate a premium capability brochure PDF
 * @returns {jsPDF} - PDF document
 */
export function generateCapabilityBrochure() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Cover Page - Premium Design
  // Top section with primary color
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, pageHeight * 0.55, 'F');
  
  // Bottom warm sand section
  doc.setFillColor(...COLORS.light);
  doc.rect(0, pageHeight * 0.55, pageWidth, pageHeight * 0.45, 'F');
  
  // Accent bar
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, pageHeight * 0.55 - 6, pageWidth, 6, 'F');
  
  // Logo Circle - centered
  doc.setFillColor(...COLORS.teal);
  doc.circle(pageWidth / 2, pageHeight * 0.55, 35, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('ATC', pageWidth / 2, pageHeight * 0.55 + 8, { align: 'center' });
  
  // Title
  doc.setFontSize(36);
  doc.setTextColor(...COLORS.white);
  doc.text('ACHIEVE', pageWidth / 2, 55, { align: 'center' });
  doc.text('TOGETHER', pageWidth / 2, 75, { align: 'center' });
  doc.text('CARE', pageWidth / 2, 95, { align: 'center' });
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.teal);
  doc.text('NDIS Provider Capability Brochure 2026', pageWidth / 2, 115, { align: 'center' });
  
  // Tagline
  doc.setTextColor(...COLORS.text);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'italic');
  doc.text('"Empowering Independence,', pageWidth / 2, pageHeight * 0.55 + 55, { align: 'center' });
  doc.text('One Goal at a Time"', pageWidth / 2, pageHeight * 0.55 + 68, { align: 'center' });
  
  // Contact Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...COLORS.muted);
  doc.text('Sydney, NSW | 0422 492 736', pageWidth / 2, pageHeight - 35, { align: 'center' });
  doc.setTextColor(...COLORS.accent);
  doc.text('achievetogethercare.com.au', pageWidth / 2, pageHeight - 25, { align: 'center' });
  
  // Page 2 - Services
  doc.addPage();
  
  // Header
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 40, pageWidth, 4, 'F');
  
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text('Our Services', 20, 26);
  
  // Services List
  const services = [
    {
      title: 'Community Participation',
      code: '04_104_0125_6_1',
      description: 'Supporting participants to engage in community activities, social events, and recreational programs to build independence and social connections.'
    },
    {
      title: 'Assistance with Daily Life',
      code: '01_011_0107_1_1',
      description: 'Help with everyday tasks including personal care, household activities, and developing life skills for greater independence.'
    },
    {
      title: 'High Intensity Support',
      code: '01_015_0120_1_1',
      description: 'Specialized support for participants with complex needs, including behavioral support and high-care requirements.'
    },
    {
      title: 'Group Activities',
      code: '04_102_0125_6_1',
      description: 'Small group programs designed to develop social skills, pursue interests, and build friendships in a supported environment.'
    },
    {
      title: 'Transport Assistance',
      code: '02_051_0108_1_1',
      description: 'Safe and reliable transport to appointments, activities, and community events with experienced support workers.'
    }
  ];
  
  let yPos = 55;
  
  services.forEach((service, index) => {
    // Service Box with rounded corners
    doc.setFillColor(...COLORS.sand);
    doc.roundedRect(15, yPos, pageWidth - 30, 42, 4, 4, 'F');
    
    // Accent line
    doc.setFillColor(...COLORS.teal);
    doc.rect(15, yPos, 4, 42, 'F');
    
    // Service Number Circle
    doc.setFillColor(...COLORS.accent);
    doc.circle(32, yPos + 12, 9, 'F');
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.white);
    doc.setFont('helvetica', 'bold');
    doc.text(String(index + 1), 32, yPos + 16, { align: 'center' });
    
    // Title
    doc.setFontSize(13);
    doc.setTextColor(...COLORS.text);
    doc.text(service.title, 48, yPos + 14);
    
    // NDIS Code
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.text(`NDIS: ${service.code}`, 48, yPos + 22);
    
    // Description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(service.description, pageWidth - 68);
    doc.text(lines, 48, yPos + 32);
    
    yPos += 48;
  });
  
  // Page 3 - Why Choose Us
  doc.addPage();
  
  // Header
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 40, pageWidth, 4, 'F');
  
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text('Why Choose ATC?', 20, 26);
  
  // Features Grid
  const features = [
    { title: 'Experienced Team', desc: 'All workers are highly trained with current NDIS screening, first aid, and specialized training.' },
    { title: 'Goal-Focused Support', desc: 'We align all activities with participant NDIS goals, providing evidence for plan reviews.' },
    { title: 'Clinical Safety', desc: 'Strong focus on restrictive practice reduction and positive behavior support strategies.' },
    { title: 'Flexible Scheduling', desc: 'Support available 7 days a week with roster flexibility to suit participant needs.' },
    { title: 'Transparent Reporting', desc: 'Detailed shift reports with activities, engagement levels, and goal progress tracking.' },
    { title: 'Local Knowledge', desc: 'Deep connections with Sydney community resources, venues, and support networks.' }
  ];
  
  yPos = 55;
  const colWidth = (pageWidth - 50) / 2;
  
  features.forEach((feature, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 15 + (col * (colWidth + 20));
    const y = 55 + (row * 58);
    
    // Feature card background
    doc.setFillColor(...COLORS.sand);
    doc.roundedRect(x, y, colWidth, 50, 4, 4, 'F');
    
    // Check icon circle
    doc.setFillColor(...COLORS.teal);
    doc.circle(x + 12, y + 14, 9, 'F');
    doc.setTextColor(...COLORS.white);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('✓', x + 12, y + 18, { align: 'center' });
    
    // Title
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.text);
    doc.text(feature.title, x + 28, y + 16);
    
    // Description
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(feature.desc, colWidth - 35);
    doc.text(lines, x + 28, y + 28);
  });
  
  // Contact CTA Section
  yPos = 235;
  
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(15, yPos, pageWidth - 30, 50, 6, 6, 'F');
  
  doc.setFontSize(16);
  doc.setTextColor(...COLORS.white);
  doc.setFont('helvetica', 'bold');
  doc.text('Ready to Get Started?', pageWidth / 2, yPos + 18, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Contact Daniel Hayward to discuss how we can support your participants', pageWidth / 2, yPos + 30, { align: 'center' });
  doc.text('0422 492 736  |  daniel@achievetogethercare.com.au', pageWidth / 2, yPos + 42, { align: 'center' });
  
  return doc;
}

/**
 * Download a PDF document
 * @param {jsPDF} doc - PDF document
 * @param {string} filename - File name for download
 */
export function downloadPDF(doc, filename) {
  doc.save(filename);
}

/**
 * Open PDF in new tab
 * @param {jsPDF} doc - PDF document
 */
export function openPDFInNewTab(doc) {
  const blob = doc.output('blob');
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
