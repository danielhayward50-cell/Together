// ATC Platform - PDF Generation Service
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

// ATC Brand Colors
const COLORS = {
  primary: [10, 22, 40],      // #0A1628 - Dark Navy
  accent: [20, 184, 182],     // #14B8B6 - Teal
  secondary: [183, 148, 244], // #B794F4 - Lavender
  text: [15, 23, 42],         // Slate 900
  muted: [100, 116, 139],     // Slate 500
  light: [241, 245, 249],     // Slate 100
};

/**
 * Generate a professional PDF invoice
 * @param {Object} invoice - Invoice data object
 * @returns {jsPDF} - PDF document
 */
export function generateInvoicePDF(invoice) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header Background
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  // Company Logo/Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Achieve Together Care', 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('NDIS Provider | ABN: XX XXX XXX XXX', 20, 35);
  
  // Invoice Label
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('TAX INVOICE', pageWidth - 20, 25, { align: 'right' });
  doc.setFont('helvetica', 'normal');
  doc.text(invoice.invoice_no, pageWidth - 20, 35, { align: 'right' });
  
  // Reset text color
  doc.setTextColor(...COLORS.text);
  
  // Invoice Details Section
  let yPos = 60;
  
  // Left side - Bill To
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text('BILL TO', 20, yPos);
  
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.text);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.client || 'Client Name', 20, yPos + 8);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(`NDIS: ${invoice.ndis_number || 'N/A'}`, 20, yPos + 16);
  doc.text(`Plan Manager: ${invoice.funding_manager || 'N/A'}`, 20, yPos + 24);
  
  // Right side - Invoice Info
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.text('INVOICE DATE', pageWidth - 60, yPos);
  doc.text('PERIOD', pageWidth - 60, yPos + 15);
  doc.text('SUPPORT WORKER', pageWidth - 60, yPos + 30);
  
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.text);
  doc.text(invoice.date || new Date().toLocaleDateString(), pageWidth - 20, yPos, { align: 'right' });
  doc.text(invoice.period || 'N/A', pageWidth - 20, yPos + 15, { align: 'right' });
  doc.text(invoice.worker || 'N/A', pageWidth - 20, yPos + 30, { align: 'right' });
  
  // Line Items Table
  yPos = 105;
  
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
      cellPadding: 4,
    },
    headStyles: {
      fillColor: COLORS.light,
      textColor: COLORS.muted,
      fontStyle: 'bold',
      fontSize: 8,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 60 },
      2: { cellWidth: 30, fontStyle: 'italic', fontSize: 8 },
      3: { cellWidth: 20, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 25, halign: 'right', fontStyle: 'bold' },
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
  });
  
  // Totals Section
  const finalY = doc.lastAutoTable.finalY + 15;
  
  // Totals Box
  doc.setFillColor(...COLORS.light);
  doc.roundedRect(pageWidth - 90, finalY, 70, 55, 3, 3, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  
  doc.text('Total Hours:', pageWidth - 85, finalY + 12);
  doc.text('Total KM:', pageWidth - 85, finalY + 22);
  doc.text('Travel Cost:', pageWidth - 85, finalY + 32);
  
  doc.setTextColor(...COLORS.text);
  doc.text(`${invoice.total_hours || 0}h`, pageWidth - 25, finalY + 12, { align: 'right' });
  doc.text(`${invoice.total_km || 0}km`, pageWidth - 25, finalY + 22, { align: 'right' });
  doc.text(`$${(invoice.total_travel || 0).toFixed(2)}`, pageWidth - 25, finalY + 32, { align: 'right' });
  
  // Total Payable
  doc.setDrawColor(...COLORS.accent);
  doc.line(pageWidth - 85, finalY + 40, pageWidth - 25, finalY + 40);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('TOTAL PAYABLE:', pageWidth - 85, finalY + 50);
  
  doc.setFontSize(14);
  doc.setTextColor(...COLORS.accent);
  doc.text(`$${(invoice.total_payable || 0).toFixed(2)}`, pageWidth - 25, finalY + 50, { align: 'right' });
  
  // Payment Details Footer
  const footerY = finalY + 75;
  
  doc.setFillColor(...COLORS.light);
  doc.rect(20, footerY, pageWidth - 40, 35, 'F');
  
  doc.setFontSize(9);
  doc.setTextColor(...COLORS.muted);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT DETAILS', 25, footerY + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.text('Bank: Commonwealth Bank of Australia', 25, footerY + 20);
  doc.text('BSB: XXX-XXX | Account: XXXX XXXX', 25, footerY + 28);
  doc.text('Reference: ' + (invoice.invoice_no || 'INV-XXXX'), 120, footerY + 20);
  doc.text('ABN: XX XXX XXX XXX', 120, footerY + 28);
  
  // Footer
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.muted);
  doc.text('Thank you for choosing Achieve Together Care', pageWidth / 2, 280, { align: 'center' });
  doc.text('achievetogethercare.com.au | 0422 492 736 | daniel@achievetogethercare.com.au', pageWidth / 2, 286, { align: 'center' });
  
  return doc;
}

/**
 * Generate a capability brochure PDF
 * @returns {jsPDF} - PDF document
 */
export function generateCapabilityBrochure() {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Cover Page
  // Full page teal header
  doc.setFillColor(...COLORS.accent);
  doc.rect(0, 0, pageWidth, pageHeight / 2, 'F');
  
  // White bottom half
  doc.setFillColor(255, 255, 255);
  doc.rect(0, pageHeight / 2, pageWidth, pageHeight / 2, 'F');
  
  // Logo Circle
  doc.setFillColor(255, 255, 255);
  doc.circle(pageWidth / 2, pageHeight / 2, 30, 'F');
  
  doc.setFontSize(20);
  doc.setTextColor(...COLORS.primary);
  doc.setFont('helvetica', 'bold');
  doc.text('ATC', pageWidth / 2, pageHeight / 2 + 7, { align: 'center' });
  
  // Title
  doc.setFontSize(32);
  doc.setTextColor(255, 255, 255);
  doc.text('ACHIEVE', pageWidth / 2, 60, { align: 'center' });
  doc.text('TOGETHER', pageWidth / 2, 75, { align: 'center' });
  doc.text('CARE', pageWidth / 2, 90, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('NDIS Provider Capability Brochure 2026', pageWidth / 2, 105, { align: 'center' });
  
  // Tagline
  doc.setTextColor(...COLORS.primary);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'italic');
  doc.text('"Empowering Independence, One Goal at a Time"', pageWidth / 2, pageHeight / 2 + 55, { align: 'center' });
  
  // Contact Info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sydney, NSW | 0422 492 736', pageWidth / 2, pageHeight - 40, { align: 'center' });
  doc.text('achievetogethercare.com.au', pageWidth / 2, pageHeight - 32, { align: 'center' });
  
  // Page 2 - Services
  doc.addPage();
  
  // Header
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Our Services', 20, 23);
  
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
  
  let yPos = 50;
  
  services.forEach((service, index) => {
    // Service Box
    doc.setFillColor(...COLORS.light);
    doc.roundedRect(15, yPos, pageWidth - 30, 40, 3, 3, 'F');
    
    // Accent line
    doc.setFillColor(...COLORS.accent);
    doc.rect(15, yPos, 4, 40, 'F');
    
    // Service Number
    doc.setFillColor(...COLORS.accent);
    doc.circle(30, yPos + 10, 8, 'F');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text(String(index + 1), 30, yPos + 13, { align: 'center' });
    
    // Title
    doc.setFontSize(12);
    doc.setTextColor(...COLORS.primary);
    doc.text(service.title, 45, yPos + 12);
    
    // NDIS Code
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'italic');
    doc.text(`NDIS: ${service.code}`, 45, yPos + 20);
    
    // Description
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(service.description, pageWidth - 65);
    doc.text(lines, 45, yPos + 30);
    
    yPos += 48;
  });
  
  // Page 3 - Why Choose Us
  doc.addPage();
  
  // Header
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('Why Choose ATC?', 20, 23);
  
  // Features
  const features = [
    { title: 'Experienced Team', desc: 'All workers are highly trained with current NDIS screening, first aid, and specialized training.' },
    { title: 'Goal-Focused Support', desc: 'We align all activities with participant NDIS goals, providing evidence for plan reviews.' },
    { title: 'Clinical Safety', desc: 'Strong focus on restrictive practice reduction and positive behavior support strategies.' },
    { title: 'Flexible Scheduling', desc: 'Support available 7 days a week with roster flexibility to suit participant needs.' },
    { title: 'Transparent Reporting', desc: 'Detailed shift reports with activities, engagement levels, and goal progress tracking.' },
    { title: 'Local Knowledge', desc: 'Deep connections with Sydney community resources, venues, and support networks.' }
  ];
  
  yPos = 50;
  const colWidth = (pageWidth - 45) / 2;
  
  features.forEach((feature, index) => {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 15 + (col * (colWidth + 15));
    const y = 50 + (row * 55);
    
    // Check icon
    doc.setFillColor(...COLORS.accent);
    doc.circle(x + 10, y + 10, 8, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text('✓', x + 10, y + 14, { align: 'center' });
    
    // Title
    doc.setFontSize(11);
    doc.setTextColor(...COLORS.primary);
    doc.setFont('helvetica', 'bold');
    doc.text(feature.title, x + 25, y + 12);
    
    // Description
    doc.setFontSize(9);
    doc.setTextColor(...COLORS.muted);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(feature.desc, colWidth - 30);
    doc.text(lines, x + 25, y + 22);
  });
  
  // Contact Section
  yPos = 220;
  
  doc.setFillColor(...COLORS.accent);
  doc.roundedRect(15, yPos, pageWidth - 30, 50, 5, 5, 'F');
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
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
