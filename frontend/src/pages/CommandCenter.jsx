import React, { useState } from 'react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import ClinicalReportModal from '../components/modals/ClinicalReportModal';
import { dashboardStats, clinicalActivity } from '../mock/mockData';

const CommandCenter = () => {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleNewReport = () => {
    setSelectedDate('2026-04-01');
    setIsReportModalOpen(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsReportModalOpen(true);
  };

  const dayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <>
      <Header
        title="Business Command Console"
        subtitle="Master G-Drive Sync: ACTIVE"
        actionButton={{
          label: '+ NEW CLINICAL REPORT',
          onClick: handleNewReport
        }}
      />

      <div className="flex-1 overflow-y-auto p-12 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <StatCard
            title="Revenue (Mar)"
            value={`$${dashboardStats.revenue.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
            subtitle={
              <span className="text-emerald-600 relative group-hover:translate-x-1 transition-transform">
                ↑ {dashboardStats.revenue.change}% vs Feb Performance
              </span>
            }
            borderColor="border-b-teal-500"
          />

          <StatCard
            title="Roster Success"
            value="100%"
            subtitle={
              <span className="text-slate-500 tracking-widest italic">
                42 SHIFTS COMPLETED
              </span>
            }
          />

          <StatCard
            title="NDIS Burn Rate"
            value={`$${dashboardStats.ndisBurnRate.dailyRate.toFixed(2)}/day`}
            variant="dark"
            subtitle={
              <div className="mt-4 w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-500 h-full rounded-full shadow-[0_0_20px_#14BDBD]"
                  style={{ width: `${dashboardStats.ndisBurnRate.percentage}%` }}
                ></div>
              </div>
            }
          />

          <StatCard
            title="Critical Alerts"
            value={`${dashboardStats.complianceAlert.count} ACTION`}
            subtitle={
              <span className="text-red-700 animate-pulse">
                {dashboardStats.complianceAlert.message}
              </span>
            }
            borderColor="border-l-8 border-l-red-500"
          />
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-[64px] shadow-sm border border-slate-100 border-t-8 border-t-[#B794F4] overflow-hidden">
          <div className="p-12 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic">
                Clinical Master Roster
              </h3>
              <p className="text-[11px] text-slate-400 font-bold uppercase mt-2">
                March 2026 Operations Loop
              </p>
            </div>
            <div className="flex gap-8">
              <span className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"></div>
                Completed
              </span>
              <span className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                <div className="w-3.5 h-3.5 rounded-full bg-amber-500"></div>
                Scheduled
              </span>
            </div>
          </div>

          <div className="p-12">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-6 mb-10">
              {dayHeaders.map((day) => (
                <div
                  key={day}
                  className="text-center py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-6">
              {/* Day 1 - Inactive */}
              <div className="aspect-square bg-slate-50 rounded-3xl border-2 border-slate-100 flex items-center justify-center text-sm font-bold text-slate-200 italic">
                1
              </div>

              {/* Days 2-8 */}
              {[2, 3, 4, 5, 6, 7, 8].map((day) => (
                <div
                  key={day}
                  className="aspect-square bg-slate-50 rounded-3xl border-2 border-slate-100 flex items-center justify-center text-sm font-bold text-slate-300 italic"
                >
                  {day}
                </div>
              ))}

              {/* Day 9 - Active with shift */}
              <button
                onClick={() => handleDateClick('2026-03-09')}
                className="aspect-square bg-emerald-50 rounded-[48px] border-2 border-emerald-500/20 flex flex-col items-center justify-center hover:scale-110 transition-all shadow-2xl shadow-emerald-500/10 group cursor-pointer relative"
              >
                <span className="text-sm font-black text-emerald-900 group-hover:scale-125 transition-transform">
                  9
                </span>
                <div className="w-4 h-4 bg-emerald-500 rounded-full mt-2 shadow-inner animate-pulse"></div>
              </button>

              {/* Remaining days */}
              {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21].map((day) => (
                <div
                  key={day}
                  className="aspect-square bg-slate-50 rounded-3xl border-2 border-slate-100 flex items-center justify-center text-sm font-bold text-slate-300 italic"
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Report Modal */}
      <ClinicalReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        prefilledDate={selectedDate}
      />
    </>
  );
};

export default CommandCenter;
