// ATC Platform - Staff Management Component
import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, Trash2, X, Check, AlertCircle, 
  Phone, Mail, MapPin, Loader2, Shield, Calendar
} from 'lucide-react';
import { staffAPI } from '../../services/api';

export function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    role: 'Support Worker',
    rate: 38.08
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const data = await staffAPI.getAll();
      setStaff(data);
    } catch (error) {
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStaff) {
        await staffAPI.update(editingStaff.staff_id, formData);
      } else {
        await staffAPI.create(formData);
      }
      fetchStaff();
      closeModal();
    } catch (error) {
      console.error('Error saving staff:', error);
      alert('Error saving staff member');
    }
  };

  const handleDelete = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) return;
    try {
      await staffAPI.delete(staffId);
      fetchStaff();
      setSelectedStaff(null);
    } catch (error) {
      console.error('Error deleting staff:', error);
      alert('Error deleting staff member');
    }
  };

  const openCreateModal = () => {
    setEditingStaff(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      role: 'Support Worker',
      rate: 38.08
    });
    setShowModal(true);
  };

  const openEditModal = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      name: staffMember.name,
      email: staffMember.email,
      phone: staffMember.phone,
      address: staffMember.address || '',
      role: staffMember.role,
      rate: staffMember.rate
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingStaff(null);
  };

  const getComplianceStatus = (compliance) => {
    if (!compliance || compliance.length === 0) return { status: 'none', color: 'bg-slate-100 text-slate-500' };
    const expired = compliance.filter(c => c.status === 'expired').length;
    const expiring = compliance.filter(c => c.status === 'expiring').length;
    if (expired > 0) return { status: `${expired} expired`, color: 'bg-red-100 text-red-600' };
    if (expiring > 0) return { status: `${expiring} expiring`, color: 'bg-orange-100 text-orange-600' };
    return { status: 'All valid', color: 'bg-emerald-100 text-emerald-600' };
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
            Staff Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {staff.length} support worker{staff.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-teal-500/30 transition-all"
          data-testid="add-staff-btn"
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(member => {
          const compliance = getComplianceStatus(member.compliance);
          return (
            <div
              key={member.staff_id}
              className="bg-white rounded-[32px] border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => setSelectedStaff(member)}
              data-testid={`staff-card-${member.staff_id}`}
            >
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-900 truncate">{member.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wide">{member.role}</p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEditModal(member); }}
                    className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <Edit2 size={16} className="text-slate-400" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(member.staff_id); }}
                    className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={14} />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Phone size={14} />
                  <span>{member.phone}</span>
                </div>
                {member.address && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={14} />
                    <span className="truncate">{member.address}</span>
                  </div>
                )}
              </div>

              {/* Rate & Compliance */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400 uppercase">Rate</p>
                  <p className="font-black text-slate-900">${member.rate}/hr</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${compliance.color}`}>
                  {compliance.status}
                </span>
              </div>
            </div>
          );
        })}

        {/* Empty State */}
        {staff.length === 0 && (
          <div className="col-span-full bg-slate-50 rounded-[32px] p-16 text-center">
            <Users size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No Staff Members</h3>
            <p className="text-slate-400 mb-6">Add your first support worker to get started</p>
            <button
              onClick={openCreateModal}
              className="bg-teal-500 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Add Staff Member
            </button>
          </div>
        )}
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                    {selectedStaff.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedStaff.name}</h2>
                    <p className="text-slate-500">{selectedStaff.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Email</p>
                  <p className="font-bold text-slate-900">{selectedStaff.email}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Phone</p>
                  <p className="font-bold text-slate-900">{selectedStaff.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Hourly Rate</p>
                  <p className="font-bold text-slate-900">${selectedStaff.rate}/hr</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Address</p>
                  <p className="font-bold text-slate-900">{selectedStaff.address || 'Not set'}</p>
                </div>
              </div>

              {/* Compliance Documents */}
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
                  <Shield size={20} />
                  Compliance Documents
                </h3>
                <div className="space-y-3">
                  {selectedStaff.compliance?.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
                    >
                      <div>
                        <p className="font-bold text-slate-900">{doc.name}</p>
                        {doc.number && (
                          <p className="text-xs text-slate-400">#{doc.number}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400">Expires</p>
                        <p className={`font-bold ${
                          doc.status === 'expired' ? 'text-red-600' :
                          doc.status === 'expiring' ? 'text-orange-600' :
                          'text-emerald-600'
                        }`}>
                          {doc.expiry === 'N/A' ? 'Never' : doc.expiry}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!selectedStaff.compliance || selectedStaff.compliance.length === 0) && (
                    <p className="text-slate-400 text-center py-4">No compliance documents</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => { setSelectedStaff(null); openEditModal(selectedStaff); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(selectedStaff.staff_id)}
                  className="px-6 bg-red-50 hover:bg-red-100 text-red-600 py-3 rounded-2xl font-bold transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-lg w-full shadow-2xl">
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                {editingStaff ? 'Edit Staff' : 'Add Staff Member'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                    data-testid="staff-name-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                    data-testid="staff-email-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    required
                    data-testid="staff-phone-input"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    data-testid="staff-address-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                    >
                      <option value="Support Worker">Support Worker</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Support Coordinator">Support Coordinator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Hourly Rate</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-2xl font-bold transition-colors"
                  data-testid="staff-submit-btn"
                >
                  {editingStaff ? 'Save Changes' : 'Add Staff'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagement;
