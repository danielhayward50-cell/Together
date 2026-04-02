// ATC Platform - Compliance Tracking Component
import React, { useState, useEffect } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, Users,
  Loader2, Plus, X, Calendar, FileText, AlertCircle
} from 'lucide-react';
import { staffAPI } from '../../services/api';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export function ComplianceManagement() {
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(null);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [staffCompliance, setStaffCompliance] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    name: '',
    number: '',
    expiry: ''
  });

  // Required documents list
  const requiredDocs = [
    { name: "NDIS Worker Screening Check", critical: true },
    { name: "Working with Children Check", critical: true },
    { name: "National Police Check", critical: true },
    { name: "First Aid Certificate", critical: true },
    { name: "CPR Certificate", critical: true },
    { name: "NDIS Worker Orientation Module", critical: true },
    { name: "Driver's Licence", critical: false },
    { name: "Car Insurance", critical: false },
    { name: "Car Registration", critical: false },
    { name: "COVID-19 Vaccination", critical: false },
    { name: "Manual Handling Training", critical: false },
    { name: "Medication Administration", critical: false },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dashboardRes, staffData] = await Promise.all([
        fetch(`${API_URL}/api/compliance/dashboard`, { credentials: 'include' }).then(r => r.json()),
        staffAPI.getAll()
      ]);
      setDashboard(dashboardRes);
      setStaff(staffData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffCompliance = async (staffId) => {
    try {
      const response = await fetch(`${API_URL}/api/compliance/staff/${staffId}`, { credentials: 'include' });
      const data = await response.json();
      setStaffCompliance(data);
    } catch (error) {
      console.error('Error fetching staff compliance:', error);
    }
  };

  const handleSelectStaff = (member) => {
    setSelectedStaff(member);
    fetchStaffCompliance(member.staff_id);
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!selectedStaff) return;

    try {
      await fetch(`${API_URL}/api/compliance/staff/${selectedStaff.staff_id}/document`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(newDoc)
      });
      
      fetchStaffCompliance(selectedStaff.staff_id);
      fetchData();
      setShowAddModal(false);
      setNewDoc({ name: '', number: '', expiry: '' });
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Error adding document');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-600';
      case 'expiring_soon': return 'bg-orange-100 text-orange-600';
      case 'expiring': return 'bg-yellow-100 text-yellow-600';
      default: return 'bg-emerald-100 text-emerald-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'expired': return <AlertTriangle size={14} />;
      case 'expiring_soon': return <Clock size={14} />;
      case 'expiring': return <AlertCircle size={14} />;
      default: return <CheckCircle size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Compliance Tracking
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            NDIS Worker Requirements • {staff.length} Staff Members
          </p>
        </div>
      </div>

      {/* Compliance Score Dashboard */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Score Card */}
          <div className="lg:col-span-1 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[32px] p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Shield size={32} />
              <span className="text-xs font-black uppercase bg-white/20 px-3 py-1 rounded-full">
                Score
              </span>
            </div>
            <p className="text-5xl font-black">{dashboard.compliance_score}%</p>
            <p className="text-sm opacity-80 mt-2">Overall Compliance</p>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={18} className="text-emerald-500" />
              <span className="text-xs font-black text-slate-400 uppercase">Valid</span>
            </div>
            <p className="text-3xl font-black text-emerald-600">{dashboard.summary.valid}</p>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={18} className="text-red-500" />
              <span className="text-xs font-black text-slate-400 uppercase">Expired</span>
            </div>
            <p className="text-3xl font-black text-red-600">{dashboard.summary.expired}</p>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={18} className="text-orange-500" />
              <span className="text-xs font-black text-slate-400 uppercase">Expiring Soon</span>
            </div>
            <p className="text-3xl font-black text-orange-600">{dashboard.summary.expiring_30_days}</p>
          </div>

          <div className="bg-white rounded-[24px] border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-purple-500" />
              <span className="text-xs font-black text-slate-400 uppercase">Missing</span>
            </div>
            <p className="text-3xl font-black text-purple-600">{dashboard.summary.missing_critical}</p>
          </div>
        </div>
      )}

      {/* Alerts Section */}
      {dashboard && (dashboard.alerts.expired.length > 0 || dashboard.alerts.expiring_soon.length > 0) && (
        <div className="bg-red-50 rounded-[32px] border border-red-200 p-6">
          <h3 className="text-lg font-black text-red-800 uppercase mb-4 flex items-center gap-2">
            <AlertTriangle size={20} />
            Urgent Compliance Alerts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expired */}
            {dashboard.alerts.expired.map((alert, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-red-800">{alert.document_name}</p>
                    <p className="text-sm text-red-600">{alert.staff_name}</p>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black uppercase">
                    Expired
                  </span>
                </div>
                <p className="text-xs text-red-500 mt-2">Expired: {alert.expiry_date}</p>
              </div>
            ))}
            {/* Expiring Soon */}
            {dashboard.alerts.expiring_soon.map((alert, idx) => (
              <div key={idx} className="bg-white rounded-xl p-4 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-orange-800">{alert.document_name}</p>
                    <p className="text-sm text-orange-600">{alert.staff_name}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase">
                    {alert.days_until_expiry} days
                  </span>
                </div>
                <p className="text-xs text-orange-500 mt-2">Expires: {alert.expiry_date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Compliance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff List */}
        <div className="bg-white rounded-[32px] border border-slate-200 p-6">
          <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
            <Users size={20} />
            Staff Members
          </h3>
          <div className="space-y-3">
            {staff.map(member => {
              const complianceCount = member.compliance?.length || 0;
              const expiredCount = member.compliance?.filter(d => d.status === 'expired').length || 0;
              
              return (
                <div
                  key={member.staff_id}
                  onClick={() => handleSelectStaff(member)}
                  className={`p-4 rounded-xl cursor-pointer transition-all ${
                    selectedStaff?.staff_id === member.staff_id
                      ? 'bg-teal-50 border-2 border-teal-500'
                      : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
                  }`}
                  data-testid={`compliance-staff-${member.staff_id}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-400">{complianceCount} documents</p>
                      </div>
                    </div>
                    {expiredCount > 0 ? (
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                    ) : (
                      <CheckCircle size={18} className="text-emerald-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Compliance Detail */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-6">
          {selectedStaff && staffCompliance ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 uppercase">
                    {selectedStaff.name}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    Compliance Score: <span className="font-bold text-teal-600">{staffCompliance.compliance_score}%</span>
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2"
                  data-testid="add-document-btn"
                >
                  <Plus size={16} />
                  Add Document
                </button>
              </div>

              {/* Documents List */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-black text-slate-400 uppercase">Documents ({staffCompliance.documents.length})</h4>
                {staffCompliance.documents.map((doc, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      <div>
                        <p className="font-bold text-slate-900">{doc.name}</p>
                        {doc.number && <p className="text-xs text-slate-400">#{doc.number}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Expires</p>
                        <p className="font-bold text-slate-900">{doc.expiry}</p>
                      </div>
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        {doc.status === 'valid' ? 'Valid' : doc.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Missing Documents */}
              {staffCompliance.missing.length > 0 && (
                <div>
                  <h4 className="text-xs font-black text-red-500 uppercase mb-3">
                    Missing Documents ({staffCompliance.missing.length})
                  </h4>
                  <div className="space-y-2">
                    {staffCompliance.missing.map((doc, idx) => (
                      <div 
                        key={idx}
                        className="flex items-center justify-between bg-red-50 rounded-xl p-3 border border-red-200"
                      >
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-red-500" />
                          <span className="font-bold text-red-800">{doc.name}</span>
                        </div>
                        {doc.critical && (
                          <span className="px-2 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase">
                            Required
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <Shield size={48} className="text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-600 mb-2">Select a Staff Member</h3>
                <p className="text-slate-400">Click on a staff member to view their compliance documents</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-md w-full shadow-2xl">
            <form onSubmit={handleAddDocument} className="p-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                Add Compliance Document
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Document Type</label>
                  <select
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                    required
                  >
                    <option value="">Select document...</option>
                    {requiredDocs.map(doc => (
                      <option key={doc.name} value={doc.name}>
                        {doc.name} {doc.critical ? '(Required)' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Document Number</label>
                  <input
                    type="text"
                    value={newDoc.number}
                    onChange={(e) => setNewDoc({ ...newDoc, number: e.target.value })}
                    placeholder="e.g., WWCC-NSW-12345"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Expiry Date</label>
                  <input
                    type="date"
                    value={newDoc.expiry}
                    onChange={(e) => setNewDoc({ ...newDoc, expiry: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-2xl font-bold transition-colors"
                >
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ComplianceManagement;
