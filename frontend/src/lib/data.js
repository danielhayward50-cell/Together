// ATC Platform Data Structures and Constants

export const C = {
  blue: "#1746A2",
  blueLight: "#2B5FD9",
  blueDark: "#0D2F7A",
  blue50: "#EBF0FF",
  blue100: "#D6E0FF",
  teal: "#0D7377",
  tealLight: "#14BDBD",
  lime: "#C8E64A",
  limeDark: "#9BB230",
  limeLight: "#D4ED6E",
  navy: "#0A1628",
  navyLight: "#162240",
  white: "#FFFFFF",
  gray50: "#F8FAFC",
  gray100: "#F1F5F9",
  gray200: "#E2E8F0",
  gray300: "#CBD5E1",
  gray400: "#94A3B8",
  gray500: "#64748B",
  gray600: "#475569",
  gray700: "#334155",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#5B2D8E",
};

// Dashboard Stats (defined early to avoid circular dependency)
export const dashboardStats = {
  revenue: {
    amount: 18450.00,
    change: 12,
    period: "Mar 2026"
  },
  outreachROI: {
    percentage: 24,
    newIntakes: 3
  },
  ndisBurnRate: {
    dailyRate: 615.00,
    percentage: 72
  },
  complianceAlert: {
    count: 1,
    message: "Staff Doc Expiry Warning"
  }
};

// Owner details
export const OWNER = {
  name: "Daniel Hayward",
  email: "daniel@achievetogethercare.com",
  phone: "0422 492 736",
  abn: "68 493 366 184",
  bsb: "067-873",
  acc: "207-436-73",
};

// Types
export interface ReportSection {
  t: string;
  c: string;
}

export interface Report {
  id: number;
  type: "daily" | "weekly" | "monthly" | "incident";
  title: string;
  date: string;
  author: string;
  status: string;
  participant: string;
  ndisNumber: string;
  hours: number;
  km: number;
  mood: string;
  shiftTime: string;
  sections: ReportSection[];
}

export interface ComplianceDoc {
  name: string;
  number?: string;
  expiry: string;
  status: "valid" | "expiring" | "expired" | "pending";
}

export interface StaffMember {
  id: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  tfn: string;
  bsb: string;
  acc: string;
  sf: string; // Super fund
  sn: string; // Super member number
  rate: number;
  hrs: number;
  km: number;
  tax: number;
  compliance: ComplianceDoc[];
}

export interface Shift {
  id: number;
  date: string;
  participant: string;
  worker: string;
  startTime: string;
  endTime: string;
  hours: number;
  km: number;
  status: "scheduled" | "completed" | "cancelled";
  activities?: string[];
  engagement?: string[];
  support?: string[];
  goals?: string[];
  notes?: string;
}

export interface InvoiceLine {
  date: string;
  description: string;
  ndisCode: string;
  qty: number;
  unit: string;
  rate: number;
  total: number;
}

export interface Invoice {
  invoiceNo: string;
  date: string;
  period: string;
  client: string;
  ndisNumber: string;
  worker: string;
  fundingManager: string;
  lines: InvoiceLine[];
  totalHours: number;
  totalKm: number;
  totalTravel: number;
  totalPayable: number;
  status: "draft" | "sent" | "paid" | "overdue" | "pending";
}

// Staff data
export const STAFF: StaffMember[] = [
  {
    id: 1,
    name: "Daniel Hayward",
    role: "Support Worker",
    email: "daniel@achievetogethercare.com",
    phone: "0422 492 736",
    address: "Nowra, NSW 2541",
    tfn: "123456789",
    bsb: "067-873",
    acc: "207-436-73",
    sf: "AustralianSuper",
    sn: "AS123456",
    rate: 38.08,
    hrs: 72,
    km: 150,
    tax: 520.93,
    compliance: [
      { name: "First Aid Certificate", number: "FA2024-12345", expiry: "2026-08-15", status: "valid" },
      { name: "NDIS Worker Orientation", expiry: "2027-01-10", status: "valid" },
      { name: "Police Check", number: "PC-NSW-2024-67890", expiry: "2027-03-20", status: "valid" },
      { name: "Working with Children Check", number: "WWCC-NSW-12345", expiry: "2029-06-30", status: "valid" },
      { name: "Driver's Licence", number: "NSW-DL-456789", expiry: "2028-11-15", status: "valid" },
      { name: "Car Insurance", expiry: "2026-12-01", status: "valid" },
      { name: "COVID-19 Vaccination", expiry: "N/A", status: "valid" },
    ],
  },
];

// Shifts data (sample from February 2026)
export const SHIFTS: Shift[] = [
  {
    id: 1,
    date: "2026-02-09",
    participant: "Shaun Case",
    worker: "Daniel Hayward",
    startTime: "09:00",
    endTime: "15:00",
    hours: 6,
    km: 15,
    status: "completed",
    activities: [
      "Supported Shaun with morning routine and personal care",
      "Accompanied to local shops for grocery shopping",
      "Practiced budgeting skills at supermarket",
    ],
    engagement: [
      "Shaun was in good mood and cooperative throughout shift",
      "Engaged well in conversation during shopping",
      "Demonstrated improved decision-making with purchases",
    ],
    support: [
      "Provided assistance with shower and personal grooming",
      "Supported community access and social interaction",
      "Encouraged independence in shopping choices",
    ],
    goals: [
      "Goal 1: Improve daily living skills and independence",
      "Goal 3: Increase community participation and social connections",
    ],
    notes: "Successful shift. Shaun showed great progress with budgeting.",
  },
];

// NDIS Support Items with rates (2025-26 Price Guide)
export const NDIS_SUPPORT_ITEMS = [
  {
    group: "Core Support - Daily Activities",
    items: [
      { code: "01_002_0107_1_1", name: "Assistance with Daily Life - Standard - Weekday Daytime", rate: 70.23 },
      { code: "01_003_0107_1_1", name: "Assistance with Daily Life - Standard - Weekday Evening", rate: 77.38 },
      { code: "01_004_0107_1_1", name: "Assistance with Daily Life - Standard - Saturday", rate: 98.83 },
      { code: "01_005_0107_1_1", name: "Assistance with Daily Life - Standard - Sunday", rate: 127.43 },
      { code: "01_006_0107_1_1", name: "Assistance with Daily Life - Standard - Public Holiday", rate: 156.03 },
    ],
  },
  {
    group: "Core Support - Community Access",
    items: [
      { code: "04_104_0125_6_1", name: "Group-Based Community Participation", rate: 80.06 },
      { code: "04_799_0104_1_1", name: "Community Nursing Care - Weekday", rate: 70.23 },
    ],
  },
  {
    group: "Capacity Building - Support Coordination",
    items: [
      { code: "07_001_0106_8_1", name: "Support Connection", rate: 80.06 },
      { code: "07_002_0106_8_1", name: "Coordination of Supports", rate: 100.14 },
      { code: "07_003_0106_8_1", name: "Specialist Support Coordination", rate: 190.54 },
    ],
  },
  {
    group: "Transport",
    items: [
      { code: "09_799_0106_6_3", name: "Provider Travel - Non-Labour Costs", rate: 0.95, unit: "km" },
    ],
  },
];

// Client/Participant data
export const CLIENTS = [
  {
    id: 1,
    name: "Shaun Case",
    ndisNumber: "431005774",
    phone: "0412 345 678",
    email: "shaun.case@email.com",
    address: "123 Main St, Nowra NSW 2541",
    emergencyContact: "Mary Case (Mother)",
    emergencyPhone: "0423 456 789",
    dob: "1995-03-15",
    goals: [
      "Improve daily living skills and independence",
      "Develop social connections in community",
      "Increase participation in recreational activities",
      "Build confidence in public transport use",
    ],
    planManager: "Plan Partners NSW",
    planManagerEmail: "support@planpartners.com.au",
    supportCoordinator: "Emma Wilson",
    fundingType: "Plan Managed",
    planStartDate: "2025-07-01",
    planEndDate: "2026-06-30",
    weeklyHours: 15,
    supportWorkers: ["Daniel Hayward"],
  },
];

// Reports data
export const REPORTS = [
  {
    id: 1,
    type: "daily",
    title: "Daily Shift Report - Shaun Case",
    date: "2026-02-09",
    author: "Daniel Hayward",
    status: "completed",
    participant: "Shaun Case",
    ndisNumber: "431005774",
    hours: 6,
    km: 15,
    mood: "Happy and engaged",
    shiftTime: "09:00 - 15:00",
    sections: [
      { t: "Summary", c: "6-hour community access shift. Shaun was in good spirits throughout." },
      { t: "Activities", c: "Shopping at local supermarket, budgeting practice, social interaction" },
    ],
  },
];

// Invoice data
export const INVOICES: Invoice[] = [
  {
    invoiceNo: "ATC-2026-001",
    date: "2026-02-28",
    period: "February 2026",
    client: "Shaun Case",
    ndisNumber: "431005774",
    worker: "Daniel Hayward",
    fundingManager: "Plan Partners NSW",
    lines: [
      {
        date: "2026-02-09",
        description: "Community Access Support",
        ndisCode: "01_002_0107_1_1",
        qty: 6,
        unit: "hours",
        rate: 70.23,
        total: 421.38,
      },
      {
        date: "2026-02-09",
        description: "Provider Travel",
        ndisCode: "09_799_0106_6_3",
        qty: 15,
        unit: "km",
        rate: 0.95,
        total: 14.25,
      },
    ],
    totalHours: 6,
    totalKm: 15,
    totalTravel: 14.25,
    totalPayable: 435.63,
    status: "draft",
  },
];

export default {
  C,
  OWNER,
  STAFF,
  CLIENTS,
  SHIFTS,
  REPORTS,
  INVOICES,
  NDIS_SUPPORT_ITEMS,
  dashboardStats,
};


