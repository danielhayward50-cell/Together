import React from 'react';
import Header from '../components/layout/Header';
import { gDriveFolders } from '../mock/mockData';

const GDriveSync = () => {
  const handleForceSync = () => {
    alert(
      "WEDNESDAY INTEGRITY SWEEP INITIATED:\n- Validating March Invoices...\n- Running Roster Cross-Check...\n- Syncing to Google Drive Folder 02 – Finance"
    );
  };

  return (
    <>
      <Header
        title="Master Integrity Data Hub"
        subtitle="Master G-Drive Sync: ACTIVE"
      />
      <div className="flex-1 overflow-y-auto p-12 space-y-12">
        {/* Hero Banner */}
        <div className="bg-teal-50 border-[6px] border-teal-100 rounded-[72px] p-16 flex items-center justify-between shadow-2xl relative overflow-hidden group">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white opacity-40 rounded-full transition-transform group-hover:scale-110"></div>
          
          <div className="flex items-center gap-10 relative">
            <div className="w-28 h-28 bg-white rounded-[40px] shadow-inner flex items-center justify-center text-6xl group-hover:-rotate-12 transition-transform">
              🧬
            </div>
            <div>
              <h4 className="text-4xl font-black text-teal-950 tracking-tighter italic">
                Wednesday Master Sync
              </h4>
              <p className="text-sm text-teal-600 font-bold uppercase tracking-[0.3em] mt-3">
                Roster Integrity & Billing Loop: ACTIVE
              </p>
            </div>
          </div>
          
          <button
            onClick={handleForceSync}
            className="bg-[#0A1628] text-white px-12 py-6 rounded-[32px] font-black shadow-2xl hover:scale-105 hover:bg-teal-700 transition-all uppercase tracking-widest text-xs relative"
          >
            FORCE INTEGRITY SWEEP
          </button>
        </div>

        {/* G-Drive Folders */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {gDriveFolders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white p-12 rounded-[64px] border border-slate-100 shadow-sm relative group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-6 mb-8">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-3xl">
                  {folder.icon}
                </div>
                <h5 className="text-lg font-black text-slate-900 uppercase tracking-tighter italic">
                  {folder.name}
                </h5>
              </div>
              
              <div className="space-y-3 pl-20">
                {folder.subfolders.map((subfolder, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-sm font-bold text-slate-400 uppercase italic"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full bg-${folder.color}-500`}></div>
                    {subfolder}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default GDriveSync;
