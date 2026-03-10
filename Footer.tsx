
import React, { useState, useEffect } from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isSetupComplete: boolean;
  onOpenSettings: () => void;
  userInitials: string;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, isSetupComplete, onOpenSettings, userInitials }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).split(' ');
  };

  const [timeStr, ampm] = formatTime(time);
  const dateStr = time.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).toUpperCase();
  const dayStr = time.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-border-light px-6 py-4 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="text-accent-gold flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl">account_balance</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-navy-deep text-xl font-extrabold leading-tight tracking-[-0.015em] uppercase text-[#111827]">Easy Account</h2>
          <span className="text-[10px] text-accent-gold tracking-[0.3em] font-bold uppercase">Professional Suite</span>
        </div>
      </div>

      <nav className="flex items-center gap-1 bg-[#f1f5f9] p-1 rounded-lg border border-border-light">
        {!isSetupComplete && (
          <button
            onClick={() => onNavigate(AppView.SETUP)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
              currentView === AppView.SETUP 
                ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                : 'text-slate-500 hover:text-navy-deep'
            }`}
          >
            <span className="material-symbols-outlined text-base">settings_input_component</span>
            Balance Setup
          </button>
        )}
        <button
          onClick={() => onNavigate(AppView.TERMINAL)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
            currentView === AppView.TERMINAL 
              ? 'bg-primary text-white shadow-lg shadow-primary/30' 
              : 'text-slate-500 hover:text-navy-deep'
          }`}
        >
          <span className="material-symbols-outlined text-base">edit_note</span>
          Input
        </button>
        <button 
          onClick={() => onNavigate(AppView.EARNING_REPORT)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
            currentView === AppView.EARNING_REPORT 
              ? 'bg-primary text-white shadow-lg shadow-primary/30' 
              : 'text-slate-500 hover:text-navy-deep'
          }`}
        >
          <span className="material-symbols-outlined text-base">analytics</span>
          Earning Report
        </button>
        <button 
          onClick={() => onNavigate(AppView.EQUITY_REPORT)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-bold transition-all ${
            currentView === AppView.EQUITY_REPORT 
              ? 'bg-primary text-white shadow-lg shadow-primary/30' 
              : 'text-slate-500 hover:text-navy-deep'
          }`}
        >
          <span className="material-symbols-outlined text-base">description</span>
          Equity Report
        </button>
      </nav>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 px-6 border-l border-border-light">
          <div className="flex items-center gap-3">
            <div className="text-[#8b6d31] font-black text-xl border-r border-border-light pr-3 leading-none serif-font">{dayStr}</div>
            <div className="flex flex-col justify-center">
              <p className="text-navy-deep text-4xl font-light tracking-tighter tabular-nums leading-none serif-font">
                {timeStr} <span className="text-[10px] font-black text-[#8b6d31] uppercase tracking-tighter align-top">{ampm}</span>
              </p>
              <p className="text-slate-400 text-[10px] uppercase tracking-[0.15em] font-extrabold mt-1 leading-none">{dateStr}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onOpenSettings}
          className="flex size-10 items-center justify-center rounded-lg bg-white border border-border-light text-slate-400 hover:text-navy-deep transition-all"
        >
          <span className="material-symbols-outlined">settings</span>
        </button>
        <div className="flex size-10 items-center justify-center rounded-full bg-accent-gold text-white font-bold text-sm shadow-md shadow-accent-gold/20">
          {userInitials}
        </div>
      </div>
    </header>
  );
};

export default Header;
