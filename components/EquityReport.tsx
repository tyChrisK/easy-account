
import React from 'react';

const EquityReport: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-12 px-6 max-w-[1000px] mx-auto w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full flex flex-col gap-2 border-l-4 border-accent-gold pl-6">
        <div className="flex items-center gap-2 text-accent-gold mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financial Statement</span>
        </div>
        <h1 className="text-navy-deep text-5xl serif-font font-normal tracking-tight">Equity <span className="italic font-light text-accent-gold">Report</span></h1>
        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mt-2">Fiscal Period Summary • Real-time Valuation</p>
      </div>

      <div className="w-full bg-white rounded-2xl border border-border-light shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-light">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Code</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Description</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Assets Section */}
            <ReportGroupHeader label="Assets" />
            <ReportRow code="1001" label="Cash on hand" amount={5400.00} />
            <ReportRow code="1011" label="Bank" subLabel="Name 1" amount={12500.50} />
            <ReportRow code="1012" label="Bank" subLabel="Name 2" amount={4200.00} />
            <ReportRow code="1013" label="Bank" subLabel="Name 3" amount={890.00} />
            <ReportRow code="1014" label="Bank" subLabel="Name 4" amount={15000.00} />
            <ReportRow code="1015" label="Bank" subLabel="Name 5" amount={2300.75} />
            
            <SpacerRow />
            
            <ReportRow code="1101" label="Stock" subLabel="Name 1" amount={45000.00} />
            <ReportRow code="1102" label="Stock" subLabel="Name 2" amount={12000.00} />
            <ReportRow code="1103" label="Stock" subLabel="Name 3" amount={7500.20} />
            
            <SpacerRow />

            <ReportRow code="1201" label="House" amount={450000.00} />
            <ReportRow code="1202" label="Auto" amount={32000.00} />
            <ReportRow code="1203" label="Furniture" amount={8500.00} />

            <TotalRow label="Asset Total" amount={594791.45} variant="primary" />

            {/* Liabilities Section */}
            <ReportGroupHeader label="Liabilities" />
            <ReportRow code="2001" label="Credit Card" subLabel="Name 1" amount={1200.00} />
            <ReportRow code="2002" label="Credit Card" subLabel="Name 2" amount={450.50} />
            <ReportRow code="2003" label="Credit Card" subLabel="Name 3" amount={2100.00} />
            <ReportRow code="2004" label="Credit Card" subLabel="Name 4" amount={890.00} />
            <ReportRow code="2005" label="Credit Card" subLabel="Name 5" amount={150.00} />
            
            <SpacerRow />

            <ReportRow code="2101" label="Loan" subLabel="Name 1" amount={125000.00} />
            <ReportRow code="2102" label="Loan" subLabel="Name 2" amount={45000.00} />

            {/* Equity Section */}
            <ReportGroupHeader label="Equity" />
            <ReportRow code="3000" label="Equity / Capital" amount={419890.95} />

            <TotalRow label="Liability & Equity Total" amount={594791.45} variant="navy" />
          </tbody>
        </table>
        
        {/* Footer Earnings */}
        <div className="bg-navy-deep px-10 py-12 flex justify-between items-center text-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Retained Earnings</span>
            <span className="text-3xl serif-font italic opacity-90">Financial Performance</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-accent-gold font-bold text-xl">$</span>
              <span className="text-5xl font-extralight tracking-tighter tabular-nums">419,890.95</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Net Worth (Assets - Liabilities)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportGroupHeader: React.FC<{ label: string }> = ({ label }) => (
  <tr className="bg-slate-50/50">
    <td colSpan={3} className="px-8 py-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/5">
      {label}
    </td>
  </tr>
);

const ReportRow: React.FC<{ code: string; label: string; subLabel?: string; amount: number }> = ({ code, label, subLabel, amount }) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="px-8 py-4 font-mono text-xs text-slate-400 group-hover:text-navy-deep font-bold">{code}</td>
    <td className="px-8 py-4">
      <div className="flex items-center gap-3">
        <span className="text-[13px] font-bold text-navy-deep uppercase tracking-tight">{label}</span>
        {subLabel && (
          <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-tighter">
            {subLabel}
          </span>
        )}
      </div>
    </td>
    <td className="px-8 py-4 text-right">
      <span className="font-mono text-[14px] font-bold text-navy-deep">
        {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    </td>
  </tr>
);

const TotalRow: React.FC<{ label: string; amount: number; variant: 'primary' | 'navy' }> = ({ label, amount, variant }) => (
  <tr className={`${variant === 'primary' ? 'bg-primary/5' : 'bg-navy-deep/5'} border-t border-border-light`}>
    <td className="px-8 py-6"></td>
    <td className="px-8 py-6">
      <span className={`text-[12px] font-black uppercase tracking-[0.2em] ${variant === 'primary' ? 'text-primary' : 'text-navy-deep'}`}>
        {label}
      </span>
    </td>
    <td className="px-8 py-6 text-right">
      <div className="flex flex-col items-end">
        <span className={`text-2xl font-black serif-font ${variant === 'primary' ? 'text-primary' : 'text-navy-deep'}`}>
          {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </td>
  </tr>
);

const SpacerRow: React.FC = () => (
  <tr className="h-2">
    <td colSpan={3}></td>
  </tr>
);

export default EquityReport;
