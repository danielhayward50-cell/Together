// Compliance Document Management
import type { ComplianceDoc } from './data';

export function getComplianceStatus(doc: ComplianceDoc): ComplianceDoc['status'] {
  if (doc.status === 'pending') return 'pending';
  
  const today = new Date();
  const expiryDate = new Date(doc.expiry);
  
  if (expiryDate < today) return 'expired';
  
  const daysUntilExpiry = Math.floor((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysUntilExpiry <= 30) return 'expiring';
  
  return 'valid';
}

export function getComplianceColor(status: ComplianceDoc['status']): string {
  const colors = {
    valid: '#10B981',
    expiring: '#F59E0B',
    expired: '#EF4444',
    pending: '#94A3B8',
  };
  return colors[status];
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function isComplianceExpiringSoon(doc: ComplianceDoc, daysThreshold: number = 30): boolean {
  const days = getDaysUntilExpiry(doc.expiry);
  return days >= 0 && days <= daysThreshold;
}

export function getExpiredDocuments(docs: ComplianceDoc[]): ComplianceDoc[] {
  return docs.filter(doc => getComplianceStatus(doc) === 'expired');
}

export function getExpiringDocuments(docs: ComplianceDoc[], daysThreshold: number = 30): ComplianceDoc[] {
  return docs.filter(doc => isComplianceExpiringSoon(doc, daysThreshold));
}

export function getComplianceScore(docs: ComplianceDoc[]): number {
  const total = docs.length;
  if (total === 0) return 100;
  
  const valid = docs.filter(doc => getComplianceStatus(doc) === 'valid').length;
  return Math.round((valid / total) * 100);
}

export const REQUIRED_DOCUMENTS = [
  'First Aid Certificate',
  'NDIS Worker Orientation',
  'Police Check',
  'Working with Children Check',
  "Driver's Licence",
  'Car Insurance',
  'COVID-19 Vaccination',
];

export function getMissingDocuments(docs: ComplianceDoc[]): string[] {
  const existing = docs.map(d => d.name);
  return REQUIRED_DOCUMENTS.filter(req => !existing.includes(req));
}

export default {
  getComplianceStatus,
  getComplianceColor,
  getDaysUntilExpiry,
  isComplianceExpiringSoon,
  getExpiredDocuments,
  getExpiringDocuments,
  getComplianceScore,
  REQUIRED_DOCUMENTS,
  getMissingDocuments,
};
