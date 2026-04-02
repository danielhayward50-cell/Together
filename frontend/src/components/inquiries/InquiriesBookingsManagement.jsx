// Inquiries & Bookings Management Component
import React, { useState, useEffect } from 'react';
import {
  MessageSquare, Calendar, Phone, Mail, User, Clock,
  CheckCircle, AlertCircle, Archive, ChevronRight, Filter,
  RefreshCw, Search, Eye, Check, X, Loader2
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export function InquiriesBookingsManagement() {
  const [activeTab, setActiveTab] = useState('inquiries');
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [inquiriesRes, bookingsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/contact/inquiries`),
        fetch(`${API_URL}/api/contact/bookings`),
        fetch(`${API_URL}/api/contact/stats`)
      ]);
      
      const inquiriesData = await inquiriesRes.json();
      const bookingsData = await bookingsRes.json();
      const statsData = await statsRes.json();
      
      setInquiries(inquiriesData);
      setBookings(bookingsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update inquiry status
  const updateInquiryStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/contact/inquiry/${id}/status?status=${status}`, {
        method: 'PATCH'
      });
      fetchData();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Update booking status
  const updateBookingStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/api/contact/booking/${id}/status?status=${status}`, {
        method: 'PATCH'
      });
      fetchData();
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Filter items
  const filteredInquiries = inquiries.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredBookings = bookings.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = searchTerm === '' || 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Status badge colors
  const getStatusBadge = (status, type) => {
    const colors = {
      new: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      contacted: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      converted: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      completed: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      archived: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[status] || colors.new;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const serviceLabels = {
    capacity_building: 'Capacity Building',
    daily_living: 'Daily Living Support',
    community_access: 'Community Access',
    plan_management: 'Plan Management',
    general_inquiry: 'General Inquiry'
  };

  return (
    <div className="space-y-6" data-testid="inquiries-bookings-management">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atc-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats?.inquiries?.total || 0}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Inquiries</p>
            </div>
          </div>
        </div>
        <div className="atc-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats?.inquiries?.new || 0}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">New Inquiries</p>
            </div>
          </div>
        </div>
        <div className="atc-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats?.bookings?.total || 0}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</p>
            </div>
          </div>
        </div>
        <div className="atc-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{stats?.bookings?.confirmed || 0}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs and Filters */}
      <div className="atc-card p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => { setActiveTab('inquiries'); setFilter('all'); }}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'inquiries' 
                  ? 'bg-teal-500 text-slate-900' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
              data-testid="tab-inquiries"
            >
              Inquiries ({inquiries.length})
            </button>
            <button
              onClick={() => { setActiveTab('bookings'); setFilter('all'); }}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'bookings' 
                  ? 'bg-teal-500 text-slate-900' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10'
              }`}
              data-testid="tab-bookings"
            >
              Bookings ({bookings.length})
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50"
                data-testid="search-input"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-teal-500/50"
              data-testid="filter-select"
            >
              <option value="all" className="bg-slate-800">All</option>
              {activeTab === 'inquiries' ? (
                <>
                  <option value="new" className="bg-slate-800">New</option>
                  <option value="contacted" className="bg-slate-800">Contacted</option>
                  <option value="converted" className="bg-slate-800">Converted</option>
                  <option value="archived" className="bg-slate-800">Archived</option>
                </>
              ) : (
                <>
                  <option value="pending" className="bg-slate-800">Pending</option>
                  <option value="confirmed" className="bg-slate-800">Confirmed</option>
                  <option value="completed" className="bg-slate-800">Completed</option>
                  <option value="cancelled" className="bg-slate-800">Cancelled</option>
                </>
              )}
            </select>
            <button
              onClick={fetchData}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              data-testid="refresh-btn"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="atc-card p-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="lg:col-span-2 space-y-3">
            {activeTab === 'inquiries' ? (
              filteredInquiries.length === 0 ? (
                <div className="atc-card p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No inquiries found</p>
                </div>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    onClick={() => setSelectedItem({ ...inquiry, type: 'inquiry' })}
                    className={`atc-card p-4 cursor-pointer transition-all hover:border-teal-500/30 ${
                      selectedItem?.id === inquiry.id ? 'border-teal-500/50 bg-teal-500/5' : ''
                    }`}
                    data-testid={`inquiry-${inquiry.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(inquiry.status)}`}>
                            {inquiry.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">{formatDate(inquiry.created_at)}</span>
                        </div>
                        <h4 className="font-bold text-white mb-1">{inquiry.name}</h4>
                        <p className="text-sm text-slate-400 line-clamp-2">{inquiry.message}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                ))
              )
            ) : (
              filteredBookings.length === 0 ? (
                <div className="atc-card p-8 text-center">
                  <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No bookings found</p>
                </div>
              ) : (
                filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedItem({ ...booking, type: 'booking' })}
                    className={`atc-card p-4 cursor-pointer transition-all hover:border-teal-500/30 ${
                      selectedItem?.id === booking.id ? 'border-teal-500/50 bg-teal-500/5' : ''
                    }`}
                    data-testid={`booking-${booking.id}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(booking.status)}`}>
                            {booking.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {booking.preferred_date} at {booking.preferred_time}
                          </span>
                        </div>
                        <h4 className="font-bold text-white mb-1">{booking.name}</h4>
                        <p className="text-sm text-teal-400">{serviceLabels[booking.service_type] || booking.service_type}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                ))
              )
            )}
          </div>

          {/* Detail Panel */}
          <div className="atc-card p-6">
            {selectedItem ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-white">
                    {selectedItem.type === 'inquiry' ? 'Inquiry Details' : 'Booking Details'}
                  </h3>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="p-2 bg-white/5 rounded-lg hover:bg-white/10"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-white font-bold">{selectedItem.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <a href={`mailto:${selectedItem.email}`} className="text-teal-400 hover:underline">
                        {selectedItem.email}
                      </a>
                    </div>
                    {selectedItem.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <a href={`tel:${selectedItem.phone}`} className="text-teal-400 hover:underline">
                          {selectedItem.phone}
                        </a>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400 text-sm">{formatDate(selectedItem.created_at)}</span>
                    </div>
                  </div>

                  {/* Booking specific info */}
                  {selectedItem.type === 'booking' && (
                    <div className="bg-white/5 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Appointment</p>
                      <p className="text-white font-bold">{selectedItem.preferred_date} at {selectedItem.preferred_time}</p>
                      <p className="text-teal-400">{serviceLabels[selectedItem.service_type] || selectedItem.service_type}</p>
                    </div>
                  )}

                  {/* Message/Notes */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      {selectedItem.type === 'inquiry' ? 'Message' : 'Notes'}
                    </p>
                    <p className="text-slate-300 text-sm">
                      {selectedItem.type === 'inquiry' ? selectedItem.message : (selectedItem.notes || 'No additional notes')}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Status</p>
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-bold border ${getStatusBadge(selectedItem.status)}`}>
                      {selectedItem.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Update Status</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.type === 'inquiry' ? (
                        <>
                          <button
                            onClick={() => updateInquiryStatus(selectedItem.id, 'contacted')}
                            className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg text-sm font-bold hover:bg-purple-500/30 flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" /> Contacted
                          </button>
                          <button
                            onClick={() => updateInquiryStatus(selectedItem.id, 'converted')}
                            className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold hover:bg-emerald-500/30 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" /> Converted
                          </button>
                          <button
                            onClick={() => updateInquiryStatus(selectedItem.id, 'archived')}
                            className="px-3 py-2 bg-slate-500/20 text-slate-400 rounded-lg text-sm font-bold hover:bg-slate-500/30 flex items-center gap-2"
                          >
                            <Archive className="w-4 h-4" /> Archive
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => updateBookingStatus(selectedItem.id, 'confirmed')}
                            className="px-3 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-bold hover:bg-emerald-500/30 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" /> Confirm
                          </button>
                          <button
                            onClick={() => updateBookingStatus(selectedItem.id, 'completed')}
                            className="px-3 py-2 bg-slate-500/20 text-slate-400 rounded-lg text-sm font-bold hover:bg-slate-500/30 flex items-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" /> Complete
                          </button>
                          <button
                            onClick={() => updateBookingStatus(selectedItem.id, 'cancelled')}
                            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-bold hover:bg-red-500/30 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4">
                  <Eye className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-400 font-bold">Select an item to view details</p>
                <p className="text-slate-600 text-sm mt-1">Click on any inquiry or booking</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InquiriesBookingsManagement;
