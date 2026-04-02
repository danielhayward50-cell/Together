import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'owner', path: '/', label: 'Business Command', icon: '📈', section: 'Management' },
    { id: 'clinical', path: '/clinical', label: 'Clinical Hub', icon: '🩺', section: 'Management' },
    { id: 'finance', path: '/finance', label: 'Payroll & Billing', icon: '💰', section: 'Operations' },
    { id: 'sync', path: '/sync', label: 'Data Hub Sync', icon: '🔄', section: 'Operations' }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    alert('FORCE LOGOUT - Session terminated');
  };

  return (
    <aside className="w-72 flex flex-col flex-shrink-0 shadow-2xl z-50" style={{
      background: 'linear-gradient(135deg, #0A1628 0%, #1A2B44 100%)'
    }}>
      {/* Logo */}
      <div className="p-8 border-b border-white/5 flex items-center gap-4">
        <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center text-[#0A1628] font-black text-sm shadow-xl">
          ATC
        </div>
        <div>
          <p className="text-white font-black text-lg tracking-tighter uppercase leading-none">
            Achieve Together
          </p>
          <p className="text-teal-400 text-[10px] font-bold uppercase tracking-widest mt-1">
            Enterprise OS 18.0
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
        {['Management', 'Operations'].map((section) => (
          <div key={section}>
            <p className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4 mb-2 mt-6 first:mt-0">
              {section}
            </p>
            {navItems
              .filter((item) => item.section === section)
              .map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all group relative ${
                    isActive(item.path)
                      ? 'bg-[#B794F4] text-[#0A1628] shadow-[0_4px_15px_rgba(183,148,244,0.4)]'
                      : 'text-white/50 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="tracking-tight uppercase">{item.label}</span>
                  {item.badge && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-8 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-full bg-teal-500 border-2 border-teal-400 flex items-center justify-center text-[#0A1628] font-black text-xs">
            DH
          </div>
          <div className="truncate text-white">
            <p className="text-xs font-black truncate tracking-tight">Daniel Hayward</p>
            <p className="text-teal-500 text-[9px] font-bold uppercase">System Owner</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-3.5 rounded-2xl bg-red-500/10 text-red-400 text-[10px] font-black tracking-widest hover:bg-red-500 hover:text-white transition-all uppercase"
        >
          TERMINATE SESSION
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
