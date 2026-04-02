// Payroll Calculations - SCHADS Award Level 3
import type { StaffMember } from './data';

// SCHADS Award Level 3 Rates (2025-26)
export const SCHADS_L3_BASE = 38.08; // Base hourly rate

// Loadings
export const LOADINGS = {
  evening: 0.25, // 25% after 6pm
  saturday: 0.50, // 50% Saturday
  sunday: 0.75, // 75% Sunday
  publicHoliday: 1.00, // 100% Public Holiday
};

// ATO Tax Tables 2025-26
export function calculateTax(annualIncome: number): number {
  if (annualIncome <= 18200) return 0;
  if (annualIncome <= 45000) return (annualIncome - 18200) * 0.19;
  if (annualIncome <= 120000) return 5092 + (annualIncome - 45000) * 0.325;
  if (annualIncome <= 180000) return 29467 + (annualIncome - 120000) * 0.37;
  return 51667 + (annualIncome - 180000) * 0.45;
}

export function calculateWeeklyTax(weeklyGross: number): number {
  const annualEquivalent = weeklyGross * 52;
  const annualTax = calculateTax(annualEquivalent);
  return annualTax / 52;
}

export function calculateFortnightlyTax(fortnightlyGross: number): number {
  const annualEquivalent = fortnightlyGross * 26;
  const annualTax = calculateTax(annualEquivalent);
  return annualTax / 26;
}

// Superannuation 11.5% (2025-26)
export const SUPER_RATE = 0.115;

export function calculateSuper(grossEarnings: number): number {
  return grossEarnings * SUPER_RATE;
}

// KM Allowance
export const KM_RATE = 0.95; // ATO rate per km

export function calculateKmAllowance(km: number): number {
  return km * KM_RATE;
}

// Calculate total earnings
export interface EarningsBreakdown {
  ordinaryHours: number;
  ordinaryPay: number;
  eveningHours: number;
  eveningPay: number;
  saturdayHours: number;
  saturdayPay: number;
  sundayHours: number;
  sundayPay: number;
  publicHolidayHours: number;
  publicHolidayPay: number;
  kmAllowance: number;
  grossPay: number;
  tax: number;
  super: number;
  netPay: number;
}

export function calculatePayroll(
  ordinaryHours: number,
  eveningHours: number = 0,
  saturdayHours: number = 0,
  sundayHours: number = 0,
  publicHolidayHours: number = 0,
  km: number = 0,
  rate: number = SCHADS_L3_BASE
): EarningsBreakdown {
  const ordinaryPay = ordinaryHours * rate;
  const eveningPay = eveningHours * rate * (1 + LOADINGS.evening);
  const saturdayPay = saturdayHours * rate * (1 + LOADINGS.saturday);
  const sundayPay = sundayHours * rate * (1 + LOADINGS.sunday);
  const publicHolidayPay = publicHolidayHours * rate * (1 + LOADINGS.publicHoliday);
  const kmAllowance = calculateKmAllowance(km);

  const grossWages = ordinaryPay + eveningPay + saturdayPay + sundayPay + publicHolidayPay;
  const grossPay = grossWages + kmAllowance;
  const superAmount = calculateSuper(grossWages);
  const tax = calculateFortnightlyTax(grossWages);
  const netPay = grossPay - tax;

  return {
    ordinaryHours,
    ordinaryPay,
    eveningHours,
    eveningPay,
    saturdayHours,
    saturdayPay,
    sundayHours,
    sundayPay,
    publicHolidayHours,
    publicHolidayPay,
    kmAllowance,
    grossPay,
    tax,
    super: superAmount,
    netPay,
  };
}

export default {
  SCHADS_L3_BASE,
  LOADINGS,
  SUPER_RATE,
  KM_RATE,
  calculateTax,
  calculateWeeklyTax,
  calculateFortnightlyTax,
  calculateSuper,
  calculateKmAllowance,
  calculatePayroll,
};
