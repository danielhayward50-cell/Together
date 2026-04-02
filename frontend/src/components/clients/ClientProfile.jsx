// Enhanced Client Profile Component - Impressive Detail View
import React, { useState, useEffect } from 'react';
import {
  User, Phone, Mail, MapPin, Calendar, Target, Heart,
  FileText, Clock, Shield, AlertTriangle, ChevronRight,
  Edit2, Download, Plus, CheckCircle, XCircle, Activity,
  Briefcase, Users, Star, TrendingUp, Award, Loader2
} from 'lucide-react';

export function ClientProfile({ client, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  if (!client) return null;

  // Calculate goal progress (mock)
  const goalProgress = client.goals?.length > 0 
    ? Math.floor(Math.random() * 40 + 60) 
    : 0;

  // Mock recent activities
  const recentActivities = [
    { type: 'shift', description: 'Support shift completed', date: '2 hours ago', status: 'completed' },
    { type: 'goal', description: 'Goal progress updated', date: '1 day ago', status: 'success' },
    { type: 'document', description: 'Service agreement signed', date: '3 days ago', status: 'completed' },
    { type: 'note', description: 'Progress notes added', date: '5 days ago', status: 'info' },
  ];

  // Mock upcoming appointments
  const upcomingAppointments = [
    { title: 'Weekly Support Session', date: 'Tomorrow, 10:00 AM', worker: 'Sarah Johnson' },
    { title: 'Plan Review Meeting', date: 'Next Monday, 2:00 PM', worker: 'Team' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto" data-testid="client-profile-modal">
      <div className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-5xl my-8 shadow-2xl">
        {/* Header with gradient */}
        <div className="relative h-48 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 rounded-t-3xl overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-white/5 rounded-full"></div>
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-xl flex items-center justify-center transition-colors"
            data-testid="close-profile"
          >
            <XCircle className="w-6 h-6 text-white" />
          </button>

          {/* Client avatar and basic info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end gap-6">
            <div className="w-28 h-28 bg-slate-800 border-4 border-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-4xl font-black text-teal-400">
                {client.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 pb-2">
              <h2 className="text-3xl font-black text-white drop-shadow-lg">{client.name}</h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold text-white backdrop-blur-sm">
                  NDIS: {client.ndis_number}
                </span>
                <span className="px-3 py-1 bg-emerald-500/30 rounded-full text-sm font-bold text-emerald-200 backdrop-blur-sm">
                  Active Participant
                </span>
              </div>
            </div>
            <button
              onClick={() => onEdit(client)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold flex items-center gap-2 backdrop-blur-sm transition-colors"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-white/10 px-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'text-teal-400 border-teal-400'
                    : 'text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Contact & Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="atc-card p-4 text-center">
                    <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-6 h-6 text-teal-400" />
                    </div>
                    <p className="text-2xl font-black text-white">{client.weekly_hours || 0}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Weekly Hours</p>
                  </div>
                  <div className="atc-card p-4 text-center">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <Target className="w-6 h-6 text-purple-400" />
                    </div>
                    <p className="text-2xl font-black text-white">{client.goals?.length || 0}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Goals</p>
                  </div>
                  <div className="atc-card p-4 text-center">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                      <TrendingUp className="w-6 h-6 text-emerald-400" />
                    </div>
                    <p className="text-2xl font-black text-white">{goalProgress}%</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Goal Progress</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="atc-card p-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" /> Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Phone</p>
                        <p className="text-white font-bold">{client.phone || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Mail className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Email</p>
                        <p className="text-white font-bold text-sm">{client.email || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl md:col-span-2">
                      <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Address</p>
                        <p className="text-white font-bold">{client.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="atc-card p-6 border-amber-500/20">
                  <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Emergency Contact
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Contact Name</p>
                        <p className="text-white font-bold">{client.emergency_contact || 'Not provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-amber-500/10 rounded-xl">
                      <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <Phone className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider">Contact Phone</p>
                        <p className="text-white font-bold">{client.emergency_phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* NDIS Plan Details */}
                <div className="atc-card p-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> NDIS Plan Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Funding Type</p>
                      <p className="text-white font-bold">{client.funding_type || 'Plan Managed'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Plan Manager</p>
                      <p className="text-white font-bold">{client.plan_manager || 'Not assigned'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Weekly Hours</p>
                      <p className="text-white font-bold">{client.weekly_hours || 0} hours</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Activity & Appointments */}
              <div className="space-y-6">
                {/* Upcoming Appointments */}
                <div className="atc-card p-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> Upcoming
                  </h3>
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt, index) => (
                      <div key={index} className="p-3 bg-white/5 rounded-xl">
                        <p className="text-white font-bold text-sm">{apt.title}</p>
                        <p className="text-teal-400 text-xs mt-1">{apt.date}</p>
                        <p className="text-slate-500 text-xs">with {apt.worker}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="atc-card p-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4" /> Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'completed' ? 'bg-emerald-400' :
                          activity.status === 'success' ? 'bg-teal-400' :
                          'bg-slate-500'
                        }`}></div>
                        <div>
                          <p className="text-white text-sm">{activity.description}</p>
                          <p className="text-slate-500 text-xs">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="atc-card p-6">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
                  <div className="space-y-2">
                    <button className="w-full p-3 bg-teal-500/20 hover:bg-teal-500/30 rounded-xl text-teal-400 font-bold text-sm flex items-center gap-2 transition-colors">
                      <FileText className="w-4 h-4" /> Generate Report
                    </button>
                    <button className="w-full p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-xl text-purple-400 font-bold text-sm flex items-center gap-2 transition-colors">
                      <Calendar className="w-4 h-4" /> Schedule Session
                    </button>
                    <button className="w-full p-3 bg-blue-500/20 hover:bg-blue-500/30 rounded-xl text-blue-400 font-bold text-sm flex items-center gap-2 transition-colors">
                      <Download className="w-4 h-4" /> Export Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'goals' && (
            <div className="space-y-6">
              {/* Goal Progress Overview */}
              <div className="atc-card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-black text-white">Goal Progress</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-black text-teal-400">{goalProgress}%</span>
                    <span className="text-slate-500 text-sm">Overall</span>
                  </div>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full transition-all duration-1000"
                    style={{ width: `${goalProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Goals List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {client.goals && client.goals.length > 0 ? (
                  client.goals.map((goal, index) => (
                    <div key={index} className="atc-card p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-white font-bold mb-2">{goal}</h4>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-slate-500">Progress:</span>
                            <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-teal-500 rounded-full"
                                style={{ width: `${Math.floor(Math.random() * 50 + 30)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="md:col-span-2 atc-card p-12 text-center">
                    <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No goals set yet</p>
                    <p className="text-slate-600 text-sm mt-1">Add goals to track participant progress</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {['Service Agreement', 'Support Plan', 'Risk Assessment', 'Progress Reports', 'Incident Reports'].map((doc, index) => (
                  <div key={index} className="atc-card p-6 hover:border-teal-500/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold">{doc}</p>
                        <p className="text-slate-500 text-xs">Last updated: 2 days ago</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="atc-card p-6">
              <div className="space-y-6">
                {[...Array(10)].map((_, index) => (
                  <div key={index} className="flex items-start gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      index % 4 === 0 ? 'bg-emerald-500/20' :
                      index % 4 === 1 ? 'bg-blue-500/20' :
                      index % 4 === 2 ? 'bg-purple-500/20' :
                      'bg-amber-500/20'
                    }`}>
                      {index % 4 === 0 ? <CheckCircle className="w-5 h-5 text-emerald-400" /> :
                       index % 4 === 1 ? <FileText className="w-5 h-5 text-blue-400" /> :
                       index % 4 === 2 ? <Calendar className="w-5 h-5 text-purple-400" /> :
                       <Activity className="w-5 h-5 text-amber-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-bold">
                        {index % 4 === 0 ? 'Support session completed' :
                         index % 4 === 1 ? 'Progress notes updated' :
                         index % 4 === 2 ? 'Appointment scheduled' :
                         'Goal milestone achieved'}
                      </p>
                      <p className="text-slate-500 text-sm">{index + 1} day{index > 0 ? 's' : ''} ago</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ClientProfile;
