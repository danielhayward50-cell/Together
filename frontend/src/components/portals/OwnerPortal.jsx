import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, DollarSign, Calendar,
  Settings, HelpCircle, LogOut, Menu, X, Bell, Search,
  TrendingUp, AlertCircle, CheckCircle, Clock, Rocket,
  ChevronRight, Filter, Plus, Mail, MessageSquare, Globe, HardDrive
} from 'lucide-react';
import { STAFF, CLIENTS, INVOICES, REPORTS, dashboardStats } from '../../lib/data';
import { getComplianceScore, getExpiredDocuments, getExpiringDocuments } from '../../lib/compliance';
import useIsMobile from '../../hooks/useIsMobile';
import ComprehensiveCalendar from '../calendar/ComprehensiveCalendar';
import QuickShiftReport from '../automation/QuickShiftReport';
import SmartOutreach from '../crm/SmartOutreach';
import StaffManagement from '../staff/StaffManagement';
import ClientManagement from '../clients/ClientManagement';
import InvoiceManagement from '../invoices/InvoiceManagement';
import ReportManagement from '../reports/ReportManagement';
import PayrollManagement from '../payroll/PayrollManagement';
import ComplianceManagement from '../compliance/ComplianceManagement';
import WebsiteIntegration from '../website/WebsiteIntegration';
import GDriveSyncComponent from '../gdrive/GDriveSyncComponent';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI, staffAPI, clientsAPI, invoicesAPI, reportsAPI } from '../../services/api';

export function OwnerPortal() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showQuickReport, setShowQuickReport] = useState(false);
  const isMobile = useIsMobile();

  // API data states
  const [stats, setStats] = useState(null);
  const [apiStaff, setApiStaff] = useState([]);
  const [apiClients, setApiClients] = useState([]);
  const [apiReports, setApiReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, staffData, clientsData, reportsData] = await Promise.all([
          dashboardAPI.getStats(),
          staffAPI.getAll(),
          clientsAPI.getAll(),
          reportsAPI.getAll({ limit: 10 })
        ]);
        setStats(statsData);
        setApiStaff(staffData);
        setApiClients(clientsData);
        setApiReports(reportsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Use API data with fallback to mock
  const totalStaff = apiStaff.length > 0 ? apiStaff.length : STAFF.length;
  const totalClients = apiClients.length > 0 ? apiClients.length : CLIENTS.length;
  const totalInvoices = stats?.invoices?.total || INVOICES.length;
  const pendingInvoices = stats?.invoices?.pending || INVOICES.filter(inv => inv.status === 'pending' || inv.status === 'draft').length;
  
  // Compliance stats - use API or fallback
  const allDocs = apiStaff.length > 0 
    ? apiStaff.flatMap(s => s.compliance || [])
    : STAFF.flatMap(s => s.compliance);
  const complianceScore = stats?.compliance?.score || getComplianceScore(allDocs);
  const expiredDocs = stats?.compliance?.expired_docs || getExpiredDocuments(allDocs);
  const expiringDocs = stats?.compliance?.expiring_docs || getExpiringDocuments(allDocs, 30);

  // Revenue from API
  const revenueAmount = stats?.revenue?.amount || dashboardStats.revenue.amount;
  const revenueChange = stats?.revenue?.change || dashboardStats.revenue.change;
  const revenuePeriod = stats?.revenue?.period || dashboardStats.revenue.period;

  // Recent reports from API or fallback
  const recentReports = apiReports.length > 0 ? apiReports : REPORTS;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'crm', label: 'Smart Outreach', icon: Rocket },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'staff', label: 'Staff', icon: Users },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: AlertCircle },
    { id: 'automation', label: 'Automation', icon: TrendingUp },
    { id: 'website', label: 'Website', icon: Globe },
    { id: 'gdrive', label: 'G-Drive Sync', icon: HardDrive },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Alert Banner - Compliance */}
      {(expiredDocs.length > 0 || expiringDocs.length > 0) && (
        <div className="atc-alert-danger" data-testid="compliance-alert">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <h3 className="font-heading font-bold text-red-900 text-sm">
                Compliance Alerts
              </h3>
              <div className="mt-1 text-sm text-red-700">
                {expiredDocs.length > 0 && (
                  <span className="mr-4">{expiredDocs.length} document(s) expired</span>
                )}
                {expiringDocs.length > 0 && (
                  <span>{expiringDocs.length} document(s) expiring within 30 days</span>
                )}
              </div>
            </div>
            <button className="ml-auto text-red-600 hover:text-red-800" onClick={() => setActiveSection('compliance')}>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* KPI Cards Grid - Control Room Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Revenue"
          subtitle={revenuePeriod}
          value={`$${revenueAmount.toLocaleString()}`}
          change={`+${revenueChange}%`}
          changeType="positive"
          icon={DollarSign}
          accentColor="bg-emerald-500"
          data-testid="kpi-revenue"
        />
        <KPICard
          title="Active Clients"
          value={totalClients.toString()}
          subtitle={`${totalStaff} workers`}
          icon={Users}
          accentColor="bg-blue-500"
          data-testid="kpi-clients"
        />
        <KPICard
          title="Compliance"
          value={`${complianceScore}%`}
          subtitle={expiredDocs.length > 0 ? `${expiredDocs.length} expired` : 'All valid'}
          changeType={complianceScore >= 90 ? 'positive' : 'warning'}
          icon={complianceScore >= 90 ? CheckCircle : AlertCircle}
          accentColor={complianceScore >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}
          data-testid="kpi-compliance"
        />
        <KPICard
          title="Pending Invoices"
          value={pendingInvoices.toString()}
          subtitle={`of ${totalInvoices} total`}
          icon={FileText}
          accentColor="bg-violet-500"
          data-testid="kpi-invoices"
        />
      </div>

      {/* Main Grid - Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 atc-card" data-testid="quick-actions-panel">
          <h3 className="font-heading font-bold text-slate-900 text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <QuickActionBtn
              label="Create Invoice"
              description="Generate NDIS invoices"
              onClick={() => setActiveSection('invoices')}
              icon={FileText}
              color="bg-blue-500"
              data-testid="quick-action-invoice"
            />
            <QuickActionBtn
              label="Process Payroll"
              description="SCHADS compliant rates"
              onClick={() => setActiveSection('payroll')}
              icon={DollarSign}
              color="bg-emerald-500"
              data-testid="quick-action-payroll"
            />
            <QuickActionBtn
              label="Quick Shift Report"
              description="AI-assisted reporting"
              onClick={() => setActiveSection('automation')}
              icon={TrendingUp}
              color="bg-violet-500"
              data-testid="quick-action-report"
            />
            <QuickActionBtn
              label="Smart Outreach"
              description="CRM & email campaigns"
              onClick={() => setActiveSection('crm')}
              icon={Mail}
              color="bg-teal-500"
              data-testid="quick-action-crm"
            />
          </div>
        </div>

        {/* Recent Reports Table */}
        <div className="lg:col-span-8 atc-card" data-testid="recent-reports-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-slate-900 text-lg">Recent Reports</h3>
            <button 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              onClick={() => setActiveSection('reports')}
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          <table className="atc-table">
            <thead>
              <tr>
                <th>Report</th>
                <th>Participant</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.slice(0, 5).map(report => (
                <tr key={report.report_id || report.id} data-testid={`report-row-${report.report_id || report.id}`}>
                  <td className="font-medium text-slate-900">{report.title}</td>
                  <td className="text-slate-600">{report.participant}</td>
                  <td className="text-slate-500">{report.date}</td>
                  <td className="text-right font-medium">{report.hours}h</td>
                  <td>
                    <span className="atc-badge atc-badge-success">{report.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Staff Summary */}
        <div className="lg:col-span-6 atc-card" data-testid="staff-overview-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-slate-900 text-lg">Staff Overview</h3>
            <button 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              onClick={() => setActiveSection('staff')}
            >
              Manage Staff <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {apiStaff.slice(0, 4).map(member => (
              <div key={member.staff_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{member.name}</p>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-teal-600">View</p>
                  <p className="text-xs text-slate-400">${member.rate}/hr</p>
                </div>
              </div>
            ))}
            {apiStaff.length === 0 && (
              <p className="text-center text-slate-400 py-4">No staff members yet</p>
            )}
          </div>
        </div>

        {/* Clients Summary */}
        <div className="lg:col-span-6 atc-card" data-testid="clients-overview-panel">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold text-slate-900 text-lg">Active Participants</h3>
            <button 
              className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              onClick={() => setActiveSection('clients')}
            >
              Manage Clients <ChevronRight size={16} />
            </button>
          </div>
          <div className="space-y-3">
            {apiClients.slice(0, 4).map(client => (
              <div key={client.client_id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {client.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 truncate">{client.name}</p>
                  <p className="text-xs text-slate-500">NDIS: {client.ndis_number}</p>
                </div>
                <div className="text-right">
                  <span className="atc-badge atc-badge-info">{client.weekly_hours || 0}h/wk</span>
                </div>
              </div>
            ))}
            {apiClients.length === 0 && (
              <p className="text-center text-slate-400 py-4">No clients yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return renderDashboard();
      case 'crm':
        return <SmartOutreach />;
      case 'calendar':
        return (
          <ComprehensiveCalendar
            onCreateReport={(shift) => {
              setSelectedShift(shift);
              setShowQuickReport(true);
            }}
            onViewShift={(shift) => {
              alert(`Viewing shift details for ${shift.participant}\n${shift.date} ${shift.startTime}-${shift.endTime}`);
            }}
          />
        );
      case 'automation':
        return showQuickReport ? (
          <QuickShiftReport
            prefilledShift={selectedShift}
            onClose={() => {
              setShowQuickReport(false);
              setSelectedShift(null);
            }}
          />
        ) : (
          <div className="space-y-6">
            <div className="atc-card p-12 text-center">
              <TrendingUp size={48} className="text-violet-500 mx-auto mb-6" />
              <h3 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                Automation Tools
              </h3>
              <p className="text-slate-500 mb-8">Select a tool to streamline your workflow</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <button
                  onClick={() => setShowQuickReport(true)}
                  className="p-6 bg-gradient-to-r from-violet-500 to-violet-600 text-white rounded-lg hover:-translate-y-1 transition-transform font-bold"
                  data-testid="automation-quick-report"
                >
                  Quick Shift Report
                </button>
                <button className="p-6 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:-translate-y-1 transition-transform font-bold">
                  Auto Invoice
                </button>
                <button className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:-translate-y-1 transition-transform font-bold">
                  Auto Payroll
                </button>
              </div>
            </div>
          </div>
        );
      case 'staff':
        return <StaffManagement />;
      case 'clients':
        return <ClientManagement />;
      case 'payroll':
        return <PayrollManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'reports':
        return <ReportManagement />;
      case 'compliance':
        return <ComplianceManagement />;
      case 'website':
        return <WebsiteIntegration />;
      case 'gdrive':
        return <GDriveSyncComponent />;
      case 'settings':
        return <PlaceholderSection title="Settings" description="System configuration" />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7FA] overflow-hidden">
      {/* Sidebar - Dark Navy */}
      <aside
        className={`${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
        } ${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 ease-out bg-[#0A1628]`}
        data-testid="sidebar"
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#14B8B6] rounded-lg flex items-center justify-center text-[#0A1628] font-bold text-sm shadow-lg">
                  ATC
                </div>
                <div>
                  <p className="text-white font-heading font-bold text-sm leading-none">
                    Achieve Together
                  </p>
                  <p className="text-[#14B8B6] text-[10px] font-semibold tracking-widest uppercase mt-0.5">
                    Owner Portal
                  </p>
                </div>
              </div>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id);
                      if (isMobile) setSidebarOpen(false);
                    }}
                    data-testid={`nav-${item.id}`}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {isActive && <div className="ml-auto w-1.5 h-1.5 bg-[#14B8B6] rounded-full"></div>}
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10 bg-black/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-lg bg-[#14B8B6] flex items-center justify-center text-[#0A1628] font-bold text-xs overflow-hidden">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'
                  )}
                </div>
                <div className="truncate text-white">
                  <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                  <p className="text-[#14B8B6] text-[10px] font-semibold uppercase">{user?.role || 'Staff'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold tracking-wide hover:bg-red-500 hover:text-white transition-all"
                data-testid="logout-btn"
              >
                LOGOUT
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Bar - Dense Professional */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0 z-40" data-testid="header">
          <div className="flex items-center gap-3">
            {(!sidebarOpen || isMobile) && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
                data-testid="menu-toggle"
              >
                <Menu size={20} className="text-slate-600" />
              </button>
            )}
            <div>
              <h2 className="font-heading text-lg font-bold text-slate-900">
                {navItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-48"
                data-testid="header-search"
              />
            </div>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-emerald-700 hidden sm:inline">Online</span>
            </div>
            
            {/* Notifications */}
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative" data-testid="notifications-btn">
              <Bell size={18} className="text-slate-600" />
              {(expiredDocs.length + expiringDocs.length) > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {renderContent()}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// KPI Card Component - Enterprise Style
function KPICard({ title, subtitle, value, change, changeType, icon: Icon, accentColor, ...props }) {
  return (
    <div className="atc-card flex items-start gap-4" {...props}>
      <div className={`w-10 h-10 ${accentColor} rounded-lg flex items-center justify-center text-white shadow-sm flex-shrink-0`}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs tracking-widest uppercase font-semibold text-slate-500">{title}</p>
        <p className="text-2xl font-heading font-bold text-slate-900 mt-0.5">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {change && (
            <span className={`text-xs font-semibold ${
              changeType === 'positive' ? 'text-emerald-600' : 
              changeType === 'warning' ? 'text-amber-600' : 'text-slate-500'
            }`}>
              {change}
            </span>
          )}
          {subtitle && <span className="text-xs text-slate-400">{subtitle}</span>}
        </div>
      </div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionBtn({ label, description, onClick, icon: Icon, color, ...props }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-all text-left group"
      {...props}
    >
      <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center text-white shadow-sm group-hover:-translate-y-0.5 transition-transform`}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <p className="font-medium text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
    </button>
  );
}

// Placeholder Section
function PlaceholderSection({ title, description }) {
  return (
    <div className="atc-card p-12 text-center">
      <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Clock size={32} className="text-slate-400" />
      </div>
      <h3 className="font-heading text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500">{description}</p>
      <p className="text-slate-400 text-sm mt-2">Coming in next integration phase</p>
    </div>
  );
}

export default OwnerPortal;
