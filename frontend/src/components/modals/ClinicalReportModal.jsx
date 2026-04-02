import React, { useState } from 'react';

const ClinicalReportModal = ({ isOpen, onClose, prefilledDate }) => {
  const [date, setDate] = useState(prefilledDate || '2026-04-01');
  const [km, setKm] = useState(15);
  const [narrative, setNarrative] = useState('');

  if (!isOpen) return null;

  const handleGenerate = () => {
    alert(
      "AI CLINICAL SUCCESS:\n- Evidence linked to Goal 3 (Independence)\n- Mapped to Core daytime $70.23/hr\n- Draft PDF synced to Shaun Case folder"
    );
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
                Enter Clinical Data
              </h2>
              <p className="text-[11px] text-slate-400 font-black uppercase mt-4 tracking-[0.4em]">
                Step 1: Clinical Observation
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-300 hover:text-slate-900 text-5xl transition-all p-4 rounded-full hover:bg-slate-50 leading-none"
            >
              ✕
            </button>
          </div>

          {/* Form */}
          <div className="space-y-10">
            <div className="grid grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Target Shift Date [FIXED]
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-slate-50 border-4 border-slate-100 rounded-[32px] px-10 py-6 text-sm font-black text-slate-700 focus:border-teal-500 focus:bg-white outline-none transition-all shadow-inner uppercase"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  NDIS Travel Distance (KM)
                </label>
                <input
                  type="number"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  className="w-full bg-slate-50 border-4 border-slate-100 rounded-[32px] px-10 py-6 text-sm font-black text-slate-700 focus:border-teal-500 focus:bg-white outline-none shadow-inner"
                />
              </div>
            </div>

            {/* Billing Window */}
            <div className="p-10 bg-teal-50 border-4 border-teal-100 rounded-[48px] flex justify-between items-center shadow-inner relative overflow-hidden group">
              <div className="flex items-center gap-6 relative">
                <div className="w-16 h-16 bg-white rounded-3xl shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  ⏰
                </div>
                <div>
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">
                    Billing Window
                  </p>
                  <span className="text-2xl font-black text-teal-950 tracking-tighter italic">
                    09:00 AM — 03:00 PM
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] font-black text-teal-700 uppercase italic tracking-widest px-6 py-2.5 bg-white rounded-full shadow-sm border border-teal-100">
                  6.0 HOURS AUTO-CALC
                </span>
              </div>
            </div>

            {/* Narrative */}
            <div className="space-y-4">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Clinical Shift Narrative
              </label>
              <textarea
                value={narrative}
                onChange={(e) => setNarrative(e.target.value)}
                placeholder="Briefly describe activities... AI will expand into NDIS Goal evidence"
                className="w-full bg-slate-50 border-4 border-slate-100 rounded-[48px] px-12 py-10 text-sm font-medium h-64 resize-none outline-none focus:border-teal-500 focus:bg-white transition-all shadow-inner italic"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-8 pt-12">
            <button
              onClick={onClose}
              className="flex-1 py-7 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-[32px] transition-all"
            >
              TERMINATE ENTRY
            </button>
            <button
              onClick={handleGenerate}
              className="flex-[2] py-7 text-xs font-black bg-[#0A1628] text-white uppercase rounded-[40px] hover:bg-teal-700 shadow-2xl transition-all tracking-[0.3em]"
            >
              GENERATE CLINICAL REPORT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalReportModal;