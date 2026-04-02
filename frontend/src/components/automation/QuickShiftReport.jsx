import React, { useState } from 'react';
import { FileText, Calendar, MapPin, Clock, Sparkles, Download, X } from 'lucide-react';
import { CLIENTS, SHIFTS } from '../../lib/data';

export function QuickShiftReport({ prefilledShift, onClose }) {
  const [formData, setFormData] = useState({
    date: prefilledShift?.date || new Date().toISOString().split('T')[0],
    participant: prefilledShift?.participant || '',
    startTime: prefilledShift?.startTime || '09:00',
    endTime: prefilledShift?.endTime || '15:00',
    km: prefilledShift?.km || 15,
    mood: '',
    notes: '',
  });

  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const hours = formData.startTime && formData.endTime
    ? calculateHours(formData.startTime, formData.endTime)
    : 0;

  function calculateHours(start, end) {
    const [startH, startM] = start.split(':').map(Number);
    const [endH, endM] = end.split(':').map(Number);
    const startMins = startH * 60 + startM;
    const endMins = endH * 60 + endM;
    return ((endMins - startMins) / 60).toFixed(1);
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGenerate = async () => {
    setGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setGenerating(false);
    setGenerated(true);
    
    // In real implementation, this would call an AI API
    alert(
      `✅ AI Report Generated!\n\n` +
      `Participant: ${formData.participant}\n` +
      `Date: ${formData.date}\n` +
      `Hours: ${hours}\n` +
      `Travel: ${formData.km}km\n\n` +
      `AI has expanded your notes into a comprehensive NDIS-compliant shift report with goal evidence and professional language.\n\n` +
      `PDF ready for download and auto-sync to Google Drive!`
    );
  };

  const handleDownload = () => {
    alert('📄 Downloading PDF report...\n\nReport will be saved to:\n01 - Participants > ' + formData.participant + ' > Clinical Reports');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-[32px] p-8 text-white">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <Sparkles size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tight">
                Quick Shift Report
              </h3>
              <p className="text-sm font-bold text-white/80 mt-1 uppercase tracking-wide">
                AI-Powered Clinical Documentation
              </p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>
        <p className="text-white/90 text-sm">
          Enter brief notes below. Our AI will expand them into professional NDIS-compliant documentation 
          with goal evidence and support details.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Date */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              <Calendar size={14} />
              Shift Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Participant */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              Participant
            </label>
            <select
              name="participant"
              value={formData.participant}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
            >
              <option value="">Select participant...</option>
              {CLIENTS.map(client => (
                <option key={client.id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </select>
          </div>

          {/* Start Time */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              <Clock size={14} />
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* End Time */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              <Clock size={14} />
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* KM */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              <MapPin size={14} />
              Travel Distance (KM)
            </label>
            <input
              type="number"
              name="km"
              value={formData.km}
              onChange={handleChange}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>

          {/* Hours Display */}
          <div>
            <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
              Total Hours
            </label>
            <div className="w-full bg-teal-50 border-2 border-teal-200 rounded-2xl px-5 py-4 flex items-center justify-between">
              <span className="text-sm font-black text-teal-900 uppercase">Auto-Calculated</span>
              <span className="text-2xl font-black text-teal-600">{hours}h</span>
            </div>
          </div>
        </div>

        {/* Mood/Engagement */}
        <div className="mb-8">
          <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            Mood & Engagement
          </label>
          <input
            type="text"
            name="mood"
            value={formData.mood}
            onChange={handleChange}
            placeholder="e.g., Happy, cooperative, engaged..."
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all"
          />
        </div>

        {/* Brief Notes */}
        <div>
          <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
            <FileText size={14} />
            Brief Shift Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="What happened today? (brief notes — AI will expand into professional documentation)"
            rows={6}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none"
          />
          <p className="text-xs text-slate-400 mt-2 italic">
            💡 Tip: Just write quick notes. AI will expand with NDIS goals, professional language, and proper formatting.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        {onClose && (
          <button
            onClick={onClose}
            className="flex-1 py-5 text-sm font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 rounded-2xl transition-all"
          >
            Cancel
          </button>
        )}
        <button
          onClick={handleGenerate}
          disabled={!formData.participant || !formData.notes || generating}
          className={`flex-[2] py-5 text-sm font-black uppercase rounded-2xl transition-all tracking-wider ${
            generating
              ? 'bg-purple-400 text-white cursor-wait'
              : !formData.participant || !formData.notes
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-2xl'
          }`}
        >
          {generating ? (
            <span className="flex items-center justify-center gap-3">
              <Sparkles size={20} className="animate-spin" />
              AI Generating Report...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-3">
              <Sparkles size={20} />
              Generate with AI
            </span>
          )}
        </button>
        {generated && (
          <button
            onClick={handleDownload}
            className="px-6 py-5 bg-emerald-500 text-white rounded-2xl text-sm font-black uppercase hover:bg-emerald-600 transition-all"
          >
            <Download size={20} />
          </button>
        )}
      </div>
    </div>
  );
}

export default QuickShiftReport;
