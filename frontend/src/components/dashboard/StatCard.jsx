import React from 'react';

const StatCard = ({ title, value, subtitle, variant = 'default', borderColor }) => {
  const variants = {
    default: 'bg-white/80 backdrop-blur-xl border border-white/30',
    dark: 'bg-[#0A1628] text-white',
    glass: 'bg-white/80 backdrop-blur-xl border border-white/30'
  };

  const borderClass = borderColor ? `border-b-8 ${borderColor}` : '';

  return (
    <div
      className={`${variants[variant]} ${borderClass} p-8 rounded-[48px] shadow-sm group hover:scale-[1.02] transition-transform`}
    >
      <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-2 ${
        variant === 'dark' ? 'text-white/40' : 'text-slate-400'
      }`}>
        {title}
      </p>
      <p className={`text-4xl font-black tracking-tighter italic ${
        variant === 'dark' ? 'text-teal-400' : 'text-slate-900'
      }`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-[10px] font-bold mt-4 uppercase tracking-tighter">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StatCard;
