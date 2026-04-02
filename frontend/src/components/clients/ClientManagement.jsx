// ATC Platform - Client Management Component
import React, { useState, useEffect } from 'react';
import { 
  Users, Plus, Edit2, Trash2, X, Phone, Mail, MapPin, 
  Loader2, Target, Heart, AlertTriangle, Calendar, FileText
} from 'lucide-react';
import { clientsAPI } from '../../services/api';

export function ClientManagement() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
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
            Client Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {clients.length} participant{clients.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-blue-500/30 transition-all"
          data-testid="add-client-btn"
        >
          <Plus size={18} />
          Add Client
        </button>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clients.map(client => (
          <div
            key={client.client_id}
            className="bg-white rounded-[32px] border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setSelectedClient(client)}
            data-testid={`client-card-${client.client_id}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg">
                  {client.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <h3 className="font-black text-slate-900">{client.name}</h3>
                  <p className="text-xs text-slate-400">NDIS: {client.ndis_number}</p>
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openEditModal(client); }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Edit2 size={16} className="text-slate-400" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(client.client_id); }}
                  className="p-2 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Mail size={14} />
                <span className="truncate">{client.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Phone size={14} />
                <span>{client.phone}</span>
              </div>
            </div>

            {/* Plan Info */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-sm text-slate-500">{client.weekly_hours || 0}h/week</span>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase">
                {client.funding_type || 'Plan Managed'}
              </span>
            </div>

            {/* Goals Preview */}
            {client.goals && client.goals.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase mb-2">{client.goals.length} Goal{client.goals.length !== 1 ? 's' : ''}</p>
                <p className="text-sm text-slate-600 truncate">{client.goals[0]}</p>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {clients.length === 0 && (
          <div className="col-span-full bg-slate-50 rounded-[32px] p-16 text-center">
            <Users size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No Clients</h3>
            <p className="text-slate-400 mb-6">Add your first participant to get started</p>
            <button
              onClick={openCreateModal}
              className="bg-blue-500 text-white px-6 py-3 rounded-2xl font-bold"
            >
              Add Client
            </button>
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">
                    {selectedClient.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{selectedClient.name}</h2>
                    <p className="text-slate-500">NDIS: {selectedClient.ndis_number}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {/* Contact & Plan Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Email</p>
                  <p className="font-bold text-slate-900">{selectedClient.email}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Phone</p>
                  <p className="font-bold text-slate-900">{selectedClient.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Plan Manager</p>
                  <p className="font-bold text-slate-900">{selectedClient.plan_manager || 'Not set'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Weekly Hours</p>
                  <p className="font-bold text-slate-900">{selectedClient.weekly_hours || 0} hours</p>
                </div>
              </div>

              {/* Emergency Contact */}
              {selectedClient.emergency_contact && (
                <div className="bg-red-50 rounded-2xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-red-500" />
                    <p className="text-xs font-bold text-red-600 uppercase">Emergency Contact</p>
                  </div>
                  <p className="font-bold text-slate-900">{selectedClient.emergency_contact}</p>
                  <p className="text-slate-600">{selectedClient.emergency_phone}</p>
                </div>
              )}

              {/* Goals */}
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
                  <Target size={20} />
                  Goals ({selectedClient.goals?.length || 0})
                </h3>
                <div className="space-y-2">
                  {selectedClient.goals?.map((goal, idx) => (
                    <div key={idx} className="bg-emerald-50 rounded-xl p-4 flex items-start gap-3">
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
                    <h4 className="text-sm font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
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
                    <h4 className="text-sm font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
                      <AlertTriangle size={14} className="text-orange-500" />
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
              <div className="flex gap-4">
                <button
                  onClick={() => { setSelectedClient(null); openEditModal(selectedClient); }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={() => handleDelete(selectedClient.client_id)}
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
          <div className="bg-white rounded-[40px] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSubmit} className="p-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                {editingClient ? 'Edit Client' : 'Add Client'}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                      data-testid="client-name-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">NDIS Number</label>
                    <input
                      type="text"
                      value={formData.ndis_number}
                      onChange={(e) => setFormData({ ...formData, ndis_number: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                      data-testid="client-ndis-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Plan Manager</label>
                    <input
                      type="text"
                      value={formData.plan_manager}
                      onChange={(e) => setFormData({ ...formData, plan_manager: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Weekly Hours</label>
                    <input
                      type="number"
                      value={formData.weekly_hours}
                      onChange={(e) => setFormData({ ...formData, weekly_hours: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                {/* Goals */}
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Goals</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a goal..."
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                    />
                    <button
                      type="button"
                      onClick={addGoal}
                      className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold"
                    >
                      Add
                    </button>
                  </div>
                  <div className="space-y-1">
                    {formData.goals.map((goal, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2">
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
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold transition-colors"
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
