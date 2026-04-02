// PDF Generation Utilities for ATC Platform
import type { Report, StaffMember, Invoice, Shift } from './data';
import { OWNER } from './data';

declare global {
  interface Window {
    jspdf: any;
  }
}

const loadJsPDF = (): Promise<any> =>
  new Promise((resolve, reject) => {
    if (window.jspdf) return resolve(window.jspdf);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js";
    s.onload = () => resolve(window.jspdf);
    s.onerror = reject;
    document.head.appendChild(s);
  });

const BLUE = [23, 70, 162] as [number, number, number];
const TEAL = [13, 115, 119] as [number, number, number];
const NAVY = [10, 22, 40] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const GRAY = [100, 116, 139] as [number, number, number];

function pdfHeader(d: any, W: number) {
  d.setFillColor(255, 255, 255);
  d.rect(0, 0, W, 38, "F");
  d.setTextColor(...NAVY);
  d.setFontSize(16);
  d.setFont("helvetica", "bold");
  d.text("Achieve Together Care", 15, 14);
  d.setTextColor(...BLUE);
  d.setFontSize(7.5);
  d.setFont("helvetica", "normal");
  d.text("NDIS Disability Services · Empowering Lives, Achieving Together", 15, 21);
  d.setTextColor(...GRAY);
  d.setFontSize(7.5);
  d.text(OWNER.phone, W - 15, 11, { align: "right" });
  d.text("info@achievetogethercare.com", W - 15, 17, { align: "right" });
  d.text(OWNER.email, W - 15, 23, { align: "right" });
  d.text(`ABN: ${OWNER.abn}`, W - 15, 29, { align: "right" });
  d.setDrawColor(200, 210, 230);
  d.setLineWidth(0.5);
  d.line(15, 33, W - 15, 33);
}

function pdfFooter(d: any, W: number, H: number, docCode?: string) {
  d.setDrawColor(200, 210, 230);
  d.setLineWidth(0.3);
  d.line(15, H - 12, W - 15, H - 12);
  d.setTextColor(...GRAY);
  d.setFontSize(7);
  d.setFont("helvetica", "normal");
  d.text(`Achieve Together Care · NDIS Disability Services · Confidential · ABN: ${OWNER.abn}`, 15, H - 6);
  if (docCode) d.text(docCode, W - 15, H - 6, { align: "right" });
}

// Generate Payslip PDF
export const generatePayslipPDF = async (s: StaffMember) => {
  const { jsPDF } = await loadJsPDF();
  const d = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, M = 15, CW = W - 2 * M;
  let y = 0;

  pdfHeader(d, W);
  y = 44;

  d.setTextColor(...GRAY);
  d.setFontSize(8);
  d.setFont("helvetica", "bold");
  d.text("PAY SLIP", M, y + 5);
  y += 8;
  
  d.setTextColor(...BLUE);
  d.setFontSize(16);
  d.setFont("helvetica", "bold");
  d.text(s.name, M, y + 8);
  y += 20;

  const grossHrs = s.hrs * s.rate;
  const kmAllow = s.km * 0.95;
  const gross = grossHrs + kmAllow;
  const superAmt = grossHrs * 0.115;
  const net = gross - s.tax;

  // Earnings section
  d.setFillColor(23, 70, 162);
  d.rect(M, y, CW, 9, "F");
  d.setTextColor(...WHITE);
  d.setFontSize(8.5);
  d.setFont("helvetica", "bold");
  d.text("Description", M + 3, y + 6);
  d.text("Hours", M + CW * 0.55, y + 6);
  d.text("Rate", M + CW * 0.72, y + 6);
  d.text("Amount", M + CW * 0.87, y + 6);
  y += 9;

  d.setFillColor(255, 255, 255);
  d.rect(M, y, CW, 8, "F");
  d.setTextColor(...NAVY);
  d.setFont("helvetica", "normal");
  d.text("Ordinary Hours", M + 3, y + 5.5);
  d.text(s.hrs.toFixed(2), M + CW * 0.55, y + 5.5);
  d.text(`$${s.rate.toFixed(2)}`, M + CW * 0.72, y + 5.5);
  d.text(`$${grossHrs.toFixed(2)}`, M + CW * 0.87, y + 5.5);
  y += 8;

  d.setFillColor(241, 245, 249);
  d.rect(M, y, CW, 8, "F");
  d.text("KM Allowance", M + 3, y + 5.5);
  d.text(s.km.toString(), M + CW * 0.55, y + 5.5);
  d.text("$0.95", M + CW * 0.72, y + 5.5);
  d.text(`$${kmAllow.toFixed(2)}`, M + CW * 0.87, y + 5.5);
  y += 16;

  // Summary
  d.setTextColor(...NAVY);
  d.setFontSize(9);
  d.setFont("helvetica", "bold");
  d.text("Gross", M, y + 6);
  d.setFontSize(14);
  d.text(`$${gross.toFixed(2)}`, M, y + 14);
  
  d.setTextColor(239, 68, 68);
  d.setFontSize(9);
  d.text("PAYG Tax", M + CW / 2, y + 6);
  d.setFontSize(14);
  d.text(`-$${s.tax.toFixed(2)}`, M + CW / 2, y + 14);
  y += 22;

  d.setTextColor(91, 45, 142);
  d.setFontSize(9);
  d.text(`Super 11.5%`, M, y + 6);
  d.setFontSize(14);
  d.text(`$${superAmt.toFixed(2)}`, M, y + 14);

  d.setFillColor(...BLUE);
  d.roundedRect(M + CW / 2 - 5, y - 2, CW / 2 + 5, 20, 3, 3, "F");
  d.setTextColor(...WHITE);
  d.setFontSize(9);
  d.text("NET PAY", M + CW / 2 + 3, y + 6);
  d.setFontSize(16);
  d.text(`$${net.toFixed(2)}`, M + CW / 2 + 3, y + 15);

  pdfFooter(d, W, 297);
  d.save(`Payslip_${s.name.replace(/\s+/g, "_")}.pdf`);
};

// Generate Invoice PDF
export const generateInvoicePDF = async (inv: Invoice) => {
  const { jsPDF } = await loadJsPDF();
  const d = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 15, CW = W - 2 * M;
  let y = 0;

  pdfHeader(d, W);
  y = 36;

  // Title
  d.setTextColor(...GRAY);
  d.setFontSize(7);
  d.setFont("helvetica", "bold");
  d.text("N D I S  S E R V I C E  I N V O I C E", M, y);
  y += 6;
  
  d.setTextColor(...NAVY);
  d.setFontSize(18);
  d.setFont("helvetica", "bold");
  d.text("Tax Invoice", M, y);
  y += 10;

  // Info table
  const infoRows: [string, string][] = [
    ["Invoice Number", inv.invoiceNo],
    ["Date", inv.date],
    ["Period", inv.period],
    ["Participant", inv.client],
    ["NDIS Number", inv.ndisNumber],
    ["Plan Manager", inv.fundingManager],
  ];

  infoRows.forEach(([label, value], i) => {
    d.setFillColor(i % 2 === 0 ? 245 : 255, i % 2 === 0 ? 247 : 255, i % 2 === 0 ? 250 : 255);
    d.rect(M, y, CW, 8, "F");
    d.setTextColor(...BLUE);
    d.setFontSize(8.5);
    d.setFont("helvetica", "bold");
    d.text(label, M + 3, y + 5.5);
    d.setTextColor(...NAVY);
    d.setFont("helvetica", "normal");
    d.text(value, M + 60, y + 5.5);
    y += 8;
  });
  y += 10;

  // Services table
  d.setFillColor(23, 70, 162);
  d.rect(M, y, CW, 8, "F");
  d.setTextColor(...WHITE);
  d.setFontSize(6.5);
  d.setFont("helvetica", "bold");
  d.text("Description", M + 2, y + 5.5);
  d.text("NDIS Code", M + CW * 0.45, y + 5.5);
  d.text("Qty", M + CW * 0.64, y + 5.5);
  d.text("Rate", M + CW * 0.76, y + 5.5);
  d.text("Amount", M + CW - 2, y + 5.5, { align: "right" });
  y += 8;

  inv.lines.forEach((line, i) => {
    d.setFillColor(i % 2 === 0 ? 255 : 247, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 252);
    d.rect(M, y, CW, 7, "F");
    d.setTextColor(...NAVY);
    d.setFontSize(6.5);
    d.setFont("helvetica", "normal");
    d.text(line.description, M + 2, y + 4.8);
    d.text(line.ndisCode, M + CW * 0.45, y + 4.8);
    d.text(`${line.qty} ${line.unit}`, M + CW * 0.64, y + 4.8);
    d.text(`$${line.rate.toFixed(2)}`, M + CW * 0.76, y + 4.8);
    d.setFont("helvetica", "bold");
    d.text(`$${line.total.toFixed(2)}`, M + CW - 2, y + 4.8, { align: "right" });
    y += 7;
  });

  // Total
  d.setFillColor(245, 247, 250);
  d.rect(M, y, CW, 9, "F");
  d.setTextColor(...NAVY);
  d.setFontSize(8);
  d.setFont("helvetica", "bold");
  d.text("TOTAL (GST Free - NDIS Services)", M + 3, y + 6);
  d.setFontSize(10);
  d.text(`$${inv.totalPayable.toFixed(2)}`, M + CW - 3, y + 6, { align: "right" });

  pdfFooter(d, W, H, `ATC-INV-${inv.invoiceNo.replace(/[^A-Z0-9]/gi, "")}`);
  d.save(`${inv.invoiceNo}_${inv.client.replace(/\s+/g, "_")}.pdf`);
};

// Preview Invoice in Browser
export const previewInvoicePDF = async (inv: Invoice) => {
  const { jsPDF } = await loadJsPDF();
  const d = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 15, CW = W - 2 * M;
  let y = 0;

  pdfHeader(d, W);
  y = 36;

  d.setTextColor(...GRAY);
  d.setFontSize(7);
  d.setFont("helvetica", "bold");
  d.text("N D I S  S E R V I C E  I N V O I C E", M, y);
  y += 6;
  
  d.setTextColor(...NAVY);
  d.setFontSize(18);
  d.setFont("helvetica", "bold");
  d.text("Tax Invoice", M, y);
  y += 10;

  const infoRows: [string, string][] = [
    ["Invoice Number", inv.invoiceNo],
    ["Date", inv.date],
    ["Period", inv.period],
    ["Participant", inv.client],
    ["NDIS Number", inv.ndisNumber],
    ["Plan Manager", inv.fundingManager],
  ];

  infoRows.forEach(([label, value], i) => {
    d.setFillColor(i % 2 === 0 ? 245 : 255, i % 2 === 0 ? 247 : 255, i % 2 === 0 ? 250 : 255);
    d.rect(M, y, CW, 8, "F");
    d.setTextColor(...BLUE);
    d.setFontSize(8.5);
    d.setFont("helvetica", "bold");
    d.text(label, M + 3, y + 5.5);
    d.setTextColor(...NAVY);
    d.setFont("helvetica", "normal");
    d.text(value, M + 60, y + 5.5);
    y += 8;
  });
  y += 10;

  d.setFillColor(23, 70, 162);
  d.rect(M, y, CW, 8, "F");
  d.setTextColor(...WHITE);
  d.setFontSize(6.5);
  d.setFont("helvetica", "bold");
  d.text("Description", M + 2, y + 5.5);
  d.text("NDIS Code", M + CW * 0.45, y + 5.5);
  d.text("Qty", M + CW * 0.64, y + 5.5);
  d.text("Rate", M + CW * 0.76, y + 5.5);
  d.text("Amount", M + CW - 2, y + 5.5, { align: "right" });
  y += 8;

  inv.lines.forEach((line, i) => {
    d.setFillColor(i % 2 === 0 ? 255 : 247, i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 252);
    d.rect(M, y, CW, 7, "F");
    d.setTextColor(...NAVY);
    d.setFontSize(6.5);
    d.setFont("helvetica", "normal");
    d.text(line.description, M + 2, y + 4.8);
    d.text(line.ndisCode, M + CW * 0.45, y + 4.8);
    d.text(`${line.qty} ${line.unit}`, M + CW * 0.64, y + 4.8);
    d.text(`$${line.rate.toFixed(2)}`, M + CW * 0.76, y + 4.8);
    d.setFont("helvetica", "bold");
    d.text(`$${line.total.toFixed(2)}`, M + CW - 2, y + 4.8, { align: "right" });
    y += 7;
  });

  d.setFillColor(245, 247, 250);
  d.rect(M, y, CW, 9, "F");
  d.setTextColor(...NAVY);
  d.setFontSize(8);
  d.setFont("helvetica", "bold");
  d.text("TOTAL (GST Free - NDIS Services)", M + 3, y + 6);
  d.setFontSize(10);
  d.text(`$${inv.totalPayable.toFixed(2)}`, M + CW - 3, y + 6, { align: "right" });

  pdfFooter(d, W, H, `ATC-INV-${inv.invoiceNo.replace(/[^A-Z0-9]/gi, "")}`);
  
  const blob = d.output("blob");
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

export default {
  generatePayslipPDF,
  generateInvoicePDF,
  previewInvoicePDF,
};
