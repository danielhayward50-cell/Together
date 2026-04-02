import React, { useState } from 'react';
import { Mail, Send, X, FileText, Users } from 'lucide-react';

export function SmartOutreach() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const leads = [
    {
      id: 1,
      name: 'Sarah Williams',
      organization: 'North West Co.',
      role: 'Support Coordinator',
      email: 'sarah.w@nwco.com.au',
      phone: '0412 888 999',
      status: 'draft'
    },
    {
      id: 2,
      name: 'Michael Chen',
      organization: 'Sydney Care Partners',
      role: 'Team Coordinator',
      email: 'm.chen@sydneycare.com.au',
      phone: '0423 567 890',
      status: 'draft'
    },
    {
      id: 3,
      name: 'Emma Thompson',
      organization: 'Central Coast Support',
      role: 'Support Coordinator',
      email: 'emma.t@ccsupp.com.au',
      phone: '0434 123 456',
      status: 'draft'
    },
    {
      id: 4,
      name: 'David Kumar',
      organization: 'Western Sydney Hub',
      role: 'Plan Manager',
      email: 'd.kumar@wshub.com.au',
      phone: '0445 789 012',
      status: 'draft'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      organization: 'North Shore Coaching',
      role: 'Recovery Coach',
      email: 'lisa@nscoach.com.au',
      phone: '0456 234 567',
      status: 'draft'
    }
  ];

  const handleOpenEmail = (lead) => {
    setSelectedLead(lead);
    setShowEmailModal(true);
  };

  const handleSendEmail = () => {
    alert(`SUCCESS: Human-centric email sent to ${selectedLead.name}\n\nStatus synced to G-Drive folder:\n02 - Finance > Outreach Logs`);
    setShowEmailModal(false);
  };

  const handleSendBatch = () => {
    alert(
      'BATCH DEPLOYMENT INITIATED:\n\n' +
      '- Validating 5 unique leads...\n' +
      '- Attaching Capability Brochure PDF...\n' +
      '- Sending from daniel@achievetogethercare.com\n\n' +
      '✅ All emails queued for delivery!'
    );
  };

  return (
    <div className="space-y-12">
      {/* Hero Banner */}
      <div className="bg-teal-50 border-[6px] border-teal-100 rounded-[72px] p-16 flex items-center justify-between shadow-2xl relative overflow-hidden group">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-white opacity-40 rounded-full transition-transform group-hover:scale-110"></div>
        
        <div className="flex items-center gap-10 relative z-10">
          <div className="w-28 h-28 bg-white rounded-[40px] shadow-inner flex items-center justify-center text-6xl group-hover:rotate-12 transition-transform">
            ✉️
          </div>
          <div>
            <h4 className="text-4xl font-black text-teal-950 tracking-tighter italic leading-tight">
              Daily Strategic Growth
            </h4>
            <p className="text-sm text-teal-600 font-bold uppercase tracking-[0.3em] mt-3 italic">
              Outreach Target: 5/day to NSW Coordinators
            </p>
          </div>
        </div>
        
        <div className="text-center relative bg-white/40 px-12 py-8 rounded-[40px] border border-white/60 shadow-sm z-10">
          <p className="text-6xl font-black text-teal-900 italic leading-none">
            {leads.length}
          </p>
          <p className="text-[11px] font-black text-teal-600 uppercase tracking-widest mt-3 italic">
            Emails Ready for Today
          </p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-[64px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-900 uppercase italic">
            Daily Batch: NSW Support Coordinators
          </h3>
          <button
            onClick={handleSendBatch}
            className="bg-[#0A1628] text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-teal-700 transition-all shadow-lg"
          >
            Send Daily Batch ({leads.length})
          </button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 tracking-[0.2em] bg-white">
              <th className="px-12 py-8 italic">Target / Organization</th>
              <th className="px-12 py-8 italic">Role & Service</th>
              <th className="px-12 py-8 italic">Contact Details</th>
              <th className="px-12 py-8 italic">Response</th>
              <th className="px-12 py-8 text-right italic">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm font-bold text-slate-700 italic">
            {leads.map(lead => (
              <tr
                key={lead.id}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition-all group cursor-pointer"
              >
                <td className="px-12 py-10 font-black text-slate-900 tracking-tight">
                  {lead.name}{' '}
                  <span className="text-slate-300 font-medium ml-2">
                    — {lead.organization}
                  </span>
                </td>
                <td className="px-12 py-10 italic uppercase text-[10px] tracking-widest text-teal-600">
                  {lead.role}
                </td>
                <td className="px-12 py-10 text-xs text-slate-400">
                  {lead.email} · {lead.phone}
                </td>
                <td className="px-12 py-10">
                  <span className="px-4 py-1 bg-slate-100 text-slate-400 rounded-full text-[9px] uppercase font-black italic">
                    Draft Pending
                  </span>
                </td>
                <td className="px-12 py-10 text-right">
                  <button
                    onClick={() => handleOpenEmail(lead)}
                    className="text-teal-600 font-black text-[11px] uppercase tracking-[0.1em] hover:underline"
                  >
                    Review & Send
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email Preview Modal */}
      {showEmailModal && selectedLead && (
        <div className="fixed inset-0 flex items-center justify-center p-8 z-[100]" style={{
          background: 'rgba(15, 23, 42, 0.9)',
          backdropFilter: 'blur(10px)'
        }}>
          <div className="bg-white w-full max-w-4xl rounded-[80px] shadow-[0_60px_150px_-20px_rgba(10,22,40,0.7)] overflow-hidden border-t-8 border-t-[#B794F4] transform transition-all scale-100 border border-white/20">
            <div className="p-20 space-y-12">
              {/* Header */}
              <div className="flex justify-between items-start pb-12 border-b border-slate-100">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                    Drafting Growth Outreach
                  </h2>
                  <p className="text-[11px] text-slate-400 font-black uppercase mt-4 tracking-[0.4em]">
                    From: daniel@achievetogethercare.com
                  </p>
                </div>
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="text-slate-300 hover:text-slate-900 text-5xl transition-all p-4 rounded-full hover:bg-slate-50 italic leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Email Body */}
              <div className="space-y-8">
                <div className="p-12 bg-slate-50 border-4 border-slate-100 rounded-[56px] italic text-slate-600 text-lg leading-relaxed">
                  <p className="mb-6 italic">
                    "Hi <span className="font-black text-slate-900 underline decoration-teal-400 underline-offset-8">{selectedLead.name}</span>,"
                  </p>
                  <p className="mb-6 italic">
                    "I'm Daniel from <strong>Achieve Together Care</strong>. I've been following your work with NDIS <span className="font-bold text-teal-600">{selectedLead.role}</span> in Sydney and noticed the great outcomes you're achieving."
                  </p>
                  <p className="mb-6 italic">
                    "We currently have immediate capacity for 1:1 Community Participation and high-intensity core supports. We focus heavily on clinical safety, restrictive practice reduction, and providing goal-based evidence for your reports."
                  </p>
                  <p className="mb-6 italic">
                    "I've attached our 2026 Capability Brochure below. Would love to have a 5-minute chat if you have any participants looking for a reliable boutique provider."
                  </p>
                  <p className="mt-8 font-black text-slate-900 tracking-tighter italic">
                    Daniel Hayward · 0422 492 736
                  </p>
                </div>

                {/* Attachment */}
                <div className="flex items-center gap-6 p-6 bg-teal-50 border-2 border-teal-100 rounded-[32px] shadow-inner italic">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                    📄
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                      Attached Brochure
                    </p>
                    <p className="text-sm font-black text-teal-900 tracking-tight italic">
                      ATC_Capability_Brochure_2026.pdf
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-8 pt-12">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 py-8 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-[40px] transition-all"
                >
                  Discard Draft
                </button>
                <button
                  onClick={handleSendEmail}
                  className="flex-[2] py-8 text-xs font-black bg-[#0A1628] text-white uppercase rounded-[40px] hover:bg-teal-700 shadow-[0_20px_50px_rgba(10,22,40,0.4)] transition-all tracking-[0.3em] italic"
                >
                  Deploy Personal Outreach
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
