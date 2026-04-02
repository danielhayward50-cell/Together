import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, FileText, Download, Eye } from 'lucide-react';
import { SHIFTS, CLIENTS } from '../../lib/data';

export function ComprehensiveCalendar({ onCreateReport, onViewShift }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)); // March 2026
  const [selectedDate, setSelectedDate] = useState(null);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get calendar days
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Get shifts for a specific date
  const getShiftsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return SHIFTS.filter(s => s.date === dateStr);
  };

  // Check if date has shifts
  const hasShifts = (day) => {
    return getShiftsForDate(day).length > 0;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDayClick = (day) => {
    if (!day) return;
    setSelectedDate(day);
  };

  const selectedDateShifts = selectedDate ? getShiftsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <button
              onClick={nextMonth}
              className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center py-3">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {getCalendarDays().map((day, index) => {
            const shifts = getShiftsForDate(day);
            const isSelected = selectedDate === day;
            const hasData = hasShifts(day);
            
            return (
              <button
                key={index}
                onClick={() => handleDayClick(day)}
                disabled={!day}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-center p-2 transition-all ${
                  !day
                    ? 'bg-transparent cursor-default'
                    : isSelected
                    ? 'bg-[#B794F4] text-white shadow-lg scale-105'
                    : hasData
                    ? 'bg-emerald-50 border-2 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-slate-50 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {day && (
                  <>
                    <span className={`text-sm font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                      {day}
                    </span>
                    {hasData && !isSelected && (
                      <div className="flex gap-1 mt-1">
                        {shifts.map((_, i) => (
                          <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-emerald-500"
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex gap-6 mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
            <span className="text-xs font-bold text-slate-600 uppercase">Completed Shifts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500"></div>
            <span className="text-xs font-bold text-slate-600 uppercase">Scheduled</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && selectedDateShifts.length > 0 && (
        <div className="bg-white rounded-[32px] border border-slate-200 p-8">
          <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6">
            {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
          </h4>
          
          <div className="space-y-4">
            {selectedDateShifts.map(shift => {
              const client = CLIENTS.find(c => c.name === shift.participant);
              return (
                <div
                  key={shift.id}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-200 hover:bg-slate-100 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h5 className="font-black text-slate-900 text-lg">{shift.participant}</h5>
                      <p className="text-sm text-slate-500 mt-1">
                        {shift.startTime} - {shift.endTime} ({shift.hours}h)
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Worker: {shift.worker} · Travel: {shift.km}km
                      </p>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${
                      shift.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {shift.status}
                    </span>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => onCreateReport && onCreateReport(shift)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl text-xs font-black uppercase hover:bg-blue-600 transition-colors"
                    >
                      <FileText size={16} />
                      Generate Report
                    </button>
                    <button
                      onClick={() => onViewShift && onViewShift(shift)}
                      className="px-4 py-3 bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase hover:bg-slate-300 transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {selectedDate && selectedDateShifts.length === 0 && (
        <div className="bg-white rounded-[32px] border border-slate-200 p-16 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus size={32} className="text-slate-400" />
          </div>
          <h4 className="text-lg font-black text-slate-900 uppercase mb-2">
            No Shifts Scheduled
          </h4>
          <p className="text-slate-500 mb-6">
            {monthNames[currentDate.getMonth()]} {selectedDate}, {currentDate.getFullYear()}
          </p>
          <button className="px-8 py-3 bg-blue-500 text-white rounded-2xl text-sm font-black uppercase hover:bg-blue-600 transition-colors">
            Schedule New Shift
          </button>
        </div>
      )}
    </div>
  );
}

export default ComprehensiveCalendar;
