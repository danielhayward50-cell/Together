// ATC Platform - Staff Management Component - Enterprise Design
import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, Trash2, X, Check, AlertCircle, 
  Phone, Mail, MapPin, Loader2, Shield, Calendar, Search, Filter, Clock
} from 'lucide-react';
import { staffAPI } from '../../services/api';

export function StaffManagement() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
    if (!compliance || compliance.length === 0) return { status: 'No Docs', color: 'atc-badge-muted', priority: 3 };
    const expired = compliance.filter(c => c.status === 'expired').length;
    const expiring = compliance.filter(c => c.status === 'expiring').length;
    if (expired > 0) return { status: `${expired} Expired`, color: 'atc-badge-danger', priority: 1 };
    if (expiring > 0) return { status: `${expiring} Expiring`, color: 'atc-badge-warning', priority: 2 };
    return { status: 'Valid', color: 'atc-badge-success', priority: 4 };
  };

  // Filter and search
  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    const compliance = getComplianceStatus(member.compliance);
    if (filterStatus === 'expired') return matchesSearch && compliance.priority === 1;
    if (filterStatus === 'expiring') return matchesSearch && compliance.priority === 2;
    if (filterStatus === 'valid') return matchesSearch && compliance.priority === 4;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Bar with Search & Actions */}
      <div className="atc-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">Staff Management</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {staff.length} support worker{staff.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="atc-input pl-9"
                data-testid="staff-search"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="atc-input w-auto"
              data-testid="staff-filter"
            >
              <option value="all">All Status</option>
              <option value="valid">Valid Docs</option>
              <option value="expiring">Expiring</option>
              <option value="expired">Expired</option>
            </select>
            
            {/* Add Button */}
            <button
              onClick={openCreateModal}
              className="atc-btn-primary flex items-center gap-2 whitespace-nowrap"
              data-testid="add-staff-btn"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Carer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-slate-900">{staff.length}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total Staff</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {staff.filter(s => getComplianceStatus(s.compliance).priority === 4).length}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Valid Docs</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-amber-600">
            {staff.filter(s => getComplianceStatus(s.compliance).priority === 2).length}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Expiring</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-red-600">
            {staff.filter(s => getComplianceStatus(s.compliance).priority === 1).length}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Expired</p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="atc-card overflow-hidden p-0">
        <table className="atc-table">
          <thead>
            <tr>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Contact</th>
              <th className="text-right">Rate</th>
              <th>Compliance</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(member => {
              const compliance = getComplianceStatus(member.compliance);
              return (
                <tr 
                  key={member.staff_id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedStaff(member)}
                  data-testid={`staff-row-${member.staff_id}`}
                >
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                        {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="atc-badge atc-badge-info">{member.role}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                      <Phone size={12} />
                      <span>{member.phone}</span>
                    </div>
                  </td>
                  <td className="text-right">
                    <span className="font-semibold text-slate-900">${member.rate}</span>
                    <span className="text-slate-400 text-sm">/hr</span>
                  </td>
                  <td>
                    <span className={`atc-badge ${compliance.color}`}>
                      {compliance.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); openEditModal(member); }}
                        className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                        data-testid={`edit-staff-${member.staff_id}`}
                      >
                        <Edit2 size={14} className="text-slate-400" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(member.staff_id); }}
                        className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                        data-testid={`delete-staff-${member.staff_id}`}
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {filteredStaff.length === 0 && (
          <div className="p-12 text-center">
            <Users size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-medium text-slate-600 mb-1">No Staff Found</h3>
            <p className="text-sm text-slate-400">
              {searchQuery ? 'Try adjusting your search' : 'Add your first support worker to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateModal}
                className="atc-btn-primary mt-4"
              >
                Add Staff Member
              </button>
            )}
          </div>
        )}
      </div>

      {/* Staff Detail Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {selectedStaff.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900">{selectedStaff.name}</h2>
                    <p className="text-slate-500">{selectedStaff.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  data-testid="close-staff-detail"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Email</p>
                  <p className="font-medium text-slate-900">{selectedStaff.email}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Phone</p>
                  <p className="font-medium text-slate-900">{selectedStaff.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Hourly Rate</p>
                  <p className="font-medium text-slate-900">${selectedStaff.rate}/hr</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Address</p>
                  <p className="font-medium text-slate-900">{selectedStaff.address || 'Not set'}</p>
                </div>
              </div>

              {/* Compliance Documents */}
              <div>
                <h3 className="font-heading font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield size={18} className="text-teal-500" />
                  Compliance Documents
                </h3>
                <div className="space-y-2">
                  {selectedStaff.compliance?.map((doc, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center justify-between bg-slate-50 rounded-lg p-3"
                    >
                      <div>
                        <p className="font-medium text-slate-900">{doc.name}</p>
                        {doc.number && (
                          <p className="text-xs text-slate-400">#{doc.number}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase">Expires</p>
                        <p className={`font-semibold text-sm ${
                          doc.status === 'expired' ? 'text-red-600' :
                          doc.status === 'expiring' ? 'text-amber-600' :
                          'text-emerald-600'
                        }`}>
                          {doc.expiry === 'N/A' ? 'Never' : doc.expiry}
                        </p>
                      </div>
                    </div>
                  ))}
                  {(!selectedStaff.compliance || selectedStaff.compliance.length === 0) && (
                    <p className="text-slate-400 text-center py-4">No compliance documents on file</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <button
                  onClick={() => { setSelectedStaff(null); openEditModal(selectedStaff); }}
                  className="atc-btn-secondary flex-1"
                  data-testid="edit-staff-detail"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(selectedStaff.staff_id)}
                  className="atc-btn-danger"
                  data-testid="delete-staff-detail"
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
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-6">
                {editingStaff ? 'Edit Staff Member' : 'Add New Carer'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="atc-label">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="atc-input"
                    required
                    data-testid="staff-name-input"
                  />
                </div>

                <div>
                  <label className="atc-label">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="atc-input"
                    required
                    data-testid="staff-email-input"
                  />
                </div>

                <div>
                  <label className="atc-label">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="atc-input"
                    required
                    data-testid="staff-phone-input"
                  />
                </div>

                <div>
                  <label className="atc-label">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="atc-input"
                    data-testid="staff-address-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="atc-label">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="atc-input"
                    >
                      <option value="Support Worker">Support Worker</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Support Coordinator">Support Coordinator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="atc-label">Hourly Rate ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.rate}
                      onChange={(e) => setFormData({ ...formData, rate: parseFloat(e.target.value) })}
                      className="atc-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="atc-btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="atc-btn-primary flex-1"
                  data-testid="staff-submit-btn"
                >
                  {editingStaff ? 'Save Changes' : 'Add Carer'}
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
