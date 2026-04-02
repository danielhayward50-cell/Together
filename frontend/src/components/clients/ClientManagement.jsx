// ATC Platform - Client Management Component - Enterprise Design
import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, Trash2, X, Phone, Mail, MapPin, 
  Loader2, Target, Heart, AlertTriangle, Calendar, FileText, Search, ChevronRight
} from 'lucide-react';
import { clientsAPI } from '../../services/api';

export function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    ndis_number: '',
    email: '',
    phone: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    plan_manager: '',
    funding_type: 'Plan Managed',
    weekly_hours: 0,
    goals: []
  });
  const [newGoal, setNewGoal] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await clientsAPI.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.client_id, formData);
      } else {
        await clientsAPI.create(formData);
      }
      fetchClients();
      closeModal();
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error saving client');
    }
  };

  const handleDelete = async (clientId) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      await clientsAPI.delete(clientId);
      fetchClients();
      setSelectedClient(null);
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error deleting client');
    }
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setFormData({
      name: '',
      ndis_number: '',
      email: '',
      phone: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      plan_manager: '',
      funding_type: 'Plan Managed',
      weekly_hours: 0,
      goals: []
    });
    setShowModal(true);
  };

  const openEditModal = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      ndis_number: client.ndis_number,
      email: client.email,
      phone: client.phone,
      address: client.address || '',
      emergency_contact: client.emergency_contact || '',
      emergency_phone: client.emergency_phone || '',
      plan_manager: client.plan_manager || '',
      funding_type: client.funding_type || 'Plan Managed',
      weekly_hours: client.weekly_hours || 0,
      goals: client.goals || []
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setNewGoal('');
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      setFormData({ ...formData, goals: [...formData.goals, newGoal.trim()] });
      setNewGoal('');
    }
  };

  const removeGoal = (index) => {
    setFormData({ 
      ...formData, 
      goals: formData.goals.filter((_, i) => i !== index) 
    });
  };

  // Filter clients
  const filteredClients = clients.filter(client => {
    return client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           client.ndis_number?.includes(searchQuery) ||
           client.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Calculate total hours
  const totalHours = clients.reduce((sum, c) => sum + (c.weekly_hours || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Card */}
      <div className="atc-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">Client Management</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {clients.length} participant{clients.length !== 1 ? 's' : ''} registered
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="atc-input pl-9"
                data-testid="client-search"
              />
            </div>
            
            {/* Add Button */}
            <button
              onClick={openCreateModal}
              className="atc-btn-primary flex items-center gap-2 whitespace-nowrap"
              data-testid="add-client-btn"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Add Client</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-slate-900">{clients.length}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total Clients</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-teal-600">{totalHours}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Weekly Hours</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-blue-600">
            {clients.filter(c => c.funding_type === 'Plan Managed').length}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Plan Managed</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-violet-600">
            {clients.filter(c => c.funding_type === 'Self Managed').length}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Self Managed</p>
        </div>
      </div>

      {/* Clients Table */}
      <div className="atc-card overflow-hidden p-0">
        <table className="atc-table">
          <thead>
            <tr>
              <th>Participant</th>
              <th>NDIS Number</th>
              <th>Contact</th>
              <th>Hours/Week</th>
              <th>Funding</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map(client => (
              <tr 
                key={client.client_id}
                className="cursor-pointer"
                onClick={() => setSelectedClient(client)}
                data-testid={`client-row-${client.client_id}`}
              >
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {client.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{client.name}</p>
                      <p className="text-xs text-slate-400">{client.email}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="font-mono text-sm text-slate-600">{client.ndis_number}</span>
                </td>
                <td>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <Phone size={12} />
                    <span>{client.phone}</span>
                  </div>
                </td>
                <td>
                  <span className="font-semibold text-slate-900">{client.weekly_hours || 0}</span>
                  <span className="text-slate-400 text-sm">h</span>
                </td>
                <td>
                  <span className={`atc-badge ${
                    client.funding_type === 'Plan Managed' ? 'atc-badge-info' :
                    client.funding_type === 'Self Managed' ? 'atc-badge-success' :
                    'atc-badge-muted'
                  }`}>
                    {client.funding_type || 'Plan Managed'}
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); openEditModal(client); }}
                      className="p-1.5 hover:bg-slate-100 rounded-md transition-colors"
                      data-testid={`edit-client-${client.client_id}`}
                    >
                      <Edit2 size={14} className="text-slate-400" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(client.client_id); }}
                      className="p-1.5 hover:bg-red-50 rounded-md transition-colors"
                      data-testid={`delete-client-${client.client_id}`}
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClients.length === 0 && (
          <div className="p-12 text-center">
            <Users size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-medium text-slate-600 mb-1">No Clients Found</h3>
            <p className="text-sm text-slate-400">
              {searchQuery ? 'Try adjusting your search' : 'Add your first participant to get started'}
            </p>
            {!searchQuery && (
              <button
                onClick={openCreateModal}
                className="atc-btn-primary mt-4"
              >
                Add Client
              </button>
            )}
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    {selectedClient.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-slate-900">{selectedClient.name}</h2>
                    <p className="text-slate-500">NDIS: {selectedClient.ndis_number}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  data-testid="close-client-detail"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              {/* Contact & Plan Details */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Email</p>
                  <p className="font-medium text-slate-900">{selectedClient.email}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Phone</p>
                  <p className="font-medium text-slate-900">{selectedClient.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Plan Manager</p>
                  <p className="font-medium text-slate-900">{selectedClient.plan_manager || 'Not set'}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="atc-label">Weekly Hours</p>
                  <p className="font-medium text-slate-900">{selectedClient.weekly_hours || 0} hours</p>
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedClient.emergency_contact && (
                <div className="atc-alert-danger mb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} className="text-red-600" />
                    <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Emergency Contact</p>
                  </div>
                  <p className="font-medium text-slate-900">{selectedClient.emergency_contact}</p>
                  <p className="text-slate-600">{selectedClient.emergency_phone}</p>
                </div>
              )}

              {/* Goals */}
              <div className="mb-6">
                <h3 className="font-heading font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <Target size={18} className="text-emerald-500" />
                  Goals ({selectedClient.goals?.length || 0})
                </h3>
                <div className="space-y-2">
                  {selectedClient.goals?.map((goal, idx) => (
                    <div key={idx} className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-start gap-3">
                      <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700">{goal}</p>
                    </div>
                  ))}
                  {(!selectedClient.goals || selectedClient.goals.length === 0) && (
                    <p className="text-slate-400 text-center py-4">No goals set</p>
                  )}
                </div>
              </div>

              {/* Likes & Triggers */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {selectedClient.likes && selectedClient.likes.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                      <Heart size={14} className="text-pink-500" />
                      Likes
                    </h4>
                    <div className="space-y-1">
                      {selectedClient.likes.map((like, idx) => (
                        <p key={idx} className="text-sm text-slate-600">• {like}</p>
                      ))}
                    </div>
                  </div>
                )}
                {selectedClient.triggers && selectedClient.triggers.length > 0 && (
                  <div>
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-sm">
                      <AlertTriangle size={14} className="text-amber-500" />
                      Triggers
                    </h4>
                    <div className="space-y-1">
                      {selectedClient.triggers.map((trigger, idx) => (
                        <p key={idx} className="text-sm text-slate-600">• {trigger}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                  onClick={() => { setSelectedClient(null); openEditModal(selectedClient); }}
                  className="atc-btn-secondary flex-1"
                  data-testid="edit-client-detail"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(selectedClient.client_id)}
                  className="atc-btn-danger"
                  data-testid="delete-client-detail"
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
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="font-heading text-xl font-bold text-slate-900 mb-6">
                {editingClient ? 'Edit Client' : 'Add New Client'}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="atc-label">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="atc-input"
                      required
                      data-testid="client-name-input"
                    />
                  </div>
                  <div>
                    <label className="atc-label">NDIS Number</label>
                    <input
                      type="text"
                      value={formData.ndis_number}
                      onChange={(e) => setFormData({ ...formData, ndis_number: e.target.value })}
                      className="atc-input"
                      required
                      data-testid="client-ndis-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="atc-label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="atc-input"
                      required
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
                    />
                  </div>
                </div>

                <div>
                  <label className="atc-label">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="atc-input"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="atc-label">Plan Manager</label>
                    <input
                      type="text"
                      value={formData.plan_manager}
                      onChange={(e) => setFormData({ ...formData, plan_manager: e.target.value })}
                      className="atc-input"
                    />
                  </div>
                  <div>
                    <label className="atc-label">Weekly Hours</label>
                    <input
                      type="number"
                      value={formData.weekly_hours}
                      onChange={(e) => setFormData({ ...formData, weekly_hours: parseInt(e.target.value) || 0 })}
                      className="atc-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="atc-label">Funding Type</label>
                  <select
                    value={formData.funding_type}
                    onChange={(e) => setFormData({ ...formData, funding_type: e.target.value })}
                    className="atc-input"
                  >
                    <option value="Plan Managed">Plan Managed</option>
                    <option value="Self Managed">Self Managed</option>
                    <option value="NDIA Managed">NDIA Managed</option>
                  </select>
                </div>

                {/* Goals */}
                <div>
                  <label className="atc-label">Goals</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a goal..."
                      className="atc-input"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                    />
                    <button
                      type="button"
                      onClick={addGoal}
                      className="atc-btn-accent"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {formData.goals.map((goal, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-md px-3 py-2">
                        <span className="text-sm text-slate-700">{goal}</span>
                        <button
                          type="button"
                          onClick={() => removeGoal(idx)}
                          className="text-red-400 hover:text-red-600"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
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
                  data-testid="client-submit-btn"
                >
                  {editingClient ? 'Save Changes' : 'Add Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientManagement;
