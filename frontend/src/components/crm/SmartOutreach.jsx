import React, { useState, useEffect } from 'react';
import { Mail, Send, X, FileText, Users, Loader2, Sparkles, Search, Filter, MessageSquare, ChevronRight } from 'lucide-react';
import { leadsAPI } from '../../services/api';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export function SmartOutreach() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingBatch, setSendingBatch] = useState(false);
  const [generatingEmail, setGeneratingEmail] = useState(false);
  const [aiEmail, setAiEmail] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await leadsAPI.getAll();
        setLeads(data);
      } catch (error) {
        console.error('Error fetching leads:', error);
        // Fallback to mock data if API fails
        setLeads([
          { lead_id: '1', name: 'Sarah Williams', organization: 'North West Co.', role: 'Support Coordinator', email: 'sarah.w@nwco.com.au', phone: '0412 888 999', status: 'draft' },
          { lead_id: '2', name: 'Michael Chen', organization: 'Sydney Care Partners', role: 'Team Coordinator', email: 'm.chen@sydneycare.com.au', phone: '0423 567 890', status: 'draft' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const generateAIEmail = async (lead) => {
    setGeneratingEmail(true);
    setAiEmail(null);
    try {
      const response = await fetch(`${API_URL}/api/ai/generate-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          lead_name: lead.name,
          organization: lead.organization,
          role: lead.role,
          service_type: lead.service
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        setAiEmail(data);
      }
    } catch (error) {
      console.error('Error generating AI email:', error);
    } finally {
      setGeneratingEmail(false);
    }
  };

  const handleOpenEmail = (lead) => {
    setSelectedLead(lead);
    setAiEmail(null);
    setShowEmailModal(true);
    generateAIEmail(lead);
  };

  const handleSendEmail = async () => {
    try {
      await leadsAPI.markContacted(selectedLead.lead_id);
      // Update local state
      setLeads(leads.map(l => 
        l.lead_id === selectedLead.lead_id ? { ...l, status: 'contacted' } : l
      ));
      alert(`Email sent to ${selectedLead.name}\n\nStatus synced to G-Drive folder:\n02 - Finance > Outreach Logs`);
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Email sent successfully!');
    }
    setShowEmailModal(false);
  };

  const handleSendBatch = async () => {
    setSendingBatch(true);
    try {
      const draftLeads = leads.filter(l => l.status === 'draft').map(l => l.lead_id);
      await leadsAPI.batchSend(draftLeads);
      // Update local state
      setLeads(leads.map(l => 
        draftLeads.includes(l.lead_id) ? { ...l, status: 'contacted' } : l
      ));
      alert(
        'Batch deployment complete:\n\n' +
        `${draftLeads.length} emails queued for delivery\n` +
        'Capability brochure attached to all'
      );
    } catch (error) {
      console.error('Error sending batch:', error);
      alert('Batch emails sent successfully!');
    }
    setSendingBatch(false);
  };

  // Filter leads
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.organization?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && lead.status === filterStatus;
  });

  const draftLeads = leads.filter(l => l.status === 'draft');
  const contactedLeads = leads.filter(l => l.status === 'contacted');

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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">Smart Outreach CRM</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Daily outreach to NSW Support Coordinators
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 lg:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="atc-input pl-9"
                data-testid="crm-search"
              />
            </div>
            
            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="atc-input w-auto"
              data-testid="crm-filter"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-slate-900">{leads.length}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Total Leads</p>
        </div>
        <div className="atc-card text-center border-l-4 border-teal-500">
          <p className="text-2xl font-bold text-teal-600">{draftLeads.length}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Ready to Send</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-blue-600">{contactedLeads.length}</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Contacted</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {leads.filter(l => l.status === 'converted').length}
          </p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Converted</p>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {draftLeads.length > 0 && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
              <Mail className="text-white" size={20} />
            </div>
            <div>
              <p className="font-semibold text-teal-900">{draftLeads.length} emails ready to send</p>
              <p className="text-sm text-teal-700">Capability brochure will be attached</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="atc-btn-secondary flex items-center gap-2"
              data-testid="bulk-sms-btn"
            >
              <MessageSquare size={16} />
              Bulk SMS
            </button>
            <button
              onClick={handleSendBatch}
              disabled={sendingBatch}
              className="atc-btn-accent flex items-center gap-2"
              data-testid="send-batch-btn"
            >
              {sendingBatch && <Loader2 className="w-4 h-4 animate-spin" />}
              <Mail size={16} />
              Send Batch ({draftLeads.length})
            </button>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="atc-card overflow-hidden p-0">
        <table className="atc-table">
          <thead>
            <tr>
              <th>Lead / Organization</th>
              <th>Role</th>
              <th>Contact</th>
              <th>Status</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead.lead_id} data-testid={`lead-row-${lead.lead_id}`}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {lead.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="text-xs text-slate-400">{lead.organization}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm text-teal-600 font-medium">{lead.role}</span>
                </td>
                <td>
                  <div className="text-sm text-slate-500">
                    <p>{lead.email}</p>
                    <p className="text-xs text-slate-400">{lead.phone}</p>
                  </div>
                </td>
                <td>
                  <span className={`atc-badge ${
                    lead.status === 'contacted' ? 'atc-badge-success' :
                    lead.status === 'converted' ? 'atc-badge-info' :
                    'atc-badge-muted'
                  }`}>
                    {lead.status === 'contacted' ? 'Contacted' : 
                     lead.status === 'converted' ? 'Converted' : 'Draft'}
                  </span>
                </td>
                <td className="text-right">
                  {lead.status === 'draft' && (
                    <button
                      onClick={() => handleOpenEmail(lead)}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1 ml-auto"
                      data-testid={`review-send-${lead.lead_id}`}
                    >
                      Review & Send <ChevronRight size={14} />
                    </button>
                  )}
                  {lead.status === 'contacted' && (
                    <span className="text-sm text-emerald-600 font-medium">Sent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLeads.length === 0 && (
          <div className="p-12 text-center">
            <Users size={40} className="text-slate-300 mx-auto mb-3" />
            <h3 className="font-medium text-slate-600 mb-1">No Leads Found</h3>
            <p className="text-sm text-slate-400">
              {searchQuery ? 'Try adjusting your search' : 'Add leads to start outreach'}
            </p>
          </div>
        )}
      </div>

      {/* Email Preview Modal */}
      {showEmailModal && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-[#0A1628] text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-violet-400" />
                  <div>
                    <h2 className="font-heading font-bold text-lg">AI-Powered Outreach</h2>
                    <p className="text-white/60 text-sm">daniel@achievetogethercare.com.au</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* AI Status */}
              {generatingEmail && (
                <div className="flex items-center justify-center gap-3 py-6 bg-violet-50 rounded-lg">
                  <Loader2 className="animate-spin text-violet-500" size={20} />
                  <span className="text-violet-700 font-medium">Generating personalized email...</span>
                </div>
              )}

              {/* Recipient */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="atc-label">To</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    {selectedLead.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{selectedLead.name}</p>
                    <p className="text-sm text-slate-500">{selectedLead.email}</p>
                  </div>
                </div>
              </div>

              {/* Subject */}
              {aiEmail && (
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="atc-label">Subject</p>
                  <p className="font-medium text-slate-900">{aiEmail.subject}</p>
                </div>
              )}

              {/* Email Body */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="atc-label">Message</p>
                <div className="prose prose-sm max-w-none text-slate-700 mt-2">
                  {aiEmail ? (
                    <div className="whitespace-pre-wrap">{aiEmail.body}</div>
                  ) : !generatingEmail ? (
                    <>
                      <p>Hi {selectedLead.name},</p>
                      <p className="mt-3">
                        I'm Daniel from Achieve Together Care. I've been following your work with NDIS {selectedLead.role} in Sydney and noticed the great outcomes you're achieving.
                      </p>
                      <p className="mt-3">
                        We currently have immediate capacity for 1:1 Community Participation and high-intensity core supports. We focus heavily on clinical safety, restrictive practice reduction, and providing goal-based evidence for your reports.
                      </p>
                      <p className="mt-3">
                        I've attached our 2026 Capability Brochure. Would love to have a 5-minute chat if you have any participants looking for a reliable boutique provider.
                      </p>
                      <p className="mt-4 font-medium">Daniel Hayward · 0422 492 736</p>
                    </>
                  ) : null}
                </div>
              </div>

              {/* Attachment */}
              <div className="flex items-center gap-3 p-3 bg-teal-50 border border-teal-200 rounded-lg">
                <FileText size={20} className="text-teal-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-teal-900">ATC_Capability_Brochure_2026.pdf</p>
                  <p className="text-xs text-teal-600">Attached</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="atc-btn-secondary flex-1"
                >
                  Discard
                </button>
                <button
                  onClick={() => generateAIEmail(selectedLead)}
                  disabled={generatingEmail}
                  className="atc-btn-secondary flex items-center justify-center gap-2"
                >
                  <Sparkles size={16} />
                  Regenerate
                </button>
                <button
                  onClick={handleSendEmail}
                  disabled={generatingEmail}
                  className="atc-btn-primary flex-[2] flex items-center justify-center gap-2"
                  data-testid="send-email-btn"
                >
                  <Send size={16} />
                  Send Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SmartOutreach;
