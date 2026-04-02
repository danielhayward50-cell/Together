// ATC Platform - Payroll Management Component (SCHADS Award)
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Calendar, Clock, Users, Calculator, 
  Loader2, Download, FileText, TrendingUp, CheckCircle
} from 'lucide-react';
import { staffAPI } from '../../services/api';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export function PayrollManagement() {
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState([]);
  const [payrollData, setPayrollData] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [calculating, setCalculating] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [payrollHistory, setPayrollHistory] = useState([]);

  // SCHADS Award Rates
  const schadsRates = {
    level_2: {
      name: "Level 2 - Support Worker",
      weekday: 38.08,
      saturday: 57.12,
      sunday: 76.16,
      public_holiday: 95.20
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffData, historyRes] = await Promise.all([
        staffAPI.getAll(),
        fetch(`${API_URL}/api/payroll/history?limit=5`, { credentials: 'include' }).then(r => r.json())
      ]);
      setStaff(staffData);
      setPayrollHistory(historyRes || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayroll = async () => {
    setCalculating(true);
    try {
      const response = await fetch(
        `${API_URL}/api/payroll/summary?period_start=${selectedPeriod.start}&period_end=${selectedPeriod.end}`,
        { credentials: 'include' }
      );
      const data = await response.json();
      setPayrollData(data);
    } catch (error) {
      console.error('Error calculating payroll:', error);
      alert('Error calculating payroll');
    } finally {
      setCalculating(false);
    }
  };

  const processPayroll = async () => {
    if (!window.confirm('Process payroll for this period? This will create a payroll record.')) return;
    
    setProcessing(true);
    try {
      const response = await fetch(
        `${API_URL}/api/payroll/process?period_start=${selectedPeriod.start}&period_end=${selectedPeriod.end}`,
        { method: 'POST', credentials: 'include' }
      );
      const data = await response.json();
      alert(`Payroll processed successfully!\nTotal: $${data.totals.total_cost.toFixed(2)}`);
      fetchData();
    } catch (error) {
      console.error('Error processing payroll:', error);
      alert('Error processing payroll');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Payroll Management
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            SCHADS Award Compliant • {staff.length} Staff Members
          </p>
        </div>
      </div>

      {/* Period Selection & SCHADS Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Period Selection */}
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-200 p-6">
          <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" />
            Pay Period
          </h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Start Date</label>
              <input
                type="date"
                value={selectedPeriod.start}
                onChange={(e) => setSelectedPeriod({ ...selectedPeriod, start: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                data-testid="payroll-start-date"
              />
            </div>
            <div>
              <label className="text-xs font-black text-slate-400 uppercase mb-2 block">End Date</label>
              <input
                type="date"
                value={selectedPeriod.end}
                onChange={(e) => setSelectedPeriod({ ...selectedPeriod, end: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3"
                data-testid="payroll-end-date"
              />
            </div>
          </div>
          <button
            onClick={calculatePayroll}
            disabled={calculating}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold uppercase flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 transition-all disabled:opacity-50"
            data-testid="calculate-payroll-btn"
          >
            {calculating ? <Loader2 className="animate-spin" size={18} /> : <Calculator size={18} />}
            Calculate Payroll
          </button>
        </div>

        {/* SCHADS Rates Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-[32px] p-6 text-white">
          <h3 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
            <TrendingUp size={20} />
            SCHADS Award Rates
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-2">
              <span className="text-sm opacity-80">Weekday</span>
              <span className="font-black">${schadsRates.level_2.weekday}/hr</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-2">
              <span className="text-sm opacity-80">Saturday</span>
              <span className="font-black">${schadsRates.level_2.saturday}/hr</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-2">
              <span className="text-sm opacity-80">Sunday</span>
              <span className="font-black">${schadsRates.level_2.sunday}/hr</span>
            </div>
            <div className="flex justify-between items-center bg-white/10 rounded-xl px-4 py-2">
              <span className="text-sm opacity-80">Public Holiday</span>
              <span className="font-black">${schadsRates.level_2.public_holiday}/hr</span>
            </div>
          </div>
          <p className="text-xs mt-4 opacity-70">Level 2 Support Worker rates</p>
        </div>
      </div>

      {/* Payroll Results */}
      {payrollData && (
        <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden">
          <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase">
                Payroll Summary
              </h3>
              <p className="text-slate-500 text-sm">{payrollData.period}</p>
            </div>
            <button
              onClick={processPayroll}
              disabled={processing}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold uppercase flex items-center gap-2 shadow-lg disabled:opacity-50"
              data-testid="process-payroll-btn"
            >
              {processing ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              Process Payroll
            </button>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-4 gap-px bg-slate-100">
            <div className="bg-white p-6 text-center">
              <p className="text-xs text-slate-400 uppercase mb-1">Total Staff</p>
              <p className="text-3xl font-black text-slate-900">{payrollData.totals.staff_count}</p>
            </div>
            <div className="bg-white p-6 text-center">
              <p className="text-xs text-slate-400 uppercase mb-1">Total Hours</p>
              <p className="text-3xl font-black text-slate-900">{payrollData.totals.total_hours}</p>
            </div>
            <div className="bg-white p-6 text-center">
              <p className="text-xs text-slate-400 uppercase mb-1">Gross Pay</p>
              <p className="text-3xl font-black text-emerald-600">${payrollData.totals.total_gross.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 text-center">
              <p className="text-xs text-slate-400 uppercase mb-1">Super (11.5%)</p>
              <p className="text-3xl font-black text-blue-600">${payrollData.totals.total_super.toFixed(2)}</p>
            </div>
          </div>

          {/* Staff Table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase">Staff Member</th>
                <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase">Role</th>
                <th className="text-center px-6 py-4 text-xs font-black text-slate-400 uppercase">Shifts</th>
                <th className="text-center px-6 py-4 text-xs font-black text-slate-400 uppercase">Hours</th>
                <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase">Gross Pay</th>
                <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase">Super</th>
              </tr>
            </thead>
            <tbody>
              {payrollData.staff.map(member => (
                <tr 
                  key={member.staff_id}
                  className="border-b border-slate-50 hover:bg-slate-50/50"
                  data-testid={`payroll-row-${member.staff_id}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                        {member.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <span className="font-bold text-slate-900">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{member.role}</td>
                  <td className="px-6 py-4 text-center font-bold">{member.shifts}</td>
                  <td className="px-6 py-4 text-center font-bold">{member.hours}h</td>
                  <td className="px-6 py-4 text-right font-black text-emerald-600">${member.gross_pay.toFixed(2)}</td>
                  <td className="px-6 py-4 text-right font-bold text-blue-600">${member.super.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-900 text-white">
                <td colSpan="3" className="px-6 py-4 font-black uppercase">Total Payroll Cost</td>
                <td className="px-6 py-4 text-center font-black">{payrollData.totals.total_hours}h</td>
                <td className="px-6 py-4 text-right font-black">${payrollData.totals.total_gross.toFixed(2)}</td>
                <td className="px-6 py-4 text-right font-black text-emerald-400">${payrollData.totals.total_cost.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Payroll History */}
      {payrollHistory.length > 0 && (
        <div className="bg-white rounded-[32px] border border-slate-200 p-6">
          <h3 className="text-lg font-black text-slate-900 uppercase mb-4 flex items-center gap-2">
            <FileText size={20} className="text-slate-400" />
            Recent Payroll Runs
          </h3>
          <div className="space-y-3">
            {payrollHistory.map(payroll => (
              <div 
                key={payroll.payroll_id}
                className="flex items-center justify-between bg-slate-50 rounded-xl p-4"
              >
                <div>
                  <p className="font-bold text-slate-900">
                    {payroll.period_start} to {payroll.period_end}
                  </p>
                  <p className="text-xs text-slate-400">
                    {payroll.totals?.staff_count || 0} staff • {payroll.totals?.total_hours || 0} hours
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-black text-emerald-600">
                    ${payroll.totals?.total_cost?.toFixed(2) || '0.00'}
                  </p>
                  <span className="text-xs font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-1 rounded-full">
                    {payroll.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!payrollData && !loading && (
        <div className="bg-slate-50 rounded-[32px] p-16 text-center">
          <DollarSign size={48} className="text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-600 mb-2">No Payroll Calculated</h3>
          <p className="text-slate-400">Select a pay period and click "Calculate Payroll" to get started</p>
        </div>
      )}
    </div>
  );
}

export default PayrollManagement;
