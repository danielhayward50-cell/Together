// Mock data for ATC Master Platform

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

export const clinicalActivity = [
  { date: "2026-03-09", status: "completed", participant: "Shaun Case", time: "09:00-15:00" }
];

export const crmLeads = [
  {
    id: 1,
    name: "Sarah Williams",
    organization: "North West Coordinators",
    role: "Support Coordinator",
    service: "Support Coordination",
    email: "sarah.w@nwco.com.au",
    phone: "0412 888 999",
    status: "draft",
    priority: "high"
  },
  {
    id: 2,
    name: "Michael Chen",
    organization: "Sydney Care Partners",
    role: "Team Coordinator",
    service: "Community Access",
    email: "m.chen@sydneycare.com.au",
    phone: "0423 567 890",
    status: "draft",
    priority: "medium"
  },
  {
    id: 3,
    name: "Emma Thompson",
    organization: "Central Coast Support",
    role: "Support Coordinator",
    service: "Daily Living Support",
    email: "emma.t@ccsupp.com.au",
    phone: "0434 123 456",
    status: "draft",
    priority: "high"
  },
  {
    id: 4,
    name: "David Kumar",
    organization: "Western Sydney Hub",
    role: "Plan Manager",
    service: "Plan Management",
    email: "d.kumar@wshub.com.au",
    phone: "0445 789 012",
    status: "draft",
    priority: "low"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    organization: "North Shore Coaching",
    role: "Recovery Coach",
    service: "Recovery Coaching",
    email: "lisa@nscoach.com.au",
    phone: "0456 234 567",
    status: "draft",
    priority: "medium"
  }
];

export const emailTemplate = {
  sender: "daniel@achievetogethercare.com",
  subject: "Clinical Support Partnership Opportunity",
  getBody: (name, role) => `Hi ${name},

I'm Daniel from Achieve Together Care. I've been following the great outcomes you're achieving with NDIS ${role} in Sydney.

We currently have immediate capacity for 1:1 Community Participation and high-intensity core supports. We focus heavily on clinical safety and goal-based evidence.

I've attached our 2026 Capability Brochure below. Would love to grab a 5-minute coffee if you have participants looking for a reliable boutique provider.

Daniel Hayward · 0422 492 736`,
  attachment: {
    name: "ATC_Premium_Clinical_Brochure_v17.pdf",
    icon: "📄"
  }
};

export const userProfile = {
  name: "Daniel Hayward",
  initials: "DH",
  email: "daniel@achievetogethercare.com",
  role: "System Owner"
};
