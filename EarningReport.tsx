
import React, { useState, useEffect, useRef } from 'react';
import { LedgerEntry } from '../types';
import { UserProfile } from '../App';

interface EquityReportProps {
  entries: LedgerEntry[];
  userProfile: UserProfile;
}

interface AccountEntry {
  id: string;
  code: string;
  label: string;
}

interface SubGroupData {
  id: string;
  label: string;
  items: AccountEntry[];
}

interface GroupData {
  id: string;
  label: string;
  color: string;
  subGroups: SubGroupData[];
}

const CHARTER_STORAGE_KEY = 'easy_account_charter_v1';

const INITIAL_CHARTER: GroupData[] = [
  {
    id: 'g1',
    label: "Assets",
    color: "text-primary",
    subGroups: [
      {
        id: 'sg1',
        label: "Current Assets",
        items: [
          { id: 'i1', code: "1001", label: "Cash on hand" },
          { id: 'i2', code: "1011", label: "Bank (Name 1)" },
          { id: 'i3', code: "1012", label: "Bank (Name 2)" },
          { id: 'i4', code: "1013", label: "Bank (Name 3)" },
          { id: 'i5', code: "1014", label: "Bank (Name 4)" },
          { id: 'i6', code: "1015", label: "Bank (Name 5)" },
        ]
      },
      {
        id: 'sg2',
        label: "Investments",
        items: [
          { id: 'i7', code: "1101", label: "Stock (Name 1)" },
          { id: 'i8', code: "1102", label: "Stock (Name 2)" },
          { id: 'i9', code: "1103", label: "Stock (Name 3)" },
        ]
      },
      {
        id: 'sg3',
        label: "Fixed Assets",
        items: [
          { id: 'i10', code: "1201", label: "House" },
          { id: 'i11', code: "1202", label: "Auto" },
          { id: 'i12', code: "1203", label: "Furniture" },
        ]
      }
    ]
  },
  {
    id: 'g2',
    label: "Liabilities",
    color: "text-red-600",
    subGroups: [
      {
        id: 'sg4',
        label: "Current Liabilities",
        items: [
          { id: 'i13', code: "2001", label: "Credit Card (Name 1)" },
          { id: 'i14', code: "2002", label: "Credit Card (Name 2)" },
          { id: 'i15', code: "2003", label: "Credit Card (Name 3)" },
          { id: 'i16', code: "2004", label: "Credit Card (Name 4)" },
          { id: 'i17', code: "2005", label: "Credit Card (Name 5)" },
          { id: 'i18', code: "2101", label: "Loan (Name 1)" },
          { id: 'i19', code: "2102", label: "Loan (Name 2)" },
        ]
      }
    ]
  },
  {
    id: 'g3',
    label: "Capital",
    color: "text-accent-gold",
    subGroups: [
      {
        id: 'sg5',
        label: "Equity",
        items: [
          { id: 'i20', code: "3000", label: "Equity" },
        ]
      }
    ]
  }
];

const EquityReport: React.FC<EquityReportProps> = ({ entries, userProfile }) => {
  const [charter, setCharter] = useState<GroupData[]>(() => {
    const saved = localStorage.getItem(CHARTER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_CHARTER;
  });

  useEffect(() => {
    localStorage.setItem(CHARTER_STORAGE_KEY, JSON.stringify(charter));
  }, [charter]);

  const updateAccountItem = (groupId: string, subGroupId: string, itemId: string, newCode: string, newLabel: string) => {
    setCharter(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        subGroups: g.subGroups.map(sg => {
          if (sg.id !== subGroupId) return sg;
          return {
            ...sg,
            items: sg.items.map(item => {
              if (item.id !== itemId) return item;
              return { ...item, code: newCode, label: newLabel };
            })
          };
        })
      };
    }));
  };

  // Calculate balances based on entries
  const getCodeBalance = (code: string) => {
    // We match by code or label keywords to make it dynamic
    if (code === '1001') return entries.filter(e => e.details.toLowerCase().includes('cash')).reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
    if (code.startsWith('101')) return entries.filter(e => e.type.startsWith('BANK')).reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
    if (code.startsWith('110')) return entries.filter(e => e.details.toLowerCase().includes('stock')).reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
    if (code === '1201') return entries.filter(e => e.details.toLowerCase().includes('house')).reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
    if (code === '1202') return entries.filter(e => e.details.toLowerCase().includes('auto')).reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
    if (code === '1203') return entries.filter(e => e.details.toLowerCase().includes('furniture')).reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
    if (code.startsWith('200')) return entries.filter(e => e.details.toLowerCase().includes('card')).reduce((acc, e) => acc + (e.out || 0) - (e.in || 0), 0);
    if (code.startsWith('210')) return entries.filter(e => e.details.toLowerCase().includes('loan')).reduce((acc, e) => acc + (e.out || 0) - (e.in || 0), 0);
    if (code === '3000') {
        const assets = entries.filter(e => ['CASH', 'BANK +', 'BANK -'].includes(e.type) || e.category.l3 === 'ASSET').reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
        const liabs = entries.filter(e => e.type.startsWith('CREDIT') || e.category.l3 === 'LIABILITY').reduce((acc, e) => acc + (e.out || 0) - (e.in || 0), 0);
        return assets - liabs;
    }
    return 0;
  };

  const assetTotal = entries.filter(e => ['CASH', 'BANK +', 'BANK -'].includes(e.type) || e.category.l3 === 'ASSET').reduce((acc, e) => acc + (e.in || 0) - (e.out || 0), 0);
  const liabilityTotal = entries.filter(e => e.type.startsWith('CREDIT') || e.category.l3 === 'LIABILITY').reduce((acc, e) => acc + (e.out || 0) - (e.in || 0), 0);
  const netWorth = assetTotal - liabilityTotal;

  return (
    <div className="flex flex-col py-12 px-6 max-w-[1400px] mx-auto w-full gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-full flex flex-col gap-2 border-l-4 border-accent-gold pl-6 mb-4">
        <div className="flex items-center gap-2 text-accent-gold mb-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Financial Statement</span>
        </div>
        <h1 className="text-navy-deep text-5xl serif-font font-normal tracking-tight">Equity <span className="italic font-light text-accent-gold">Report</span></h1>
        <p className="text-slate-400 text-xs uppercase font-bold tracking-widest mt-2">Fiscal Period Summary • {userProfile.currency} Real-time Valuation</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Charter of Account */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
          <div className="px-6 py-4 bg-slate-50 border-b border-border-light flex items-center gap-2">
            <span className="material-symbols-outlined text-accent-gold text-lg">account_tree</span>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-navy-deep">Charter of Account</h3>
          </div>
          <div className="p-6 space-y-6 max-h-[800px] overflow-y-auto custom-scrollbar">
            {charter.map(group => (
              <AccountGroup key={group.id} label={group.label} color={group.color}>
                {group.subGroups.map(subGroup => (
                  <AccountSubGroup key={subGroup.id} label={subGroup.label}>
                    {subGroup.items.map(item => (
                      <AccountItem 
                        key={item.id} 
                        code={item.code} 
                        label={item.label} 
                        onUpdate={(newCode, newLabel) => updateAccountItem(group.id, subGroup.id, item.id, newCode, newLabel)}
                      />
                    ))}
                  </AccountSubGroup>
                ))}
              </AccountGroup>
            ))}
          </div>
        </div>

        {/* Right Side: Equity Report */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-border-light shadow-xl shadow-slate-200/40 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-border-light">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest w-[120px]">Code</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Description</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Balance ({userProfile.currency})</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <ReportGroupHeader label="Assets" />
              <ReportRow code="1001" label="Cash on hand" amount={getCodeBalance('1001')} />
              <ReportRow code="1011" label="Bank" subLabel="Name 1" amount={getCodeBalance('1011')} />
              
              <SpacerRow />
              
              <ReportRow code="1101" label="Stock" subLabel="Name 1" amount={getCodeBalance('1101')} />
              
              <SpacerRow />

              <ReportRow code="1201" label="House" amount={getCodeBalance('1201')} />
              <ReportRow code="1202" label="Auto" amount={getCodeBalance('1202')} />
              <ReportRow code="1203" label="Furniture" amount={getCodeBalance('1203')} />

              <TotalRow label="Asset Total" amount={assetTotal} variant="primary" />

              <ReportGroupHeader label="Liabilities" />
              <ReportRow code="2001" label="Credit Card" subLabel="Name 1" amount={getCodeBalance('2001')} />
              <ReportRow code="2101" label="Loan" subLabel="Name 1" amount={getCodeBalance('2101')} />

              <ReportGroupHeader label="Equity" />
              <ReportRow code="3000" label="Equity / Capital" amount={netWorth} />

              <TotalRow label="Liability & Equity Total" amount={assetTotal} variant="navy" />
            </tbody>
          </table>
          
          <div className="bg-navy-deep px-10 py-12 flex justify-between items-center text-white">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-gold">Net Worth</span>
              <span className="text-3xl serif-font italic opacity-90">Financial Performance</span>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-accent-gold font-bold text-xl">{userProfile.currency === 'USD' ? '$' : '₩'}</span>
                <span className="text-5xl font-extralight tracking-tighter tabular-nums">
                  {netWorth.toLocaleString('en-US', { minimumFractionDigits: userProfile.currency === 'USD' ? 2 : 0 })}
                </span>
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40">Assets - Liabilities</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountGroup: React.FC<{ label: string; color: string; children: React.ReactNode }> = ({ label, color, children }) => (
    <div className="space-y-3">
        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${color} border-b border-slate-100 pb-2`}>{label}</h4>
        <div className="space-y-4 pl-2">
            {children}
        </div>
    </div>
);

const AccountSubGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div className="space-y-2">
        <h5 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">{label}</h5>
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

const AccountItem: React.FC<{ 
  code: string; 
  label: string;
  onUpdate: (newCode: string, newLabel: string) => void;
}> = ({ code, label, onUpdate }) => {
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [isEditingLabel, setIsEditingLabel] = useState(false);
  const [tempCode, setTempCode] = useState(code);
  const [tempLabel, setTempLabel] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if ((isEditingCode || isEditingLabel) && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingCode, isEditingLabel]);

  const handleKeyDown = (e: React.KeyboardEvent, type: 'code' | 'label') => {
    if (e.key === 'Enter') {
      if (type === 'code') {
        onUpdate(tempCode, label);
        setIsEditingCode(false);
      } else {
        onUpdate(code, tempLabel);
        setIsEditingLabel(false);
      }
    } else if (e.key === 'Escape') {
      setTempCode(code);
      setTempLabel(label);
      setIsEditingCode(false);
      setIsEditingLabel(false);
    }
  };

  const handleBlur = (type: 'code' | 'label') => {
    if (type === 'code') {
      onUpdate(tempCode, label);
      setIsEditingCode(false);
    } else {
      onUpdate(code, tempLabel);
      setIsEditingLabel(false);
    }
  };

  return (
    <div className="flex items-center justify-between group cursor-default gap-2">
      <div className="flex-shrink-0 w-16">
        {isEditingCode ? (
          <input
            ref={inputRef}
            type="text"
            value={tempCode}
            onChange={(e) => setTempCode(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'code')}
            onBlur={() => handleBlur('code')}
            className="text-[11px] font-mono text-navy-deep bg-slate-50 border border-primary/30 rounded px-1 w-full outline-none"
          />
        ) : (
          <span 
            onDoubleClick={() => setIsEditingCode(true)}
            className="text-[11px] font-mono text-slate-400 group-hover:text-navy-deep transition-colors cursor-text block"
          >
            {code}
          </span>
        )}
      </div>

      <div className="flex-1 text-right">
        {isEditingLabel ? (
          <input
            ref={inputRef}
            type="text"
            value={tempLabel}
            onChange={(e) => setTempLabel(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'label')}
            onBlur={() => handleBlur('label')}
            className="text-[11px] font-bold text-navy-deep bg-slate-50 border border-primary/30 rounded px-1 w-full outline-none text-right"
          />
        ) : (
          <span 
            onDoubleClick={() => setIsEditingLabel(true)}
            className="text-[11px] font-bold text-navy-deep/70 group-hover:text-navy-deep transition-colors cursor-text block"
          >
            {label}
          </span>
        )}
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
