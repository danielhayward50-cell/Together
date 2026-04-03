// ATC Platform - Premium Document Hub Component
// Stunning brochure-quality file management system
import React, { useState, useEffect } from 'react';
import {
  Folder, FileText, Calendar, DollarSign, ClipboardList, Users,
  FileSpreadsheet, FilePlus, Search, Filter, Upload, Download,
  ChevronRight, MoreVertical, Eye, Trash2, Clock, Star, Grid3X3,
  List, RefreshCw, HardDrive, FolderOpen, X, Check, AlertCircle,
  FileSignature, Phone, Building2, Archive, ArrowUpRight, Loader2
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Folder Configuration with beautiful colors
const FOLDER_CONFIG = [
  {
    id: 'appointments',
    name: 'Appointments',
    icon: Calendar,
    color: 'from-blue-500 to-indigo-500',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    description: 'Scheduled sessions & meetings'
  },
  {
    id: 'invoices',
    name: 'Invoices & Remittances',
    icon: DollarSign,
    color: 'from-emerald-500 to-teal-500',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    description: 'Financial documents & statements'
  },
  {
    id: 'shift-reports',
    name: 'Shift Reports',
    icon: ClipboardList,
    color: 'from-violet-500 to-purple-500',
    bgLight: 'bg-violet-50',
    textColor: 'text-violet-600',
    description: 'Daily support documentation'
  },
  {
    id: 'contacts',
    name: 'Contacts & BSB',
    icon: Users,
    color: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-600',
    description: 'Contact info & banking details'
  },
  {
    id: 'ndis-forms',
    name: 'NDIS Forms',
    icon: FileSignature,
    color: 'from-rose-500 to-pink-500',
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-600',
    description: 'Service agreements & plans'
  },
  {
    id: 'compliance',
    name: 'Compliance Docs',
    icon: Building2,
    color: 'from-cyan-500 to-blue-500',
    bgLight: 'bg-cyan-50',
    textColor: 'text-cyan-600',
    description: 'Certifications & audits'
  },
  {
    id: 'recent',
    name: 'Recent Files',
    icon: Clock,
    color: 'from-slate-500 to-slate-600',
    bgLight: 'bg-slate-50',
    textColor: 'text-slate-600',
    description: 'Recently accessed'
  },
  {
    id: 'bin',
    name: 'Bin',
    icon: Archive,
    color: 'from-red-400 to-red-500',
    bgLight: 'bg-red-50',
    textColor: 'text-red-500',
    description: 'Deleted files'
  }
];

// Mock files data
const MOCK_FILES = {
  appointments: [
    { id: 'apt1', name: 'Weekly_Support_April_2026.pdf', size: '245 KB', date: '2 hours ago', type: 'pdf', starred: true },
    { id: 'apt2', name: 'Plan_Review_Meeting.docx', size: '128 KB', date: '1 day ago', type: 'docx', starred: false },
    { id: 'apt3', name: 'Community_Access_Schedule.xlsx', size: '89 KB', date: '3 days ago', type: 'xlsx', starred: false },
  ],
  invoices: [
    { id: 'inv1', name: 'INV-2026-0048_Shaun_Case.pdf', size: '312 KB', date: 'Today', type: 'pdf', starred: true },
    { id: 'inv2', name: 'INV-2026-0047_Monthly.pdf', size: '298 KB', date: 'Yesterday', type: 'pdf', starred: false },
    { id: 'inv3', name: 'Remittance_March_2026.pdf', size: '156 KB', date: '5 days ago', type: 'pdf', starred: false },
    { id: 'inv4', name: 'Tax_Summary_Q1.xlsx', size: '423 KB', date: '1 week ago', type: 'xlsx', starred: true },
  ],
  'shift-reports': [
    { id: 'sr1', name: 'Shift_Report_03Apr2026_SC.pdf', size: '189 KB', date: 'Today', type: 'pdf', starred: false },
    { id: 'sr2', name: 'Daily_Notes_02Apr2026.pdf', size: '145 KB', date: 'Yesterday', type: 'pdf', starred: false },
    { id: 'sr3', name: 'Weekly_Summary_W14.pdf', size: '267 KB', date: '3 days ago', type: 'pdf', starred: true },
  ],
  contacts: [
    { id: 'con1', name: 'Client_Contact_List.xlsx', size: '78 KB', date: '1 day ago', type: 'xlsx', starred: true },
    { id: 'con2', name: 'BSB_Bank_Details.pdf', size: '45 KB', date: '2 weeks ago', type: 'pdf', starred: true },
    { id: 'con3', name: 'Emergency_Contacts.docx', size: '56 KB', date: '1 month ago', type: 'docx', starred: false },
  ],
  'ndis-forms': [
    { id: 'ndis1', name: 'Service_Agreement_SC_2026.pdf', size: '456 KB', date: 'Today', type: 'pdf', starred: true },
    { id: 'ndis2', name: 'Support_Plan_Template.docx', size: '234 KB', date: '1 week ago', type: 'docx', starred: false },
    { id: 'ndis3', name: 'Risk_Assessment_Form.pdf', size: '189 KB', date: '2 weeks ago', type: 'pdf', starred: false },
    { id: 'ndis4', name: 'Progress_Notes_Template.pdf', size: '167 KB', date: '1 month ago', type: 'pdf', starred: false },
  ],
  compliance: [
    { id: 'comp1', name: 'WWCC_Daniel_2026.pdf', size: '1.2 MB', date: '2 months ago', type: 'pdf', starred: true },
    { id: 'comp2', name: 'First_Aid_Certificate.pdf', size: '890 KB', date: '3 months ago', type: 'pdf', starred: true },
    { id: 'comp3', name: 'NDIS_Worker_Screening.pdf', size: '756 KB', date: '4 months ago', type: 'pdf', starred: true },
  ],
  recent: [
    { id: 'rec1', name: 'INV-2026-0048_Shaun_Case.pdf', size: '312 KB', date: 'Today', type: 'pdf', starred: true },
    { id: 'rec2', name: 'Service_Agreement_SC_2026.pdf', size: '456 KB', date: 'Today', type: 'pdf', starred: true },
    { id: 'rec3', name: 'Shift_Report_03Apr2026_SC.pdf', size: '189 KB', date: 'Today', type: 'pdf', starred: false },
  ],
  bin: [
    { id: 'bin1', name: 'Old_Invoice_Draft.pdf', size: '234 KB', date: '1 week ago', type: 'pdf', starred: false },
  ]
};

export function DocumentHub() {
  const [activeFolder, setActiveFolder] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState(MOCK_FILES);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());

  // Calculate total files and storage
  const totalFiles = Object.values(files).reduce((sum, folder) => sum + folder.length, 0);
  const totalStarred = Object.values(files).flat().filter(f => f.starred).length;

  // Handle sync
  const handleSync = async () => {
    setSyncing(true);
    // Simulate sync
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLastSync(new Date());
    setSyncing(false);
  };

  // Filter files by search
  const getFilteredFiles = (folderId) => {
    const folderFiles = files[folderId] || [];
    if (!searchQuery) return folderFiles;
    return folderFiles.filter(file => 
      file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Get file icon color
  const getFileTypeColor = (type) => {
    switch (type) {
      case 'pdf': return 'text-red-500 bg-red-50';
      case 'docx': return 'text-blue-500 bg-blue-50';
      case 'xlsx': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  // Render folder grid (main view)
  const renderFolderGrid = () => (
    <div className="space-y-6 animate-fade-in-up">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="atc-card text-center">
          <p className="text-3xl font-bold text-[#1B3B36] font-heading">{totalFiles}</p>
          <p className="text-xs font-semibold text-[#6B7270] uppercase tracking-wider mt-1">Total Files</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-3xl font-bold text-amber-500 font-heading">{totalStarred}</p>
          <p className="text-xs font-semibold text-[#6B7270] uppercase tracking-wider mt-1">Starred</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-3xl font-bold text-emerald-500 font-heading">2.4 GB</p>
          <p className="text-xs font-semibold text-[#6B7270] uppercase tracking-wider mt-1">Storage Used</p>
        </div>
        <div className="atc-card text-center">
          <p className="text-3xl font-bold text-violet-500 font-heading">12.6 GB</p>
          <p className="text-xs font-semibold text-[#6B7270] uppercase tracking-wider mt-1">Available</p>
        </div>
      </div>

      {/* Folder Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {FOLDER_CONFIG.map((folder, index) => {
          const FolderIcon = folder.icon;
          const fileCount = (files[folder.id] || []).length;
          
          return (
            <div
              key={folder.id}
              onClick={() => setActiveFolder(folder.id)}
              className="folder-card bento-item animate-fade-in-up group"
              data-testid={`folder-${folder.id}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${folder.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <FolderIcon className="w-7 h-7 text-white" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${folder.bgLight} ${folder.textColor}`}>
                  {fileCount} files
                </span>
              </div>
              
              <h3 className="font-heading font-bold text-lg text-[#1B3B36] mb-1 group-hover:text-[#C16E5A] transition-colors">
                {folder.name}
              </h3>
              <p className="text-sm text-[#6B7270]">{folder.description}</p>
              
              <div className="flex items-center gap-2 mt-4 text-sm font-semibold text-[#1B3B36] opacity-0 group-hover:opacity-100 transition-opacity">
                Open Folder <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Access - Recent Files */}
      <div className="atc-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-lg text-[#1B3B36] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#C16E5A]" />
            Quick Access
          </h3>
          <button 
            onClick={() => setActiveFolder('recent')}
            className="text-sm font-semibold text-[#1B3B36] hover:text-[#C16E5A] flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {files.recent.slice(0, 3).map((file) => (
            <div
              key={file.id}
              onClick={() => { setSelectedFile(file); setShowPreviewModal(true); }}
              className="flex items-center gap-3 p-4 bg-[#F4F5F4] rounded-xl hover:bg-[#E3E8E5] cursor-pointer transition-all group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getFileTypeColor(file.type)}`}>
                <FileText className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1B3B36] truncate text-sm group-hover:text-[#C16E5A] transition-colors">
                  {file.name}
                </p>
                <p className="text-xs text-[#6B7270]">{file.date} • {file.size}</p>
              </div>
              {file.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Render folder contents
  const renderFolderContents = () => {
    const folder = FOLDER_CONFIG.find(f => f.id === activeFolder);
    if (!folder) return null;

    const FolderIcon = folder.icon;
    const folderFiles = getFilteredFiles(activeFolder);

    return (
      <div className="space-y-6 animate-fade-in-up">
        {/* Folder Header */}
        <div className="atc-card">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveFolder(null)}
              className="p-2 hover:bg-[#F4F5F4] rounded-xl transition-colors"
              data-testid="back-to-folders"
            >
              <ChevronRight className="w-5 h-5 text-[#6B7270] rotate-180" />
            </button>
            
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${folder.color} flex items-center justify-center shadow-lg`}>
              <FolderIcon className="w-7 h-7 text-white" />
            </div>
            
            <div className="flex-1">
              <h2 className="font-heading font-bold text-2xl text-[#1B3B36]">{folder.name}</h2>
              <p className="text-sm text-[#6B7270]">{folderFiles.length} files • {folder.description}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowUploadModal(true)}
                className="atc-btn-primary flex items-center gap-2"
                data-testid="upload-file-btn"
              >
                <Upload className="w-4 h-4" />
                Upload
              </button>
            </div>
          </div>
        </div>

        {/* View Toggle & Search */}
        <div className="flex items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7270]" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="atc-input pl-11"
              data-testid="file-search"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#1B3B36] text-white' : 'hover:bg-[#F4F5F4]'}`}
            >
              <Grid3X3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#1B3B36] text-white' : 'hover:bg-[#F4F5F4]'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Files Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {folderFiles.map((file, index) => (
              <div
                key={file.id}
                onClick={() => { setSelectedFile(file); setShowPreviewModal(true); }}
                className="atc-card cursor-pointer group animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
                data-testid={`file-${file.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getFileTypeColor(file.type)}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="flex items-center gap-1">
                    {file.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                    <button className="p-1 hover:bg-[#F4F5F4] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4 text-[#6B7270]" />
                    </button>
                  </div>
                </div>
                
                <h4 className="font-semibold text-[#1B3B36] truncate mb-1 group-hover:text-[#C16E5A] transition-colors">
                  {file.name}
                </h4>
                <p className="text-xs text-[#6B7270]">{file.date} • {file.size}</p>
                
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8EAE9]">
                  <button className="flex-1 py-1.5 text-xs font-semibold text-[#1B3B36] hover:text-[#C16E5A] transition-colors flex items-center justify-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Preview
                  </button>
                  <button className="flex-1 py-1.5 text-xs font-semibold text-[#1B3B36] hover:text-[#C16E5A] transition-colors flex items-center justify-center gap-1">
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="atc-card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8EAE9] bg-[#F4F5F4]">
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#6B7270]">Name</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#6B7270]">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#6B7270]">Size</th>
                  <th className="text-right py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#6B7270]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {folderFiles.map((file) => (
                  <tr 
                    key={file.id} 
                    className="border-b border-[#E8EAE9] hover:bg-[#F4F5F4] cursor-pointer transition-colors"
                    onClick={() => { setSelectedFile(file); setShowPreviewModal(true); }}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getFileTypeColor(file.type)}`}>
                          <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[#1B3B36]">{file.name}</span>
                        {file.starred && <Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-[#6B7270]">{file.date}</td>
                    <td className="py-3 px-4 text-sm text-[#6B7270]">{file.size}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Eye className="w-4 h-4 text-[#6B7270]" />
                        </button>
                        <button className="p-2 hover:bg-white rounded-lg transition-colors">
                          <Download className="w-4 h-4 text-[#6B7270]" />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {folderFiles.length === 0 && (
          <div className="atc-card py-16 text-center">
            <Folder className="w-16 h-16 text-[#E8EAE9] mx-auto mb-4" />
            <h3 className="font-heading font-bold text-lg text-[#1B3B36] mb-2">No Files Yet</h3>
            <p className="text-[#6B7270] mb-4">Upload your first file to this folder</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="atc-btn-accent flex items-center gap-2 mx-auto"
            >
              <Upload className="w-4 h-4" />
              Upload File
            </button>
          </div>
        )}
      </div>
    );
  };

  // Upload Modal
  const renderUploadModal = () => showUploadModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pdf-overlay">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-fade-in-up">
        <div className="p-6 border-b border-[#E8EAE9]">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-xl text-[#1B3B36]">Upload Files</h3>
            <button
              onClick={() => setShowUploadModal(false)}
              className="p-2 hover:bg-[#F4F5F4] rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-[#6B7270]" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="border-2 border-dashed border-[#E8EAE9] rounded-2xl p-12 text-center hover:border-[#1B3B36] transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1B3B36] to-[#C16E5A] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-heading font-bold text-lg text-[#1B3B36] mb-2">
              Drag & drop files here
            </h4>
            <p className="text-[#6B7270] mb-4">or click to browse</p>
            <p className="text-xs text-[#6B7270]">Supports PDF, DOCX, XLSX up to 25MB</p>
          </div>
        </div>
        
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={() => setShowUploadModal(false)}
            className="flex-1 atc-btn-secondary"
          >
            Cancel
          </button>
          <button className="flex-1 atc-btn-primary">
            Upload
          </button>
        </div>
      </div>
    </div>
  );

  // File Preview Modal
  const renderPreviewModal = () => showPreviewModal && selectedFile && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pdf-overlay">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fade-in-up">
        {/* Preview Header */}
        <div className="p-4 border-b border-[#E8EAE9] flex items-center justify-between bg-[#F4F5F4]">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getFileTypeColor(selectedFile.type)}`}>
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-[#1B3B36]">{selectedFile.name}</h3>
              <p className="text-xs text-[#6B7270]">{selectedFile.size} • {selectedFile.date}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="atc-btn-secondary flex items-center gap-2">
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={() => { setShowPreviewModal(false); setSelectedFile(null); }}
              className="p-2 hover:bg-white rounded-xl transition-colors"
              data-testid="close-preview"
            >
              <X className="w-5 h-5 text-[#6B7270]" />
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="p-8 h-[60vh] flex items-center justify-center bg-[#FDFCFB]">
          <div className="text-center">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 ${getFileTypeColor(selectedFile.type)}`}>
              <FileText className="w-12 h-12" />
            </div>
            <h4 className="font-heading font-bold text-xl text-[#1B3B36] mb-2">Document Preview</h4>
            <p className="text-[#6B7270] mb-4">
              {selectedFile.type.toUpperCase()} document ready for download
            </p>
            <button className="atc-btn-accent flex items-center gap-2 mx-auto">
              <ArrowUpRight className="w-4 h-4" />
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6" data-testid="document-hub">
      {/* Main Header */}
      <div className="atc-card">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#1B3B36] to-[#2A5A53] rounded-2xl flex items-center justify-center shadow-lg">
              <HardDrive className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="font-heading font-bold text-2xl text-[#1B3B36]">Document Hub</h1>
              <p className="text-sm text-[#6B7270]">
                Organize and manage all your NDIS documents
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
              syncing ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              {syncing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Synced {lastSync.toLocaleTimeString()}
                </>
              )}
            </div>
            
            <button
              onClick={handleSync}
              disabled={syncing}
              className="atc-btn-primary flex items-center gap-2"
              data-testid="sync-docs-btn"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {activeFolder ? renderFolderContents() : renderFolderGrid()}
      
      {/* Modals */}
      {renderUploadModal()}
      {renderPreviewModal()}
    </div>
  );
}

export default DocumentHub;
