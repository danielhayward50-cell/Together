// ATC Platform - Reports Management Component
import React, { useState, useEffect } from 'react';
import { 
  FileText, Eye, Calendar, Clock, User, MapPin,
  Loader2, X, Smile, Target, Activity
} from 'lucide-react';
import { reportsAPI } from '../../services/api';

export function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const data = await reportsAPI.getAll({ limit: 50 });
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'incident': return 'bg-red-100 text-red-600';
      case 'weekly': return 'bg-blue-100 text-blue-600';
      case 'monthly': return 'bg-purple-100 text-purple-600';
      default: return 'bg-emerald-100 text-emerald-600';
    }
  };

  const filteredReports = filter === 'all' 
    ? reports 
    : reports.filter(r => r.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Shift Reports
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {reports.length} report{reports.length !== 1 ? 's' : ''} submitted
          </p>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
          {['all', 'daily', 'weekly', 'incident'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors capitalize ${
                filter === type 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map(report => (
          <div
            key={report.report_id}
            className="bg-white rounded-[32px] border border-slate-200 p-6 hover:shadow-lg transition-all cursor-pointer group"
            onClick={() => setSelectedReport(report)}
            data-testid={`report-card-${report.report_id}`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-black text-slate-900 mb-1">{report.title}</h3>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {report.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {report.shift_time || `${report.hours}h`}
                  </span>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${getTypeColor(report.type)}`}>
                {report.type}
              </span>
            </div>

            {/* Participant Info */}
            <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {report.participant?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <p className="font-bold text-slate-900">{report.participant}</p>
                <p className="text-xs text-slate-400">NDIS: {report.ndis_number || 'N/A'}</p>
              </div>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-slate-500">
                <User size={14} />
                <span>{report.author}</span>
              </div>
              {report.km > 0 && (
                <div className="flex items-center gap-1 text-slate-500">
                  <MapPin size={14} />
                  <span>{report.km}km</span>
                </div>
              )}
              {report.mood && (
                <div className="flex items-center gap-1 text-slate-500">
                  <Smile size={14} />
                  <span>{report.mood}</span>
                </div>
              )}
            </div>

            {/* Preview of first section */}
            {report.sections && report.sections.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase mb-1">{report.sections[0].title}</p>
                <p className="text-sm text-slate-600 line-clamp-2">{report.sections[0].content}</p>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <div className="col-span-full bg-slate-50 rounded-[32px] p-16 text-center">
            <FileText size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No Reports</h3>
            <p className="text-slate-400">
              {filter === 'all' 
                ? 'Complete a shift to create your first report' 
                : `No ${filter} reports found`}
            </p>
          </div>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mb-3 ${getTypeColor(selectedReport.type)}`}>
                    {selectedReport.type} Report
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">{selectedReport.title}</h2>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {/* Report Meta */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Date</p>
                  <p className="font-bold text-slate-900">{selectedReport.date}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Shift Time</p>
                  <p className="font-bold text-slate-900">{selectedReport.shift_time || `${selectedReport.hours}h`}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">KM Travelled</p>
                  <p className="font-bold text-slate-900">{selectedReport.km || 0}km</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-1">Status</p>
                  <p className="font-bold text-emerald-600 capitalize">{selectedReport.status}</p>
                </div>
              </div>

              {/* Participant Info */}
              <div className="bg-blue-50 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-lg">
                    {selectedReport.participant?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-xs text-blue-600 uppercase font-bold mb-1">Participant</p>
                    <p className="font-black text-slate-900 text-lg">{selectedReport.participant}</p>
                    <p className="text-slate-500">NDIS: {selectedReport.ndis_number || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Mood */}
              {selectedReport.mood && (
                <div className="bg-amber-50 rounded-2xl p-4 mb-6 flex items-center gap-3">
                  <Smile size={24} className="text-amber-500" />
                  <div>
                    <p className="text-xs text-amber-600 uppercase font-bold">Participant Mood</p>
                    <p className="font-bold text-slate-900">{selectedReport.mood}</p>
                  </div>
                </div>
              )}

              {/* Report Sections */}
              <div className="space-y-6">
                {selectedReport.sections?.map((section, idx) => (
                  <div key={idx} className="border-l-4 border-teal-500 pl-4">
                    <h3 className="text-lg font-black text-slate-900 uppercase mb-2 flex items-center gap-2">
                      {section.title === 'Summary' && <Activity size={18} />}
                      {section.title === 'Activities' && <Target size={18} />}
                      {section.title}
                    </h3>
                    <p className="text-slate-600 whitespace-pre-wrap">{section.content}</p>
                  </div>
                ))}
                
                {(!selectedReport.sections || selectedReport.sections.length === 0) && (
                  <p className="text-slate-400 text-center py-8">No report sections</p>
                )}
              </div>

              {/* Author */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <User size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Written by</p>
                    <p className="font-bold text-slate-900">{selectedReport.author}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 py-3 rounded-2xl font-bold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportManagement;
