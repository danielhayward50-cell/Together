import React from 'react';

const Header = ({ title, subtitle, actionButton }) => {
  return (
    <header className="h-24 bg-white border-b border-slate-200 flex items-center justify-between px-10 flex-shrink-0 z-40">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
          {title}
        </h2>
        <div className="flex items-center gap-3 mt-1">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
            {subtitle}
          </p>
        </div>
      </div>

      {actionButton && (
        <button
          onClick={actionButton.onClick}
          className="bg-[#0A1628] text-white px-8 py-4 rounded-[24px] text-[11px] font-black hover:bg-teal-600 transition-all shadow-2xl shadow-slate-300 uppercase tracking-widest"
        >
          {actionButton.label}
        </button>
      )}
    </header>
  );
};

export default Header;
