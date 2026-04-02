// Client Management Utilities
import type { Shift } from './data';

export interface ClientProfile {
  id: number;
  name: string;
  ndisNumber: string;
  phone: string;
  email: string;
  address: string;
  dob: string;
  emergencyContact: string;
  emergencyPhone: string;
  goals: string[];
  planManager: string;
  planManagerEmail: string;
  supportCoordinator?: string;
  fundingType: 'Self Managed' | 'Plan Managed' | 'NDIA Managed';
  planStartDate: string;
  planEndDate: string;
  weeklyHours: number;
  supportWorkers: string[];
  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    gp?: string;
    gpPhone?: string;
  };
  preferences?: {
    communication?: string;
    activities?: string[];
    dietary?: string[];
  };
}

export function getClientAge(dob: string): number {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function getClientInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}

export function getPlanDaysRemaining(planEndDate: string): number {
  const today = new Date();
  const endDate = new Date(planEndDate);
  const diff = endDate.getTime() - today.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isPlanExpiringSoon(planEndDate: string, daysThreshold: number = 60): boolean {
  const daysRemaining = getPlanDaysRemaining(planEndDate);
  return daysRemaining >= 0 && daysRemaining <= daysThreshold;
}

export function calculateMonthlyHours(weeklyHours: number): number {
  return weeklyHours * 4.33; // Average weeks per month
}

export function getClientShiftHistory(clientName: string, shifts: Shift[]): Shift[] {
  return shifts
    .filter(s => s.participant === clientName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function calculateTotalHoursThisMonth(clientName: string, shifts: Shift[]): number {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  return shifts
    .filter(s => 
      s.participant === clientName &&
      s.status === 'completed' &&
      new Date(s.date) >= monthStart
    )
    .reduce((total, s) => total + s.hours, 0);
}

export default {
  getClientAge,
  getClientInitials,
  getPlanDaysRemaining,
  isPlanExpiringSoon,
  calculateMonthlyHours,
  getClientShiftHistory,
  calculateTotalHoursThisMonth,
};
