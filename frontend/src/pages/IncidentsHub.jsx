import React from 'react';
import Header from '../components/layout/Header';
import { incidents } from '../mock/mockData';

const ClinicalHub = () => {
  return (
    <>
      <Header
        title="Clinical Participant Hub"
        subtitle="Master G-Drive Sync: ACTIVE"
      />
      <div className="flex-1 overflow-y-auto p-12">
        {/* Incident Management Hub */}
        <div className="p-10 bg-white rounded-[56px] border border-slate-100 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#B794F4]"></div>

          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="text-2xl font-black text-[#0A1628] tracking-tighter uppercase italic">
                Incident Management Hub
              </h3>
              <p className="text-[11px] font-bold text-red-500 uppercase tracking-[0.3em] mt-2">
                Active Clinical Risk Monitoring
              </p>
            </div>
            <button className="px-6 py-3 rounded-2xl bg-red-500 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-500/20">
              Create Manual Report
            </button>
          </div>

          <div className="space-y-4">
            {incidents.map((incident) => (
              <div
                key={incident.id}
                className="p-6 bg-red-50 rounded-[32px] border border-red-100 flex items-center justify-between group hover:scale-[1.01] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                    ⚠️
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 uppercase">
                      {incident.participant}: {incident.type}
                    </h4>
                    <p className="text-[10px] text-red-700 font-bold uppercase mt-1">
                      Status: {incident.status} · Reported {incident.reportedDate}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="px-5 py-2.5 rounded-xl bg-white text-[#0A1628] font-black text-[10px] border border-red-200">
                    VIEW PDF
                  </button>
                  <button className="px-5 py-2.5 rounded-xl bg-[#0A1628] text-white font-black text-[10px]">
                    RESOLVE
                  </button>
                </div>
              </div>
            ))}

            <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Drive Sync Target: 01 – Participants {'>'} [Name] {'>'} Incidents
              </p>
              <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase italic">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>{' '}
                Securely Synced
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClinicalHub;
