// NDIS PDF Form Filler - Auto-fill common NDIS forms
import React, { useState, useEffect } from 'react';
import {
  FileText, Download, Edit2, User, Calendar, MapPin,
  Phone, Mail, Shield, Target, Clock, CheckCircle,
  AlertCircle, Loader2, Eye, Save, Plus, ChevronRight,
  FileSignature, ClipboardList, Heart, Briefcase
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// NDIS Form Templates
const formTemplates = [
  {
    id: 'service_agreement',
    name: 'Service Agreement',
    description: 'NDIS participant service agreement document',
    icon: FileSignature,
    color: 'from-blue-500 to-indigo-500',
    fields: ['participant', 'provider', 'services', 'pricing', 'dates']
  },
  {
    id: 'progress_notes',
    name: 'Progress Notes',
    description: 'Daily/weekly progress documentation',
    icon: ClipboardList,
    color: 'from-emerald-500 to-teal-500',
    fields: ['participant', 'date', 'goals', 'activities', 'outcomes']
  },
  {
    id: 'incident_report',
    name: 'Incident Report',
    description: 'Document incidents and responses',
    icon: AlertCircle,
    color: 'from-amber-500 to-orange-500',
    fields: ['participant', 'date', 'incident', 'response', 'followup']
  },
  {
    id: 'support_plan',
    name: 'Support Plan',
    description: 'Individual support plan template',
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    fields: ['participant', 'goals', 'strategies', 'supports', 'review']
  },
  {
    id: 'risk_assessment',
    name: 'Risk Assessment',
    description: 'Participant risk assessment form',
    icon: Shield,
    color: 'from-red-500 to-rose-500',
    fields: ['participant', 'risks', 'controls', 'rating', 'actions']
  },
  {
    id: 'shift_report',
    name: 'Shift Report',
    description: 'End of shift support worker report',
    icon: Clock,
    color: 'from-cyan-500 to-blue-500',
    fields: ['worker', 'participant', 'date', 'activities', 'notes']
  }
];

export function NDISFormFiller({ clients = [], staff = [] }) {
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [generating, setGenerating] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // Pre-fill form when client is selected
  const handleClientSelect = (clientId) => {
    const client = clients.find(c => c.client_id === clientId || c.id === clientId);
    if (client) {
      setSelectedClient(client);
      setFormData(prev => ({
        ...prev,
        participant_name: client.name,
        participant_ndis: client.ndis_number,
        participant_phone: client.phone,
        participant_email: client.email,
        participant_address: client.address,
        emergency_contact: client.emergency_contact,
        emergency_phone: client.emergency_phone,
        plan_manager: client.plan_manager,
        funding_type: client.funding_type,
        goals: client.goals?.join('\n') || ''
      }));
    }
  };

  // Pre-fill worker info
  const handleWorkerSelect = (workerId) => {
    const worker = staff.find(s => s.staff_id === workerId || s.id === workerId);
    if (worker) {
      setSelectedWorker(worker);
      setFormData(prev => ({
        ...prev,
        worker_name: worker.name,
        worker_position: worker.position,
        worker_phone: worker.phone,
        worker_email: worker.email
      }));
    }
  };

  // Generate PDF
  const generatePDF = async () => {
    setGenerating(true);
    
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(13, 42, 67);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('Achieve Together Care', 20, 25);
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(selectedForm?.name || 'NDIS Form', 20, 35);
      
      // Form content
      let yPos = 60;
      doc.setTextColor(0, 0, 0);
      
      // Participant Details Section
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PARTICIPANT DETAILS', 20, yPos + 2);
      yPos += 15;
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      const addField = (label, value) => {
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value || 'N/A', 70, yPos);
        yPos += 8;
      };
      
      addField('Name', formData.participant_name);
      addField('NDIS Number', formData.participant_ndis);
      addField('Phone', formData.participant_phone);
      addField('Email', formData.participant_email);
      addField('Address', formData.participant_address);
      addField('Plan Manager', formData.plan_manager);
      addField('Funding Type', formData.funding_type);
      
      yPos += 10;
      
      // Emergency Contact Section
      doc.setFillColor(240, 240, 240);
      doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EMERGENCY CONTACT', 20, yPos + 2);
      yPos += 15;
      
      doc.setFontSize(10);
      addField('Contact Name', formData.emergency_contact);
      addField('Contact Phone', formData.emergency_phone);
      
      yPos += 10;
      
      // Form-specific content
      if (selectedForm?.id === 'service_agreement') {
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('SERVICE DETAILS', 20, yPos + 2);
        yPos += 15;
        
        doc.setFontSize(10);
        addField('Service Start', formData.service_start || new Date().toLocaleDateString());
        addField('Service End', formData.service_end || '');
        addField('Services', formData.services || 'As per NDIS plan');
        addField('Hourly Rate', formData.hourly_rate || 'SCHADS Award rates');
      }
      
      if (selectedForm?.id === 'progress_notes' || selectedForm?.id === 'shift_report') {
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('SUPPORT WORKER', 20, yPos + 2);
        yPos += 15;
        
        doc.setFontSize(10);
        addField('Worker Name', formData.worker_name);
        addField('Position', formData.worker_position);
        addField('Date', formData.shift_date || new Date().toLocaleDateString());
        addField('Time', formData.shift_time || '');
        
        yPos += 10;
        
        doc.setFillColor(240, 240, 240);
        doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('ACTIVITIES & NOTES', 20, yPos + 2);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const notes = formData.notes || 'Support provided as per care plan.';
        const splitNotes = doc.splitTextToSize(notes, pageWidth - 40);
        doc.text(splitNotes, 20, yPos);
      }
      
      if (selectedForm?.id === 'incident_report') {
        doc.setFillColor(255, 240, 240);
        doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(200, 0, 0);
        doc.text('INCIDENT DETAILS', 20, yPos + 2);
        yPos += 15;
        doc.setTextColor(0, 0, 0);
        
        doc.setFontSize(10);
        addField('Date/Time', formData.incident_datetime || '');
        addField('Location', formData.incident_location || '');
        addField('Type', formData.incident_type || '');
        
        yPos += 5;
        doc.setFont('helvetica', 'bold');
        doc.text('Description:', 20, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        const desc = formData.incident_description || '';
        const splitDesc = doc.splitTextToSize(desc, pageWidth - 40);
        doc.text(splitDesc, 20, yPos);
      }
      
      // Goals section
      if (formData.goals) {
        yPos = Math.min(yPos + 20, 200);
        doc.setFillColor(240, 248, 240);
        doc.rect(15, yPos - 5, pageWidth - 30, 10, 'F');
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('PARTICIPANT GOALS', 20, yPos + 2);
        yPos += 15;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const goals = formData.goals.split('\n');
        goals.forEach((goal, i) => {
          if (goal.trim() && yPos < 270) {
            doc.text(`${i + 1}. ${goal}`, 25, yPos);
            yPos += 7;
          }
        });
      }
      
      // Signature section
      yPos = Math.max(yPos + 20, 240);
      doc.setDrawColor(200, 200, 200);
      doc.line(20, yPos, 90, yPos);
      doc.line(110, yPos, 180, yPos);
      
      doc.setFontSize(8);
      doc.text('Participant/Representative Signature', 20, yPos + 5);
      doc.text('Support Worker Signature', 110, yPos + 5);
      
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPos + 12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 110, yPos + 12);
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('Achieve Together Care | NDIS Registered Provider | ABN: XX XXX XXX XXX', pageWidth / 2, 285, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 290, { align: 'center' });
      
      // Save
      const fileName = `ATC_${selectedForm?.name.replace(/\s+/g, '_')}_${formData.participant_name?.replace(/\s+/g, '_') || 'Form'}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6" data-testid="ndis-form-filler">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">NDIS Form Filler</h2>
          <p className="text-slate-400 text-sm mt-1">Auto-fill and generate professional NDIS documents</p>
        </div>
      </div>

      {!selectedForm ? (
        /* Form Selection Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {formTemplates.map((form) => (
            <button
              key={form.id}
              onClick={() => setSelectedForm(form)}
              className="atc-card p-6 text-left hover:border-teal-500/30 transition-all group"
              data-testid={`form-${form.id}`}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${form.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <form.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-black text-white mb-2">{form.name}</h3>
              <p className="text-sm text-slate-400">{form.description}</p>
              <div className="flex items-center gap-2 mt-4 text-teal-400 text-sm font-bold">
                Select Form <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Form Editor */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back button */}
            <button
              onClick={() => { setSelectedForm(null); setFormData({}); setSelectedClient(null); }}
              className="text-slate-400 hover:text-white text-sm font-bold flex items-center gap-2"
            >
              ← Back to Form Selection
            </button>

            {/* Selected Form Header */}
            <div className="atc-card p-6">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${selectedForm.color} rounded-2xl flex items-center justify-center`}>
                  <selectedForm.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{selectedForm.name}</h3>
                  <p className="text-slate-400">{selectedForm.description}</p>
                </div>
              </div>
            </div>

            {/* Quick Select */}
            <div className="atc-card p-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Quick Auto-Fill</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Participant</label>
                  <select
                    onChange={(e) => handleClientSelect(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    data-testid="select-client"
                  >
                    <option value="" className="bg-slate-800">Choose a participant...</option>
                    {clients.map((client) => (
                      <option key={client.client_id || client.id} value={client.client_id || client.id} className="bg-slate-800">
                        {client.name} - {client.ndis_number}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Support Worker</label>
                  <select
                    onChange={(e) => handleWorkerSelect(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    data-testid="select-worker"
                  >
                    <option value="" className="bg-slate-800">Choose a worker...</option>
                    {staff.map((worker) => (
                      <option key={worker.staff_id || worker.id} value={worker.staff_id || worker.id} className="bg-slate-800">
                        {worker.name} - {worker.position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Participant Details */}
            <div className="atc-card p-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <User className="w-4 h-4" /> Participant Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    value={formData.participant_name || ''}
                    onChange={(e) => setFormData({...formData, participant_name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    placeholder="Participant name"
                    data-testid="input-name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">NDIS Number *</label>
                  <input
                    type="text"
                    value={formData.participant_ndis || ''}
                    onChange={(e) => setFormData({...formData, participant_ndis: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    placeholder="NDIS number"
                    data-testid="input-ndis"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Phone</label>
                  <input
                    type="tel"
                    value={formData.participant_phone || ''}
                    onChange={(e) => setFormData({...formData, participant_phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Email</label>
                  <input
                    type="email"
                    value={formData.participant_email || ''}
                    onChange={(e) => setFormData({...formData, participant_email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    placeholder="Email address"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Address</label>
                  <input
                    type="text"
                    value={formData.participant_address || ''}
                    onChange={(e) => setFormData({...formData, participant_address: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    placeholder="Full address"
                  />
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="atc-card p-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4" /> Emergency Contact
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergency_contact || ''}
                    onChange={(e) => setFormData({...formData, emergency_contact: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    placeholder="Emergency contact name"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Contact Phone</label>
                  <input
                    type="tel"
                    value={formData.emergency_phone || ''}
                    onChange={(e) => setFormData({...formData, emergency_phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    placeholder="Emergency phone"
                  />
                </div>
              </div>
            </div>

            {/* Form-specific fields */}
            {(selectedForm.id === 'progress_notes' || selectedForm.id === 'shift_report') && (
              <div className="atc-card p-6">
                <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Shift Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date</label>
                    <input
                      type="date"
                      value={formData.shift_date || ''}
                      onChange={(e) => setFormData({...formData, shift_date: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Start Time</label>
                    <input
                      type="time"
                      value={formData.shift_start || ''}
                      onChange={(e) => setFormData({...formData, shift_start: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">End Time</label>
                    <input
                      type="time"
                      value={formData.shift_end || ''}
                      onChange={(e) => setFormData({...formData, shift_end: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Notes & Activities</label>
                  <textarea
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 resize-none"
                    placeholder="Describe activities, progress, and observations..."
                  />
                </div>
              </div>
            )}

            {selectedForm.id === 'incident_report' && (
              <div className="atc-card p-6 border-amber-500/30">
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Incident Details
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={formData.incident_datetime || ''}
                      onChange={(e) => setFormData({...formData, incident_datetime: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Location</label>
                    <input
                      type="text"
                      value={formData.incident_location || ''}
                      onChange={(e) => setFormData({...formData, incident_location: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                      placeholder="Where did it occur?"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Incident Type</label>
                    <select
                      value={formData.incident_type || ''}
                      onChange={(e) => setFormData({...formData, incident_type: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="" className="bg-slate-800">Select type...</option>
                      <option value="fall" className="bg-slate-800">Fall</option>
                      <option value="injury" className="bg-slate-800">Injury</option>
                      <option value="medication" className="bg-slate-800">Medication Error</option>
                      <option value="behavior" className="bg-slate-800">Behavioral</option>
                      <option value="property" className="bg-slate-800">Property Damage</option>
                      <option value="other" className="bg-slate-800">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Severity</label>
                    <select
                      value={formData.incident_severity || ''}
                      onChange={(e) => setFormData({...formData, incident_severity: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50"
                    >
                      <option value="" className="bg-slate-800">Select severity...</option>
                      <option value="low" className="bg-slate-800">Low</option>
                      <option value="medium" className="bg-slate-800">Medium</option>
                      <option value="high" className="bg-slate-800">High</option>
                      <option value="critical" className="bg-slate-800">Critical</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Description</label>
                  <textarea
                    value={formData.incident_description || ''}
                    onChange={(e) => setFormData({...formData, incident_description: e.target.value})}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 resize-none"
                    placeholder="Describe what happened in detail..."
                  />
                </div>
              </div>
            )}

            {/* Goals */}
            <div className="atc-card p-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" /> Participant Goals
              </h4>
              <textarea
                value={formData.goals || ''}
                onChange={(e) => setFormData({...formData, goals: e.target.value})}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 resize-none"
                placeholder="Enter goals (one per line)..."
              />
            </div>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <div className="atc-card p-6 sticky top-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Form Preview</h4>
              
              {selectedClient && (
                <div className="bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 mb-4">
                  <p className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Auto-Filled From</p>
                  <p className="text-white font-bold">{selectedClient.name}</p>
                  <p className="text-slate-400 text-sm">{selectedClient.ndis_number}</p>
                </div>
              )}

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Form Type:</span>
                  <span className="text-white font-bold">{selectedForm.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Participant:</span>
                  <span className="text-white">{formData.participant_name || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">NDIS #:</span>
                  <span className="text-white">{formData.participant_ndis || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={generatePDF}
                  disabled={generating || !formData.participant_name}
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-slate-900 font-black uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  data-testid="generate-pdf"
                >
                  {generating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Generate PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NDISFormFiller;
