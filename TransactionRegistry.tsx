
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto px-10 py-10 border-t border-border-light bg-white">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.5em]">Secure • Encrypted • Professional Enterprise Terminal</p>
        <div className="flex gap-10">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">v2.4.0 Release</span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-accent-gold transition-colors">Documentation</span>
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest cursor-pointer hover:text-accent-gold transition-colors">Support</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
