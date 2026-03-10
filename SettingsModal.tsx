
import React from 'react';
import { LedgerEntry } from '../types';
import { UserProfile } from '../App';

interface EarningReportProps {
  entries: LedgerEntry[];
  userProfile: UserProfile;
}

const EarningReport: React.FC<EarningReportProps> = ({ entries, userProfile }) => {
  const getCategoryTotal = (l2: string) => {
    return entries
      .filter(e => e.category.l2 === l2)
      .reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
  };

  const getL3Total = (l3: string) => {
    return entries
      .filter(e => e.category.l3 === l3)
      .reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
  };

  // Income categories
  const incomeTotal = entries
    .filter(e => e.category.l1 === 'REVENUE' || e.category.l1 === 'INCOME')
    .reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);

  // Expense categories (L1: OPERATING or EXPENSES)
  const expenseEntries = entries.filter(e => e.category.l1 === 'OPERATING' || e.category.l1 === 'EXPENSES');
  const expenseTotal = expenseEntries.reduce((acc, e) => acc + (e.out || 0) - (e.in || 0), 0);

  const netEarnings = incomeTotal - expenseTotal;

  return (
    <div className="flex flex-col items-center py-12 px-6 max-w-[1200px] mx-auto w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full flex flex-col gap-2 border-l-4 border-primary pl-6">
        <div className="flex items-center gap-2 text-primary mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Profit & Loss Statement</span>
        </div>
        <h1 className="text-navy-deep text-5xl serif-font font-normal tracking-tight">Earning <span className="italic font-light text-primary">Report</span></h1>
        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mt-2">Comprehensive Performance Summary • {userProfile.currency}</p>
      </div>

      <div className="w-full bg-white rounded-2xl border border-border-light shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-light">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Code</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Value ({userProfile.currency})</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Income Section */}
            <ReportSectionHeader label="Income" />
            <ReportRow code="4001" label="Sales" amount={getL3Total('SALES')} />
            <ReportRow code="4011" label="Wages" amount={getL3Total('WAGES')} />
            <ReportRow code="4021" label="Fee income" amount={getL3Total('FEE INCOME')} />
            <ReportRow code="4031" label="Other income" amount={getL3Total('OTHER INCOME')} />
            <CategoryTotalRow label="Income Total" amount={incomeTotal} />

            {/* Expenses Section */}
            <ReportSectionHeader label="Expenses" />
            
            {/* Sales Cost */}
            <ExpenseGroup label="Sales Cost" codePrefix="50" entries={entries} />
            <ExpenseGroup label="Housing" codePrefix="60" entries={entries} />
            <ExpenseGroup label="Auto" codePrefix="61" entries={entries} />
            <ExpenseGroup label="Food" codePrefix="62" entries={entries} />
            <ExpenseGroup label="Cultural" codePrefix="63" entries={entries} />
            <ExpenseGroup label="Clothing" codePrefix="64" entries={entries} />
            <ExpenseGroup label="Utility" codePrefix="65" entries={entries} />
            <ExpenseGroup label="Insurance" codePrefix="66" entries={entries} />
            <ExpenseGroup label="Maintenance" codePrefix="67" entries={entries} />
            <ExpenseGroup label="Other" codePrefix="68" entries={entries} />
            <ExpenseGroup label="Tax" codePrefix="69" entries={entries} />

            <FinalTotalRow label="Expense Total" amount={expenseTotal} />
          </tbody>
        </table>
        
        {/* Summary Footer */}
        <div className="bg-primary px-10 py-12 flex justify-between items-center text-white">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Net Earnings</span>
            <span className="text-3xl serif-font italic">Profitability Index</span>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-white/60 font-bold text-xl">{userProfile.currency === 'USD' ? '$' : '₩'}</span>
              <span className="text-5xl font-extralight tracking-tighter tabular-nums">
                {netEarnings.toLocaleString('en-US', { minimumFractionDigits: userProfile.currency === 'USD' ? 2 : 0 })}
              </span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Income - Expenses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExpenseGroup: React.FC<{ label: string; codePrefix: string; entries: LedgerEntry[] }> = ({ label, codePrefix, entries }) => {
    const groupEntries = entries.filter(e => e.category.l2.toUpperCase().includes(label.toUpperCase()) || e.category.l3.toUpperCase().includes(label.toUpperCase()));
    const total = groupEntries.reduce((acc, e) => acc + (e.out || 0) - (e.in || 0), 0);
    
    if (total === 0 && groupEntries.length === 0) return null;

    return (
        <>
            {groupEntries.map(e => (
                <ReportRow key={e.id} code={codePrefix + "XX"} label={e.category.l3} amount={e.out || 0} />
            ))}
            <CategoryTotalRow label={`${label} Total`} amount={total} />
        </>
    );
};

const ReportSectionHeader: React.FC<{ label: string }> = ({ label }) => (
  <tr className="bg-slate-50">
    <td colSpan={3} className="px-8 py-3 text-[10px] font-black text-primary uppercase tracking-[0.3em] border-y border-border-light/50">
      {label}
    </td>
  </tr>
);

const ReportRow: React.FC<{ code: string; label: string; amount: number }> = ({ code, label, amount }) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="px-8 py-3 font-mono text-[11px] text-slate-400 group-hover:text-navy-deep">{code}</td>
    <td className="px-8 py-3">
      <span className="text-[12px] font-bold text-navy-deep uppercase tracking-tight">{label}</span>
    </td>
    <td className="px-8 py-3 text-right">
      <span className="font-mono text-[13px] font-bold text-navy-deep">
        {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    </td>
  </tr>
);

const CategoryTotalRow: React.FC<{ label: string; amount: number }> = ({ label, amount }) => (
  <tr className="bg-slate-50/30">
    <td className="px-8 py-2"></td>
    <td className="px-8 py-2">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 italic">
        {label}
      </span>
    </td>
    <td className="px-8 py-2 text-right border-t border-slate-200">
      <span className="font-mono text-[13px] font-black text-navy-deep">
        {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    </td>
  </tr>
);

const FinalTotalRow: React.FC<{ label: string; amount: number }> = ({ label, amount }) => (
  <tr className="bg-navy-deep/5 border-t-2 border-navy-deep/10">
    <td className="px-8 py-6"></td>
    <td className="px-8 py-6">
      <span className="text-[12px] font-black uppercase tracking-[0.2em] text-navy-deep">
        {label}
      </span>
    </td>
    <td className="px-8 py-6 text-right">
      <span className="text-2xl font-black serif-font text-navy-deep">
        {amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </span>
    </td>
  </tr>
);

export default EarningReport;
