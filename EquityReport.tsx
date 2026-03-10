
import React from 'react';

interface SuccessModalProps {
  amount: number;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ amount, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/20 backdrop-blur-md">
      <div className="bg-white w-full max-w-[480px] rounded-2xl shadow-2xl border border-accent-gold/20 p-12 flex flex-col items-center relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-300 hover:text-slate-500 transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        
        <div className="mb-8">
          <div className="size-24 rounded-full bg-accent-gold/5 flex items-center justify-center border border-accent-gold/20 relative">
            <div className="size-16 rounded-full bg-accent-gold flex items-center justify-center shadow-lg shadow-accent-gold/30">
              <span className="material-symbols-outlined text-white text-4xl font-bold">check</span>
            </div>
            <div className="absolute -top-1 -right-1 size-3 bg-accent-gold/20 rounded-full"></div>
            <div className="absolute -bottom-2 -left-3 size-2 bg-accent-gold/40 rounded-full"></div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h3 className="serif-font text-3xl text-navy-deep mb-3 tracking-tight">Welcome to Easy Account</h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[300px] mx-auto font-medium">
            Your financial foundation is now securely established and ready for management.
          </p>
        </div>

        <div className="w-full bg-slate-50 border border-slate-100 rounded-xl p-6 mb-10">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Initial Capital Recorded</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-accent-gold font-medium text-lg">$</span>
              <span className="text-2xl font-light text-navy-deep tracking-tight">{amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full group relative overflow-hidden bg-accent-gold text-white px-8 py-4 rounded-lg font-bold text-xs uppercase tracking-[0.25em] transition-all hover:bg-navy-deep shadow-lg shadow-accent-gold/20 active:scale-[0.98]"
        >
          <span className="relative z-10">Get Started</span>
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </button>

        <p className="mt-8 text-[9px] text-slate-400 uppercase tracking-[0.15em] font-bold">
          Professional Accounting Suite • v2.4.0
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;
