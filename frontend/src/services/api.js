// ATC Platform - API Service
import axios from 'axios';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with credentials
const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to format API error detail
export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  register: async (email, password, name, role = 'staff') => {
    const response = await api.post('/auth/register', { email, password, name, role });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  
  refresh: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
  
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token, newPassword) => {
    const response = await api.post('/auth/reset-password', { token, new_password: newPassword });
    return response.data;
  },
  
  googleSession: async (sessionId) => {
    const response = await api.post('/auth/google/session', { session_id: sessionId });
    return response.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  
  getKPIs: async () => {
    const response = await api.get('/dashboard/kpis');
    return response.data;
  },
  
  getRecentReports: async (limit = 5) => {
    const response = await api.get(`/dashboard/recent-reports?limit=${limit}`);
    return response.data;
  },
  
  getUpcomingShifts: async (limit = 10) => {
    const response = await api.get(`/dashboard/upcoming-shifts?limit=${limit}`);
    return response.data;
  },
  
  getMonthlySummary: async () => {
    const response = await api.get('/dashboard/monthly-summary');
    return response.data;
  },
  
  getCalendarData: async (year, month) => {
    const response = await api.get(`/dashboard/calendar/${year}/${month}`);
    return response.data;
  },
};

// Staff API
export const staffAPI = {
  getAll: async () => {
    const response = await api.get('/staff');
    return response.data;
  },
  
  getById: async (staffId) => {
    const response = await api.get(`/staff/${staffId}`);
    return response.data;
  },
  
  create: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response.data;
  },
  
  update: async (staffId, staffData) => {
    const response = await api.put(`/staff/${staffId}`, staffData);
    return response.data;
  },
  
  delete: async (staffId) => {
    const response = await api.delete(`/staff/${staffId}`);
    return response.data;
  },
  
  getCompliance: async (staffId) => {
    const response = await api.get(`/staff/${staffId}/compliance`);
    return response.data;
  },
  
  addCompliance: async (staffId, docData) => {
    const response = await api.post(`/staff/${staffId}/compliance`, docData);
    return response.data;
  },
};

// Clients API
export const clientsAPI = {
  getAll: async () => {
    const response = await api.get('/clients');
    return response.data;
  },
  
  getById: async (clientId) => {
    const response = await api.get(`/clients/${clientId}`);
    return response.data;
  },
  
  create: async (clientData) => {
    const response = await api.post('/clients', clientData);
    return response.data;
  },
  
  update: async (clientId, clientData) => {
    const response = await api.put(`/clients/${clientId}`, clientData);
    return response.data;
  },
  
  delete: async (clientId) => {
    const response = await api.delete(`/clients/${clientId}`);
    return response.data;
  },
  
  getShifts: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/shifts`);
    return response.data;
  },
  
  getInvoices: async (clientId) => {
    const response = await api.get(`/clients/${clientId}/invoices`);
    return response.data;
  },
};

// Shifts API
export const shiftsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.dateFrom) params.append('date_from', filters.dateFrom);
    if (filters.dateTo) params.append('date_to', filters.dateTo);
    if (filters.staffId) params.append('staff_id', filters.staffId);
    if (filters.clientId) params.append('client_id', filters.clientId);
    
    const response = await api.get(`/shifts?${params.toString()}`);
    return response.data;
  },
  
  getById: async (shiftId) => {
    const response = await api.get(`/shifts/${shiftId}`);
    return response.data;
  },
  
  create: async (shiftData) => {
    const response = await api.post('/shifts', shiftData);
    return response.data;
  },
  
  update: async (shiftId, shiftData) => {
    const response = await api.put(`/shifts/${shiftId}`, shiftData);
    return response.data;
  },
  
  delete: async (shiftId) => {
    const response = await api.delete(`/shifts/${shiftId}`);
    return response.data;
  },
  
  complete: async (shiftId, completionData) => {
    const response = await api.post(`/shifts/${shiftId}/complete`, completionData);
    return response.data;
  },
  
  getForMonth: async (year, month) => {
    const response = await api.get(`/shifts/calendar/month/${year}/${month}`);
    return response.data;
  },
};

// Invoices API
export const invoicesAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.clientId) params.append('client_id', filters.clientId);
    
    const response = await api.get(`/invoices?${params.toString()}`);
    return response.data;
  },
  
  getById: async (invoiceId) => {
    const response = await api.get(`/invoices/${invoiceId}`);
    return response.data;
  },
  
  create: async (invoiceData) => {
    const response = await api.post('/invoices', invoiceData);
    return response.data;
  },
  
  update: async (invoiceId, invoiceData) => {
    const response = await api.put(`/invoices/${invoiceId}`, invoiceData);
    return response.data;
  },
  
  delete: async (invoiceId) => {
    const response = await api.delete(`/invoices/${invoiceId}`);
    return response.data;
  },
  
  send: async (invoiceId) => {
    const response = await api.post(`/invoices/${invoiceId}/send`);
    return response.data;
  },
  
  markPaid: async (invoiceId) => {
    const response = await api.post(`/invoices/${invoiceId}/paid`);
    return response.data;
  },
  
  generateFromShifts: async (clientId, period) => {
    const response = await api.post('/invoices/generate-from-shifts', { client_id: clientId, period });
    return response.data;
  },
};

// Reports API
export const reportsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.clientId) params.append('client_id', filters.clientId);
    if (filters.limit) params.append('limit', filters.limit);
    
    const response = await api.get(`/reports?${params.toString()}`);
    return response.data;
  },
  
  getById: async (reportId) => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },
  
  create: async (reportData) => {
    const response = await api.post('/reports', reportData);
    return response.data;
  },
  
  update: async (reportId, reportData) => {
    const response = await api.put(`/reports/${reportId}`, reportData);
    return response.data;
  },
  
  delete: async (reportId) => {
    const response = await api.delete(`/reports/${reportId}`);
    return response.data;
  },
  
  createFromShift: async (shiftId, reportData) => {
    const response = await api.post(`/reports/from-shift/${shiftId}`, reportData);
    return response.data;
  },
};

// Leads/CRM API
export const leadsAPI = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    
    const response = await api.get(`/leads?${params.toString()}`);
    return response.data;
  },
  
  getById: async (leadId) => {
    const response = await api.get(`/leads/${leadId}`);
    return response.data;
  },
  
  create: async (leadData) => {
    const response = await api.post('/leads', leadData);
    return response.data;
  },
  
  update: async (leadId, leadData) => {
    const response = await api.put(`/leads/${leadId}`, leadData);
    return response.data;
  },
  
  delete: async (leadId) => {
    const response = await api.delete(`/leads/${leadId}`);
    return response.data;
  },
  
  markContacted: async (leadId, contactData = null) => {
    const response = await api.post(`/leads/${leadId}/contact`, contactData || {});
    return response.data;
  },
  
  convertToClient: async (leadId, clientData) => {
    const response = await api.post(`/leads/${leadId}/convert`, clientData);
    return response.data;
  },
  
  batchSend: async (leadIds = null) => {
    const response = await api.post('/leads/batch-send', leadIds ? { lead_ids: leadIds } : {});
    return response.data;
  },
};

export default api;
