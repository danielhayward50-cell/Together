import React, { useState } from 'react';
import Header from '../components/layout/Header';
import EmailPreviewModal from '../components/modals/EmailPreviewModal';
import { crmLeads } from '../mock/mockData';

const SmartOutreach = () => {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const handleOpenEmailPreview = (lead) => {
    setSelectedLead(lead);
    setIsEmailModalOpen(true);
  };

  const handleSendAllDaily = () => {
    alert('BATCH DEPLOYMENT INITIATED:\n- Validating 5 unique leads...\n- Attaching Capability Brochure PDF...\n- Sending from daniel@achievetogethercare.com');
  };

  const getServiceBadgeColor = (service) => {
    const colors = {
      'Support Coordination': 'bg-blue-50 text-blue-600',
      'Community Access': 'bg-purple-50 text-purple-600',
      'Daily Living Support': 'bg-green-50 text-green-600',
      'Plan Management': 'bg-orange-50 text-orange-600',
      'Recovery Coaching': 'bg-pink-50 text-pink-600'
    };
    return colors[service] || 'bg-slate-50 text-slate-600';
  };

  return (
    <>
      <Header
        title="Daily Strategic Outreach"
        subtitle="Outreach Pipeline: 45 Pending · 5 Ready for Today"
        actionButton={{
          label: '+ NEW CLINICAL REPORT',
          onClick: () => alert('New report modal')
        }}
      />

      <div className="flex-1 overflow-y-auto p-12 space-y-12">
        {/* Hero Banner */}
        <div className="bg-teal-50 border-[6px] border-teal-100 rounded-[72px] p-16 flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white opacity-40 rounded-full transition-transform group-hover:scale-110"></div>

          <div className="flex items-center gap-10 relative">
            <div className="w-28 h-28 bg-white rounded-[40px] shadow-inner flex items-center justify-center text-6xl group-hover:rotate-12 transition-transform">
              ✉️
            </div>
            <div>
              <h4 className="text-4xl font-black text-teal-950 tracking-tighter italic leading-tight">
                Daily Strategic Growth
              </h4>
              <p className="text-sm text-teal-600 font-bold uppercase tracking-[0.3em] mt-3 italic">
                Automatic outreach to Support Coordinators & Coaches across NSW
              </p>
            </div>
          </div>

          <div className="text-center relative bg-white/40 px-10 py-6 rounded-[32px] border border-white/60">
            <p className="text-5xl font-black text-teal-900 italic leading-none">
              {crmLeads.length}
            </p>
            <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mt-2 italic">
              Ready for Today
            </p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-[64px] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-900 uppercase italic">
              Outreach Pipeline: Sydney / NSW Central
            </h3>
            <button
              onClick={handleSendAllDaily}
              className="bg-teal-600 text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg"
            >
              Send Daily Batch ({crmLeads.length})
            </button>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 tracking-[0.2em] bg-white">
                <th className="px-12 py-8 italic">Organization & Name</th>
                <th className="px-12 py-8 italic">Service Stream</th>
                <th className="px-12 py-8 italic">Response Status</th>
                <th className="px-12 py-8 text-right italic">Owner Action</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-700">
              {crmLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-all"
                >
                  <td className="px-12 py-10">
                    <div className="font-black text-slate-900 tracking-tight">
                      {lead.name}
                    </div>
                    <div className="text-[10px] uppercase text-slate-400 tracking-widest mt-1">
                      {lead.organization}
                    </div>
                  </td>
                  <td className="px-12 py-10">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter ${getServiceBadgeColor(lead.service)}`}>
                      {lead.service}
                    </span>
                  </td>
                  <td className="px-12 py-10">
                    <span className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[9px] font-black uppercase tracking-tighter italic">
                      Waiting for Dispatch
                    </span>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <button
                      onClick={() => handleOpenEmailPreview(lead)}
                      className="text-teal-600 font-black text-[11px] uppercase tracking-[0.1em] hover:underline transition-all"
                    >
                      Review & Deploy Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Email Preview Modal */}
      <EmailPreviewModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        lead={selectedLead}
      />
    </>
  );
};

export default SmartOutreach;
