// ATC Platform - Website Integration Component
import React, { useState } from 'react';
import { 
  Globe, ExternalLink, FileText, Download, Eye, 
  CheckCircle, AlertCircle, RefreshCw, Layout
} from 'lucide-react';
import { generateCapabilityBrochure, downloadPDF, openPDFInNewTab } from '../../services/pdfService';

export function WebsiteIntegration() {
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState('2 hours ago');

  const handleOpenWebsite = () => {
    window.open('https://achievetogethercare.com.au', '_blank');
  };

  const handleGenerateBrochure = () => {
    const doc = generateCapabilityBrochure();
    downloadPDF(doc, 'ATC_Capability_Brochure_2026.pdf');
  };

  const handlePreviewBrochure = () => {
    const doc = generateCapabilityBrochure();
    openPDFInNewTab(doc);
  };

  const handleSync = async () => {
    setLoading(true);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSync('Just now');
    setLoading(false);
  };

  const websitePages = [
    { name: 'Home', url: '/', status: 'live', lastUpdate: '2 days ago' },
    { name: 'About Us', url: '/about', status: 'live', lastUpdate: '5 days ago' },
    { name: 'Services', url: '/services', status: 'live', lastUpdate: '1 week ago' },
    { name: 'Contact', url: '/contact', status: 'live', lastUpdate: '3 days ago' },
    { name: 'Referral Form', url: '/referral', status: 'live', lastUpdate: '1 day ago' },
    { name: 'Careers', url: '/careers', status: 'draft', lastUpdate: '2 weeks ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="atc-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="font-heading text-xl font-bold text-slate-900">Website Integration</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Manage achievetogethercare.com.au and marketing materials
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleSync}
              disabled={loading}
              className="atc-btn-secondary flex items-center gap-2"
              data-testid="sync-website-btn"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              Sync
            </button>
            <button
              onClick={handleOpenWebsite}
              className="atc-btn-primary flex items-center gap-2"
              data-testid="open-website-btn"
            >
              <Globe size={16} />
              Open Website
              <ExternalLink size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-emerald-600">6</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Pages Live</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-amber-600">1</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Draft</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-teal-600">247</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Visitors/Month</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-2xl font-bold text-blue-600">12</p>
          <p className="text-xs text-slate-500 uppercase tracking-wide">Referrals</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Website Preview */}
        <div className="lg:col-span-8 atc-card p-0 overflow-hidden">
          <div className="bg-[#0A1628] px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex-1 bg-white/10 rounded px-3 py-1 text-xs text-white/70">
              achievetogethercare.com.au
            </div>
            <button
              onClick={handleOpenWebsite}
              className="text-white/50 hover:text-white"
            >
              <ExternalLink size={14} />
            </button>
          </div>
          <div className="aspect-video bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-32 h-4 bg-white/30 rounded"></div>
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="w-12 h-4 bg-white/30 rounded"></div>
                <div className="w-12 h-4 bg-white/30 rounded"></div>
                <div className="w-12 h-4 bg-white/30 rounded"></div>
              </div>
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 text-center">
                <div className="w-64 h-8 bg-white/30 rounded mx-auto mb-4"></div>
                <div className="w-48 h-4 bg-white/30 rounded mx-auto"></div>
              </div>
            </div>
            <div className="text-center z-10">
              <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
                <span className="text-2xl font-bold text-teal-600">ATC</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-2">Achieve Together Care</h3>
              <p className="text-white/80">NDIS Provider | Sydney, NSW</p>
              <button
                onClick={handleOpenWebsite}
                className="mt-4 bg-white text-teal-600 px-6 py-2 rounded-lg font-semibold hover:bg-white/90 transition-colors"
              >
                Visit Website
              </button>
            </div>
          </div>
        </div>

        {/* Marketing Materials */}
        <div className="lg:col-span-4 atc-card" data-testid="marketing-materials">
          <h3 className="font-heading font-bold text-slate-900 text-lg mb-4">Marketing Materials</h3>
          
          <div className="space-y-3">
            {/* Capability Brochure */}
            <div className="bg-gradient-to-r from-teal-50 to-teal-100 rounded-lg p-4 border border-teal-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center text-white">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Capability Brochure</p>
                  <p className="text-xs text-slate-500">2026 Edition • PDF</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handlePreviewBrochure}
                  className="flex-1 text-xs py-2 bg-white border border-teal-200 rounded-md font-medium text-teal-700 hover:bg-teal-50"
                  data-testid="preview-brochure-btn"
                >
                  <Eye size={12} className="inline mr-1" />
                  Preview
                </button>
                <button
                  onClick={handleGenerateBrochure}
                  className="flex-1 text-xs py-2 bg-teal-500 text-white rounded-md font-medium hover:bg-teal-600"
                  data-testid="download-brochure-btn"
                >
                  <Download size={12} className="inline mr-1" />
                  Download
                </button>
              </div>
            </div>

            {/* Service Flyer */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center text-white">
                  <Layout size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Service Flyer</p>
                  <p className="text-xs text-slate-500">One-page summary • PDF</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-2 font-medium">Coming soon</p>
            </div>

            {/* Business Card */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                  <FileText size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">Digital Business Card</p>
                  <p className="text-xs text-slate-500">vCard format</p>
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-2 font-medium">Coming soon</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="atc-card overflow-hidden p-0">
        <div className="p-4 border-b border-slate-200">
          <h3 className="font-heading font-bold text-slate-900">Website Pages</h3>
        </div>
        <table className="atc-table">
          <thead>
            <tr>
              <th>Page</th>
              <th>URL</th>
              <th>Status</th>
              <th>Last Update</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {websitePages.map((page, idx) => (
              <tr key={idx}>
                <td className="font-medium text-slate-900">{page.name}</td>
                <td className="text-slate-500 font-mono text-sm">{page.url}</td>
                <td>
                  <span className={`atc-badge ${page.status === 'live' ? 'atc-badge-success' : 'atc-badge-warning'}`}>
                    {page.status === 'live' ? (
                      <><CheckCircle size={12} className="mr-1" /> Live</>
                    ) : (
                      <><AlertCircle size={12} className="mr-1" /> Draft</>
                    )}
                  </span>
                </td>
                <td className="text-slate-400 text-sm">{page.lastUpdate}</td>
                <td className="text-right">
                  <button
                    onClick={() => window.open(`https://achievetogethercare.com.au${page.url}`, '_blank')}
                    className="text-teal-600 hover:text-teal-700 text-sm font-medium"
                  >
                    View <ExternalLink size={12} className="inline ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* WordPress Embed Option */}
      <div className="atc-card bg-slate-50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white flex-shrink-0">
            <Globe size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-heading font-bold text-slate-900 mb-1">WordPress Integration</h3>
            <p className="text-sm text-slate-500 mb-3">
              Your website at achievetogethercare.com.au is powered by WordPress. 
              You can manage content directly through your WordPress admin panel.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => window.open('https://achievetogethercare.com.au/wp-admin', '_blank')}
                className="atc-btn-secondary text-sm"
              >
                Open WordPress Admin
              </button>
              <button
                onClick={handleOpenWebsite}
                className="atc-btn-secondary text-sm"
              >
                View Public Site
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WebsiteIntegration;
