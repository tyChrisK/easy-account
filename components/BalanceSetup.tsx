
import React, { useState } from 'react';
import { BalanceState } from '../types';

interface BalanceSetupProps {
  onSave: (capital: number) => void;
}

const BalanceSetup: React.FC<BalanceSetupProps> = ({ onSave }) => {
  const [balances, setBalances] = useState<Omit<BalanceState, 'capital'>>({
    cash: 0,
    bank: 0,
    stock: 0,
    loan: 0,
    card: 0,
  });

  const totalAssets = balances.cash + balances.bank + balances.stock;
  const totalLiabilities = balances.loan + balances.card;
  const calculatedCapital = totalAssets - totalLiabilities;

  const handleChange = (field: keyof Omit<BalanceState, 'capital'>, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setBalances({ ...balances, [field]: numValue });
  };

  const handleReset = () => {
    setBalances({
      cash: 0,
      bank: 0,
      stock: 0,
      loan: 0,
      card: 0,
    });
  };

  const handleExportAndSave = () => {
    const setupData = {
      ...balances,
      capital: calculatedCapital,
      timestamp: new Date().toISOString(),
      version: "2.4.0"
    };

    // Create a blob and download as a JSON file
    const blob = new Blob([JSON.stringify(setupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ledger_initial_setup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Proceed with the app state update
    onSave(calculatedCapital);
  };

  return (
    <div className="flex flex-col items-center py-16 px-4 md:px-20 max-w-[900px] mx-auto w-full gap-10">
      <div className="w-full flex flex-col gap-3">
        <div className="flex items-center gap-2 text-accent-gold mb-1">
          <span className="h-[1px] w-8 bg-accent-gold"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Initial Configuration</span>
        </div>
        <h1 className="text-navy-deep text-5xl serif-font font-normal leading-tight">
          Initial <span className="italic text-accent-gold">Balance</span> Setup
        </h1>
        <p className="text-slate-500 text-base font-normal max-w-md border-l-2 border-accent-gold/20 pl-4">
          Establish your starting financial position. Capital is automatically calculated as Net Worth (Assets - Liabilities).
        </p>
      </div>

      <div className="w-full bg-white rounded-2xl border border-border-light p-10 shadow-xl shadow-slate-200/50">
        <div className="overflow-hidden rounded-lg border border-border-light mb-8">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-accent-gold">
              <tr>
                <th className="px-6 py-4 border-b border-r border-border-light w-1/3">Account Name</th>
                <th className="px-6 py-4 border-b border-r border-border-light w-1/3 text-center text-navy-deep">Debit (Assets)</th>
                <th className="px-6 py-4 border-b border-border-light w-1/3 text-center text-navy-deep">Credit (Liabilities)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              <BalanceRow label="Cash" value={balances.cash} onChange={(v) => handleChange('cash', v)} type="debit" />
              <BalanceRow label="Bank" value={balances.bank} onChange={(v) => handleChange('bank', v)} type="debit" />
              <BalanceRow label="Stock" value={balances.stock} onChange={(v) => handleChange('stock', v)} type="debit" />
              
              <tr className="bg-slate-50/50 border-t border-border-light">
                <td className="px-6 py-3 font-black text-slate-400 uppercase tracking-widest text-[9px] border-r border-border-light italic">Subtotal Assets</td>
                <td className="px-4 py-3 text-right border-r border-border-light">
                  <span className="font-mono text-sm font-bold text-navy-deep">{totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </td>
                <td className="px-4 py-3 bg-gray-50/20"></td>
              </tr>

              <SpacerRow />

              <BalanceRow label="Loan" value={balances.loan} onChange={(v) => handleChange('loan', v)} type="credit" />
              <BalanceRow label="Card" value={balances.card} onChange={(v) => handleChange('card', v)} type="credit" />
              
              <tr className="bg-slate-50/50 border-t border-border-light">
                <td className="px-6 py-3 font-black text-slate-400 uppercase tracking-widest text-[9px] border-r border-border-light italic">Subtotal Liabilities</td>
                <td className="px-4 py-3 border-r border-border-light bg-gray-50/20"></td>
                <td className="px-4 py-3 text-right">
                  <span className="font-mono text-sm font-bold text-navy-deep">{totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </td>
              </tr>

              <SpacerRow />

              <tr className="bg-navy-deep/5 border-y-2 border-navy-deep/10">
                <td className="px-6 py-5 font-black text-primary uppercase tracking-[0.2em] text-[10px] border-r border-border-light flex flex-col">
                  <span>Capital</span>
                  <span className="text-[8px] text-slate-400 font-bold lowercase tracking-normal">(Calculated Balance)</span>
                </td>
                <td className="px-4 py-5 border-r border-border-light bg-gray-50/30"></td>
                <td className="px-4 py-5 text-right bg-primary/5">
                  <div className="flex flex-col items-end">
                    <span className="serif-font text-2xl font-black text-primary">
                      {calculatedCapital.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest mt-1 opacity-60">Balanced Total</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex justify-end items-center mt-4">
          <div className="flex gap-6 items-center">
            <button 
              onClick={handleReset}
              className="px-8 py-3 text-[10px] font-black text-slate-400 hover:text-navy-deep uppercase tracking-widest transition-colors"
            >
              Clear Values
            </button>
            <button 
              onClick={handleExportAndSave}
              className="px-12 py-5 rounded-lg bg-navy-deep text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-primary transition-all shadow-xl shadow-navy-deep/20 active:scale-95 flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-lg">download_for_offline</span>
              Save & Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const BalanceRow: React.FC<{
  label: string; 
  value: number; 
  onChange: (v: string) => void; 
  type: 'debit' | 'credit';
}> = ({ label, value, onChange, type }) => (
  <tr className="hover:bg-gray-50/50 transition-colors">
    <td className="px-6 py-4 font-bold text-navy-deep uppercase tracking-wider text-[11px] border-r border-border-light">
      {label}
    </td>
    {type === 'debit' ? (
      <>
        <td className="px-4 py-3 border-r border-border-light">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-serif text-xs transition-colors group-focus-within:text-accent-gold">$</span>
            <input 
              type="number" 
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-slate-50/50 border border-border-light text-navy-deep rounded-lg focus:ring-accent-gold focus:border-accent-gold h-11 pl-8 text-sm font-mono transition-all" 
              placeholder="0.00"
            />
          </div>
        </td>
        <td className="px-4 py-3 bg-gray-50/30"></td>
      </>
    ) : (
      <>
        <td className="px-4 py-3 border-r border-border-light bg-gray-50/30"></td>
        <td className="px-4 py-3">
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-serif text-xs transition-colors group-focus-within:text-accent-gold">$</span>
            <input 
              type="number" 
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-slate-50/50 border border-border-light text-navy-deep rounded-lg focus:ring-accent-gold focus:border-accent-gold h-11 pl-8 text-sm font-mono transition-all"
              placeholder="0.00"
            />
          </div>
        </td>
      </>
    )}
  </tr>
);

const SpacerRow: React.FC = () => (
  <tr className="bg-slate-50/10">
    <td className="px-6 py-2 border-r border-border-light h-6"></td>
    <td className="px-4 py-2 border-r border-border-light bg-gray-50/10"></td>
    <td className="px-4 py-2 bg-gray-50/10"></td>
  </tr>
);

export default BalanceSetup;
