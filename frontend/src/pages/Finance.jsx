import React from 'react';
import Header from '../components/layout/Header';
import { financeData } from '../mock/mockData';

const Finance = () => {
  return (
    <>
      <Header
        title="NDIS Billing Controller"
        subtitle="Master G-Drive Sync: ACTIVE"
      />

      <div className="flex-1 overflow-y-auto p-12 space-y-10">
        {/* Finance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-10 rounded-[56px] border-l-[12px] border-l-indigo-600">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
              SCHADS Base ({financeData.schadsBase.level})
            </p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter italic">
              ${financeData.schadsBase.rate.toFixed(2)}{' '}
              <span className="text-sm text-slate-400 italic">/ hr</span>
            </p>
            <div className="h-px bg-slate-200 my-6"></div>
            <div className="flex justify-between text-[11px] font-black uppercase text-slate-500 tracking-tighter">
              <span>Tax ({financeData.schadsBase.taxRate}%)</span>{' '}
              <span className="text-red-500">-${financeData.schadsBase.tax.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-white/30 p-10 rounded-[56px]">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">
              {financeData.coreSupport.description}
            </p>
            <p className="text-4xl font-black text-teal-600 tracking-tighter italic">
              ${financeData.coreSupport.rate.toFixed(2)}{' '}
              <span className="text-sm text-slate-400 italic">/ hr</span>
            </p>
            <p className="text-[10px] font-bold text-slate-500 mt-4 uppercase italic">
              Validated: {financeData.coreSupport.validated}
            </p>
          </div>

          <div className="bg-emerald-50 p-10 rounded-[56px] border-4 border-emerald-100 shadow-2xl">
            <p className="text-[10px] font-black text-emerald-600 uppercase mb-3 tracking-widest">
              March Net Disbursement
            </p>
            <p className="text-5xl font-black text-emerald-950 tracking-tighter italic">
              ${financeData.netDisbursement.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="bg-white rounded-[64px] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase border-b border-slate-100 tracking-widest">
                <th className="px-12 py-8">Entity / Staff</th>
                <th className="px-12 py-8">Hours</th>
                <th className="px-12 py-8">Gross Pay</th>
                <th className="px-12 py-8 text-right">Payment Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-bold text-slate-700 italic">
              {financeData.payroll.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-slate-50 hover:bg-slate-50/80 transition-all cursor-pointer"
                >
                  <td className="px-12 py-10 font-black text-slate-900 tracking-tight">
                    {entry.name}
                  </td>
                  <td className="px-12 py-10 tracking-widest">
                    {entry.hours.toFixed(1)} HRS
                  </td>
                  <td className="px-12 py-10">${entry.grossPay.toFixed(2)}</td>
                  <td className="px-12 py-10 text-right">
                    <span className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] uppercase font-black">
                      Ready to Pay
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Finance;