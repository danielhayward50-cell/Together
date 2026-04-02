import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, FileText, DollarSign, Calendar,
  Settings, HelpCircle, LogOut, Menu, X, Bell, Search,
  TrendingUp, AlertCircle, CheckCircle, Clock, Rocket
} from 'lucide-react';
import { STAFF, CLIENTS, INVOICES, REPORTS, dashboardStats } from '../../lib/data';
import { getComplianceScore, getExpiredDocuments, getExpiringDocuments } from '../../lib/compliance';
import useIsMobile from '../../hooks/useIsMobile';
import ComprehensiveCalendar from '../calendar/ComprehensiveCalendar';
import QuickShiftReport from '../automation/QuickShiftReport';
import SmartOutreach from '../crm/SmartOutreach';
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
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Alert Banner */}
      {(expiredDocs.length > 0 || expiringDocs.length > 0) && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-2xl">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-red-500 flex-shrink-0" size={24} />
            <div>
              <h3 className="text-lg font-black text-red-900 uppercase tracking-tight mb-2">
                Compliance Alerts
              </h3>
              {expiredDocs.length > 0 && (
                <p className="text-sm font-bold text-red-700 mb-1">
                  {expiredDocs.length} document(s) expired
                </p>
              )}
              {expiringDocs.length > 0 && (
                <p className="text-sm font-bold text-orange-700">
                  {expiringDocs.length} document(s) expiring within 30 days
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title={`Revenue (${revenuePeriod})`}
          value={`$${revenueAmount.toLocaleString()}`}
          change={`↑ ${revenueChange}%`}
          changeColor="text-emerald-600"
          icon={DollarSign}
          iconColor="bg-emerald-500"
        />
        <StatCard
          title="Active Clients"
          value={totalClients.toString()}
          subtitle={`${totalStaff} support workers`}
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Compliance Score"
          value={`${complianceScore}%`}
          subtitle={expiredDocs.length > 0 ? `${expiredDocs.length} expired` : 'All valid'}
          icon={complianceScore >= 90 ? CheckCircle : AlertCircle}
          iconColor={complianceScore >= 90 ? 'bg-green-500' : 'bg-orange-500'}
        />
        <StatCard
          title="Pending Invoices"
          value={pendingInvoices.toString()}
          subtitle={`of ${totalInvoices} total`}
          icon={FileText}
          iconColor="bg-purple-500"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionButton
            label="Create Invoice"
            onClick={() => setActiveSection('invoices')}
            icon={FileText}
            color="bg-blue-500"
          />
          <QuickActionButton
            label="Process Payroll"
            onClick={() => setActiveSection('payroll')}
            icon={DollarSign}
            color="bg-emerald-500"
          />
          <QuickActionButton
            label="Quick Report"
            onClick={() => setActiveSection('automation')}
            icon={TrendingUp}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8">
        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">
          Recent Reports
        </h3>
        <div className="space-y-3">
          {recentReports.slice(0, 5).map(report => (
            <div
              key={report.report_id || report.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              data-testid={`report-item-${report.report_id || report.id}`}
            >
              <div>
                <p className="font-bold text-slate-900">{report.title}</p>
                <p className="text-xs text-slate-500 mt-1">
                  {report.participant} · {report.date} · {report.hours}h
                </p>
              </div>
              <span className="text-xs font-black text-emerald-600 uppercase px-3 py-1.5 bg-emerald-50 rounded-full">
                {report.status}
              </span>
            </div>
          ))}
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
            <div className="bg-white rounded-[32px] border border-slate-200 p-16 text-center">
              <TrendingUp size={48} className="text-purple-500 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">
                Automation Tools
              </h3>
              <p className="text-slate-500 text-lg mb-8">Choose a tool to get started</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <button
                  onClick={() => setShowQuickReport(true)}
                  className="p-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl hover:scale-105 transition-transform font-black uppercase"
                >
                  Quick Shift Report
                </button>
                <button className="p-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl hover:scale-105 transition-transform font-black uppercase">
                  Auto Invoice
                </button>
                <button className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl hover:scale-105 transition-transform font-black uppercase">
                  Auto Payroll
                </button>
              </div>
            </div>
          </div>
        );
      case 'staff':
        return <PlaceholderSection title="Staff Management" description="Staff profiles and compliance tracking" />;
      case 'clients':
        return <PlaceholderSection title="Client Management" description="Participant information and plans" />;
      case 'payroll':
        return <PlaceholderSection title="Payroll" description="SCHADS payroll management system" />;
      case 'invoices':
        return <PlaceholderSection title="Invoices" description="NDIS invoice creation and tracking" />;
      case 'reports':
        return <PlaceholderSection title="Reports" description="All shift and incident reports" />;
      case 'compliance':
        return <PlaceholderSection title="Compliance" description="Document tracking and alerts" />;
      case 'settings':
        return <PlaceholderSection title="Settings" description="System configuration" />;
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F7FA] overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'
        } ${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 ease-in-out`}
        style={{
          background: 'linear-gradient(135deg, #0A1628 0%, #1A2B44 100%)',
        }}
      >
        {sidebarOpen && (
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-[#0A1628] font-black text-sm shadow-xl">
                  ATC
                </div>
                <div>
                  <p className="text-white font-black text-lg tracking-tighter uppercase leading-none">
                    Achieve Together
                  </p>
                  <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                    Owner Portal
                  </p>
                </div>
              </div>
              {isMobile && (
                <button onClick={() => setSidebarOpen(false)} className="text-white/50 hover:text-white">
                  <X size={24} />
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
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
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-[#B794F4] text-[#0A1628] shadow-[0_4px_15px_rgba(183,148,244,0.4)]'
                        : 'text-white/50 hover:bg-white/5'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="tracking-tight uppercase">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Profile */}
            <div className="p-8 border-t border-white/5 bg-black/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-11 h-11 rounded-full bg-teal-500 border-2 border-teal-400 flex items-center justify-center text-[#0A1628] font-black text-xs overflow-hidden">
                  {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'U'
                  )}
                </div>
                <div className="truncate text-white">
                  <p className="text-xs font-black truncate tracking-tight">{user?.name || 'User'}</p>
                  <p className="text-teal-500 text-[9px] font-bold uppercase">{user?.role || 'Staff'}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-3.5 rounded-2xl bg-red-500/10 text-red-400 text-[10px] font-black tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase"
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
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0 z-40">
          <div className="flex items-center gap-4">
            {(!sidebarOpen || isMobile) && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Menu size={24} className="text-slate-600" />
              </button>
            )}
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">
                {navItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  System Online
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell size={20} className="text-slate-600" />
              {(expiredDocs.length + expiringDocs.length) > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Search size={20} className="text-slate-600" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
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

// Helper Components
function StatCard({ title, value, subtitle, change, changeColor, icon: Icon, iconColor }: any) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 ${iconColor} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
          <Icon size={24} />
        </div>
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-3xl font-black text-slate-900 tracking-tighter mb-2">{value}</p>
      {change && <p className={`text-xs font-bold ${changeColor} uppercase`}>{change}</p>}
      {subtitle && <p className="text-xs font-bold text-slate-500 uppercase mt-1">{subtitle}</p>}
    </div>
  );
}

function QuickActionButton({ label, onClick, icon: Icon, color }: any) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white p-6 rounded-2xl hover:scale-105 transition-transform shadow-lg flex items-center justify-center gap-3 font-black text-sm uppercase tracking-tight`}
    >
      <Icon size={20} />
      {label}
    </button>
  );
}

function PlaceholderSection({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 p-16 text-center">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Clock size={40} className="text-slate-400" />
      </div>
      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{title}</h3>
      <p className="text-slate-500 text-lg">{description}</p>
      <p className="text-slate-400 text-sm mt-4">Coming in next integration phase</p>
    </div>
  );
}

export default OwnerPortal;
