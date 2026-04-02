import React, { useState } from 'react';
import Header from '../components/layout/Header';
import StatCard from '../components/dashboard/StatCard';
import { dashboardStats, clinicalActivity } from '../mock/mockData';

const CommandCenter = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleNewReport = () => {
    alert('FIXED: Modal pre-filled for: ' + (selectedDate || 'Current Date'));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    alert(`Opening report for ${date}`);
  };

  return (
    <>
      <Header
        title="Business Command Console"
        subtitle="Outreach Pipeline: 45 Pending · 5 Ready for Today"
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
                ↑ {dashboardStats.revenue.change}% vs TARGET
              </span>
            }
            borderColor="border-b-teal-500"
          />

          <StatCard
            title="Outreach ROI"
            value={`${dashboardStats.outreachROI.percentage}%`}
            subtitle={
              <span className="text-slate-500 tracking-widest italic">
                {dashboardStats.outreachROI.newIntakes} NEW INTAKES PENDING
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
            title="Compliance Action"
            value={`${dashboardStats.complianceAlert.count} ALERT`}
            subtitle={
              <span className="text-red-700 animate-pulse">
                {dashboardStats.complianceAlert.message}
              </span>
            }
            borderColor="border-l-8 border-l-red-500"
          />
        </div>

        {/* Calendar Section */}
        <div className="bg-white rounded-[64px] shadow-sm border border-slate-100 border-t-8 border-t-[#B794F4] p-12 overflow-hidden">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter italic mb-10">
            March 2026 Clinical Activity Log
          </h3>

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
              <div className="w-4 h-4 bg-emerald-500 rounded-full mt-2 shadow-inner"></div>
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

          {/* Calendar Legend */}
          <div className="flex gap-6 mt-10 pt-8 border-t border-slate-100">
            <span className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
              <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_#10B981]"></div>
              Completed
            </span>
            <span className="flex items-center gap-3 text-[11px] font-black text-slate-500 uppercase tracking-widest">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_#F59E0B]"></div>
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandCenter;
