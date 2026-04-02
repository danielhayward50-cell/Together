import React from 'react';
import Header from '../components/layout/Header';

const IncidentsHub = () => {
  return (
    <>
      <Header
        title="Incidents Hub"
        subtitle="Clinical Safety & Incident Management System"
      />
      <div className="flex-1 overflow-y-auto p-12">
        <div className="bg-white rounded-[64px] shadow-sm border border-slate-100 border-t-8 border-t-[#B794F4] p-16 text-center">
          <div className="text-6xl mb-6">🩹</div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">
            Incidents Hub Coming Soon
          </h3>
          <p className="text-slate-500 text-lg italic">
            Clinical incident tracking, restrictive practice logs, and safety management system
          </p>
        </div>
      </div>
    </>
  );
};

export default IncidentsHub;
