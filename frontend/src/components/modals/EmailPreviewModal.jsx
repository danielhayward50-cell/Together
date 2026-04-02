import React from 'react';
import { emailTemplate } from '../../mock/mockData';

const EmailPreviewModal = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const handleSend = () => {
    alert(`DEPLOYED: Human-centric outreach sent to ${lead.name}. Status synced to G-Drive folder: 02 - Finance > Outreach Logs`);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-8 z-[100]" style={{
      background: 'rgba(15, 23, 42, 0.9)',
      backdropFilter: 'blur(10px)'
    }}>
      <div className="bg-white w-full max-w-4xl rounded-[80px] shadow-[0_60px_150px_-20px_rgba(10,22,40,0.6)] overflow-hidden border-t-8 border-t-[#B794F4] transform transition-all scale-100 border border-white/20">
        <div className="p-20 space-y-12">
          {/* Header */}
          <div className="flex justify-between items-start pb-12 border-b border-slate-100">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
                Drafting Growth Outreach
              </h2>
              <p className="text-[11px] text-slate-400 font-black uppercase mt-4 tracking-[0.4em]">
                Sender: {emailTemplate.sender}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-900 text-5xl transition-all p-4 rounded-full leading-none italic"
            >
              ✕
            </button>
          </div>

          {/* Email Body */}
          <div className="space-y-8">
            <div className="p-12 bg-slate-50 border-4 border-slate-100 rounded-[56px] text-slate-600 text-lg leading-relaxed italic">
              <p className="mb-6">
                "Hi <span className="font-black text-slate-900 underline decoration-teal-400 underline-offset-8">{lead.name}</span>,"
              </p>
              <p className="mb-6">
                "I'm Daniel from <strong>Achieve Together Care</strong>. I've been following the great outcomes you're achieving with NDIS <span className="font-bold text-teal-600">{lead.role}</span> in Sydney."
              </p>
              <p className="mb-6">
                "We currently have immediate capacity for 1:1 Community Participation and high-intensity core supports. We focus heavily on clinical safety and goal-based evidence."
              </p>
              <p className="mb-6 italic">
                "I've attached our 2026 Capability Brochure below. Would love to grab a 5-minute coffee if you have participants looking for a reliable boutique provider."
              </p>
              <p className="mt-8 font-black text-slate-900 tracking-tighter italic">
                Daniel Hayward · 0422 492 736
              </p>
            </div>

            {/* Attachment */}
            <div className="flex items-center gap-6 p-6 bg-teal-50 border-2 border-teal-100 rounded-[32px] shadow-inner">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                {emailTemplate.attachment.icon}
              </div>
              <div>
                <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                  Attached Presentation
                </p>
                <p className="text-sm font-black text-teal-900 tracking-tight italic">
                  {emailTemplate.attachment.name}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-8 pt-8">
            <button
              onClick={onClose}
              className="flex-1 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-[40px] transition-all"
            >
              Discard Draft
            </button>
            <button
              onClick={handleSend}
              className="flex-[2] py-7 text-xs font-black bg-[#0A1628] text-white uppercase rounded-[40px] hover:bg-teal-700 shadow-[0_20px_50px_rgba(10,22,40,0.3)] transition-all tracking-[0.3em] italic"
            >
              Deploy Personalized Outreach
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailPreviewModal;
