// ATC Platform - Invoice Management Component
import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Eye, Send, Check, Clock, AlertCircle,
  Loader2, DollarSign, Calendar, User, X, Download, Search
} from 'lucide-react';
import { invoicesAPI, clientsAPI } from '../../services/api';
import { generateInvoicePDF, downloadPDF, openPDFInNewTab } from '../../services/pdfService';

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generateForm, setGenerateForm] = useState({
    client_id: '',
    period: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [invoicesData, clientsData] = await Promise.all([
        invoicesAPI.getAll(),
        clientsAPI.getAll()
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInvoice = async (invoiceId) => {
    try {
      await invoicesAPI.send(invoiceId);
      fetchData();
      alert('Invoice sent successfully!');
    } catch (error) {
      console.error('Error sending invoice:', error);
      alert('Error sending invoice');
    }
  };

  const handleMarkPaid = async (invoiceId) => {
    try {
      await invoicesAPI.markPaid(invoiceId);
      fetchData();
      alert('Invoice marked as paid!');
    } catch (error) {
      console.error('Error marking invoice as paid:', error);
      alert('Error updating invoice');
    }
  };

  const handleDownloadPDF = (invoice) => {
    const doc = generateInvoicePDF(invoice);
    downloadPDF(doc, `${invoice.invoice_no}_${invoice.client?.replace(/\s+/g, '_')}.pdf`);
  };

  const handlePreviewPDF = (invoice) => {
    const doc = generateInvoicePDF(invoice);
    openPDFInNewTab(doc);
  };

  const handleGenerateInvoice = async (e) => {
    e.preventDefault();
    try {
      await invoicesAPI.generateFromShifts(generateForm.client_id, generateForm.period);
      fetchData();
      setShowGenerateModal(false);
      alert('Invoice generated successfully!');
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert(error.response?.data?.detail || 'Error generating invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-600';
      case 'sent': return 'bg-blue-100 text-blue-600';
      case 'overdue': return 'bg-red-100 text-red-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid': return <Check size={14} />;
      case 'sent': return <Send size={14} />;
      case 'overdue': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
            Invoices
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {invoices.length} invoice{invoices.length !== 1 ? 's' : ''} • 
            {invoices.filter(i => i.status === 'draft' || i.status === 'pending').length} pending
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-2xl font-bold text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg shadow-purple-500/30 transition-all"
          data-testid="generate-invoice-btn"
        >
          <Plus size={18} />
          Generate Invoice
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 uppercase mb-1">Total Invoices</p>
          <p className="text-2xl font-black text-slate-900">{invoices.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 uppercase mb-1">Draft</p>
          <p className="text-2xl font-black text-slate-500">
            {invoices.filter(i => i.status === 'draft').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 uppercase mb-1">Sent</p>
          <p className="text-2xl font-black text-blue-600">
            {invoices.filter(i => i.status === 'sent').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-4">
          <p className="text-xs text-slate-400 uppercase mb-1">Paid</p>
          <p className="text-2xl font-black text-emerald-600">
            {invoices.filter(i => i.status === 'paid').length}
          </p>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-[32px] border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase">Invoice #</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase">Client</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase">Period</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase">Amount</th>
              <th className="text-left px-6 py-4 text-xs font-black text-slate-400 uppercase">Status</th>
              <th className="text-right px-6 py-4 text-xs font-black text-slate-400 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr 
                key={invoice.invoice_id}
                className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                data-testid={`invoice-row-${invoice.invoice_id}`}
              >
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{invoice.invoice_no}</p>
                  <p className="text-xs text-slate-400">{invoice.date}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{invoice.client}</p>
                  <p className="text-xs text-slate-400">NDIS: {invoice.ndis_number}</p>
                </td>
                <td className="px-6 py-4 text-slate-600">{invoice.period}</td>
                <td className="px-6 py-4">
                  <p className="font-black text-slate-900">${invoice.total_payable?.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">{invoice.total_hours}h + {invoice.total_km}km</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase ${getStatusColor(invoice.status)}`}>
                    {getStatusIcon(invoice.status)}
                    {invoice.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedInvoice(invoice)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye size={16} className="text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleDownloadPDF(invoice)}
                      className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                      title="Download PDF"
                      data-testid={`download-invoice-${invoice.invoice_id}`}
                    >
                      <Download size={16} className="text-teal-500" />
                    </button>
                    {invoice.status === 'draft' && (
                      <button
                        onClick={() => handleSendInvoice(invoice.invoice_id)}
                        className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Send"
                      >
                        <Send size={16} className="text-blue-500" />
                      </button>
                    )}
                    {invoice.status === 'sent' && (
                      <button
                        onClick={() => handleMarkPaid(invoice.invoice_id)}
                        className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Mark Paid"
                      >
                        <Check size={16} className="text-emerald-500" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <div className="p-16 text-center">
            <FileText size={48} className="text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-600 mb-2">No Invoices</h3>
            <p className="text-slate-400">Generate your first invoice from completed shifts</p>
          </div>
        )}
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{selectedInvoice.invoice_no}</h2>
                  <p className="text-slate-500">{selectedInvoice.period}</p>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {/* Invoice Info */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-2">Billed To</p>
                  <p className="font-bold text-slate-900 text-lg">{selectedInvoice.client}</p>
                  <p className="text-slate-500">NDIS: {selectedInvoice.ndis_number}</p>
                  <p className="text-slate-500">Plan Manager: {selectedInvoice.funding_manager || 'N/A'}</p>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4">
                  <p className="text-xs text-slate-400 uppercase mb-2">Invoice Details</p>
                  <p className="text-slate-600">Date: {selectedInvoice.date}</p>
                  <p className="text-slate-600">Worker: {selectedInvoice.worker}</p>
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase mt-2 ${getStatusColor(selectedInvoice.status)}`}>
                    {selectedInvoice.status}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              <div className="mb-8">
                <h3 className="text-lg font-black text-slate-900 uppercase mb-4">Line Items</h3>
                <div className="bg-slate-50 rounded-2xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Date</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">Description</th>
                        <th className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase">NDIS Code</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Qty</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Rate</th>
                        <th className="text-right px-4 py-3 text-xs font-bold text-slate-400 uppercase">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.lines?.map((line, idx) => (
                        <tr key={idx} className="border-b border-slate-100 last:border-0">
                          <td className="px-4 py-3 text-sm text-slate-600">{line.date}</td>
                          <td className="px-4 py-3 text-sm text-slate-900">{line.description}</td>
                          <td className="px-4 py-3 text-xs text-slate-400 font-mono">{line.ndis_code}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 text-right">{line.qty} {line.unit}</td>
                          <td className="px-4 py-3 text-sm text-slate-600 text-right">${line.rate}</td>
                          <td className="px-4 py-3 text-sm font-bold text-slate-900 text-right">${line.total?.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totals */}
              <div className="bg-purple-50 rounded-2xl p-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Total Hours</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.total_hours}h</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Total KM</span>
                  <span className="font-bold text-slate-900">{selectedInvoice.total_km}km</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-slate-600">Travel Cost</span>
                  <span className="font-bold text-slate-900">${selectedInvoice.total_travel?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-purple-200 mt-4">
                  <span className="text-lg font-black text-slate-900 uppercase">Total Payable</span>
                  <span className="text-2xl font-black text-purple-600">${selectedInvoice.total_payable?.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleDownloadPDF(selectedInvoice)}
                  className="flex-1 bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                  data-testid="download-invoice-pdf"
                >
                  <Download size={18} />
                  Download PDF
                </button>
                {selectedInvoice.status === 'draft' && (
                  <button
                    onClick={() => { handleSendInvoice(selectedInvoice.invoice_id); setSelectedInvoice(null); }}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Send Invoice
                  </button>
                )}
                {selectedInvoice.status === 'sent' && (
                  <button
                    onClick={() => { handleMarkPaid(selectedInvoice.invoice_id); setSelectedInvoice(null); }}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Mark as Paid
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generate Invoice Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[40px] max-w-md w-full shadow-2xl">
            <form onSubmit={handleGenerateInvoice} className="p-8">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-6">
                Generate Invoice
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Client</label>
                  <select
                    value={generateForm.client_id}
                    onChange={(e) => setGenerateForm({ ...generateForm, client_id: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    required
                  >
                    <option value="">Select client...</option>
                    {clients.map(client => (
                      <option key={client.client_id} value={client.client_id}>
                        {client.name} (NDIS: {client.ndis_number})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Period</label>
                  <input
                    type="text"
                    value={generateForm.period}
                    onChange={(e) => setGenerateForm({ ...generateForm, period: e.target.value })}
                    placeholder="e.g., February 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                    required
                  />
                </div>
              </div>

              <p className="text-sm text-slate-400 mt-4">
                This will generate an invoice from all completed shifts for the selected client.
              </p>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-2xl font-bold transition-colors"
                >
                  Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceManagement;
