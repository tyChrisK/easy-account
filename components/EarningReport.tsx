
import React from 'react';

const EarningReport: React.FC = () => {
  return (
    <div className="flex flex-col items-center py-12 px-6 max-w-[1000px] mx-auto w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full flex flex-col gap-2 border-l-4 border-primary pl-6">
        <div className="flex items-center gap-2 text-primary mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Profit & Loss Statement</span>
        </div>
        <h1 className="text-navy-deep text-5xl serif-font font-normal tracking-tight">Earning <span className="italic font-light text-primary">Report</span></h1>
        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mt-2">Comprehensive Performance Summary</p>
      </div>

      <div className="w-full bg-white rounded-2xl border border-border-light shadow-xl shadow-slate-200/40 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-border-light">
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Code</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Details</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Value</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Income Section */}
            <ReportSectionHeader label="Income" />
            <ReportRow code="4001" label="Sales" amount={125000.00} />
            <ReportRow code="4011" label="Wages" amount={5200.00} />
            <ReportRow code="4021" label="Fee income" amount={3400.50} />
            <ReportRow code="4031" label="Other income" amount={890.00} />
            <CategoryTotalRow label="Income Total" amount={134490.50} />

            {/* Expenses Section */}
            <ReportSectionHeader label="Expenses" />
            
            {/* Sales Cost */}
            <ReportRow code="5001" label="Purchase for sales" amount={45000.00} />
            <ReportRow code="5011" label="Wages expense" amount={15000.00} />
            <ReportRow code="5012" label="Payroll taxes" amount={4200.00} />
            <CategoryTotalRow label="Sales Cost Total" amount={64200.00} />

            {/* Rent */}
            <ReportRow code="6001" label="Rent or mortgage" amount={3200.00} />
            <CategoryTotalRow label="Rent Total" amount={3200.00} />

            {/* Auto */}
            <ReportRow code="6101" label="Auto payment" amount={1200.00} />
            <ReportRow code="6102" label="Gas expense" amount={450.00} />
            <ReportRow code="6103" label="Auto repair" amount={210.00} />
            <ReportRow code="6104" label="Auto insurance" amount={180.00} />
            <ReportRow code="6105" label="Auto other exps" amount={90.00} />
            <ReportRow code="6106" label="Trapic expense" amount={50.00} />
            <CategoryTotalRow label="Auto Exp Total" amount={2180.00} />

            {/* Food */}
            <ReportRow code="6201" label="Food material" amount={1400.00} />
            <ReportRow code="6202" label="Meal" amount={850.00} />
            <ReportRow code="6203" label="Food other exps" amount={120.00} />
            <CategoryTotalRow label="Food Total" amount={2370.00} />

            {/* Cultural */}
            <ReportRow code="6301" label="Telephone" amount={120.00} />
            <ReportRow code="6302" label="Internet" amount={85.00} />
            <ReportRow code="6303" label="Education" amount={1500.00} />
            <ReportRow code="6304" label="Training" amount={800.00} />
            <ReportRow code="6305" label="Entertainment" amount={450.00} />
            <CategoryTotalRow label="Cultural Total" amount={2955.00} />

            {/* Cloth */}
            <ReportRow code="6401" label="Cloth purchase" amount={1200.00} />
            <ReportRow code="6402" label="Accessory purchase" amount={350.00} />
            <ReportRow code="6403" label="Cloth others" amount={150.00} />
            <CategoryTotalRow label="Cloth Total" amount={1700.00} />

            {/* Utility */}
            <ReportRow code="6501" label="Electric power" amount={420.00} />
            <ReportRow code="6502" label="Gas expense" amount={310.00} />
            <ReportRow code="6503" label="Water expense" amount={180.00} />
            <ReportRow code="6504" label="Utility other" amount={95.00} />
            <CategoryTotalRow label="Utility Total" amount={1005.00} />

            {/* Insurance */}
            <ReportRow code="6601" label="Life insurance" amount={2100.00} />
            <ReportRow code="6602" label="Bus insurance" amount={450.00} />
            <ReportRow code="6603" label="Medical insurance" amount={1500.00} />
            <ReportRow code="6604" label="Other insurance" amount={320.00} />
            <CategoryTotalRow label="Insurance Total" amount={4370.00} />

            {/* Supplies */}
            <ReportRow code="6701" label="Supplies" amount={850.00} />
            <ReportRow code="6702" label="Repair" amount={1200.00} />
            <ReportRow code="6703" label="Maint. Others" amount={450.00} />
            <CategoryTotalRow label="Supplies Total" amount={2500.00} />

            {/* Others */}
            <ReportRow code="6801" label="Other expense" amount={1200.00} />
            <CategoryTotalRow label="Others Total" amount={1200.00} />

            {/* Tax */}
            <ReportRow code="6901" label="Tax" amount={4500.00} />
            <ReportRow code="6902" label="Other taxes" amount={1200.00} />
            <CategoryTotalRow label="Tax Total" amount={5700.00} />

            <FinalTotalRow label="Expense Total" amount={91380.00} />
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
              <span className="text-white/60 font-bold text-xl">$</span>
              <span className="text-5xl font-extralight tracking-tighter tabular-nums">43,110.50</span>
            </div>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">Income - Expenses</span>
          </div>
        </div>
      </div>
    </div>
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
