// Invoice Management Utilities
import type { Invoice, InvoiceLine } from './data';

export function calculateInvoiceTotal(lines: InvoiceLine[]): number {
  return lines.reduce((sum, line) => sum + line.total, 0);
}

export function calculateInvoiceHours(lines: InvoiceLine[]): number {
  return lines
    .filter(line => line.unit === 'hours')
    .reduce((sum, line) => sum + line.qty, 0);
}

export function calculateInvoiceKm(lines: InvoiceLine[]): number {
  return lines
    .filter(line => line.unit === 'km')
    .reduce((sum, line) => sum + line.qty, 0);
}

export function formatInvoiceNumber(num: number): string {
  return `ATC-${new Date().getFullYear()}-${String(num).padStart(3, '0')}`;
}

export function getInvoiceStatusColor(status: Invoice['status']): string {
  const colors = {
    draft: '#94A3B8',
    sent: '#3B82F6',
    paid: '#10B981',
    overdue: '#EF4444',
    pending: '#F59E0B',
  };
  return colors[status] || colors.draft;
}

export function getNextInvoiceNumber(existingInvoices: Invoice[]): string {
  const currentYear = new Date().getFullYear();
  const yearInvoices = existingInvoices.filter(inv => 
    inv.invoiceNo.startsWith(`ATC-${currentYear}`)
  );
  const maxNum = yearInvoices.reduce((max, inv) => {
    const num = parseInt(inv.invoiceNo.split('-')[2] || '0', 10);
    return Math.max(max, num);
  }, 0);
  return formatInvoiceNumber(maxNum + 1);
}

export default {
  calculateInvoiceTotal,
  calculateInvoiceHours,
  calculateInvoiceKm,
  formatInvoiceNumber,
  getInvoiceStatusColor,
  getNextInvoiceNumber,
};
