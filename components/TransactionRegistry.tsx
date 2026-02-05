
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { LedgerEntry, AccountInfo, CardBrand } from '../types';

interface CategoryData {
  [l1: string]: {
    [l2: string]: string[];
  };
}

interface AccountData {
  banks: AccountInfo[];
  credits: AccountInfo[];
}

const CAT_STORAGE_KEY = 'easy_account_categories_v4';
const ACC_STORAGE_KEY = 'easy_account_custom_accounts_v4';

const DEFAULT_CATEGORIES: CategoryData = {
  'OPERATING': {
    'ADMIN': ['SALARY', 'RENT', 'UTILITIES'],
    'MARKETING': ['ADS', 'SOCIAL MEDIA', 'EVENTS']
  },
  'REVENUE': {
    'SERVICES': ['CONSULTING', 'DEVELOPMENT'],
    'PRODUCTS': ['HARDWARE', 'SOFTWARE']
  }
};

const DEFAULT_ACCOUNTS: AccountData = {
  banks: [{ masked: '***0000', brand: 'generic' }],
  credits: [{ masked: '**-0000', brand: 'visa' }]
};

const BrandIcon: React.FC<{ brand: CardBrand; className?: string }> = ({ brand, className = "size-5" }) => {
  switch (brand) {
    case 'visa':
      return <span className={`flex items-center justify-center font-black text-[8px] bg-[#1A1F71] text-white px-1 rounded-sm italic ${className}`}>VISA</span>;
    case 'master':
      return (
        <div className={`flex items-center -space-x-2 ${className}`}>
          <div className="size-3 rounded-full bg-[#EB001B] opacity-90"></div>
          <div className="size-3 rounded-full bg-[#F79E1B] opacity-90"></div>
        </div>
      );
    case 'amex':
      return <span className={`flex items-center justify-center font-black text-[7px] bg-[#007BC1] text-white px-1 rounded-sm ${className}`}>AMEX</span>;
    case 'jcb':
      return <span className={`flex items-center justify-center font-black text-[7px] bg-gradient-to-r from-blue-600 to-red-500 text-white px-1 rounded-sm ${className}`}>JCB</span>;
    case 'diners':
      return <span className={`flex items-center justify-center font-black text-[6px] bg-[#004A97] text-white px-0.5 rounded-sm ${className}`}>DINERS</span>;
    default:
      return <span className={`material-symbols-outlined text-slate-400 ${className}`}>account_balance</span>;
  }
};

const TransactionRegistry: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const typeRef = useRef<HTMLSelectElement>(null);
  
  const [activeModal, setActiveModal] = useState<'add' | 'delete' | 'addAccount' | null>(null);
  const [modalContext, setModalContext] = useState<{ level?: 1 | 2 | 3; value?: string; type?: 'Bank' | 'Credit' } | null>(null);
  const [newNameInput, setNewNameInput] = useState('');

  const [categories, setCategories] = useState<CategoryData>(() => {
    const saved = localStorage.getItem(CAT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  const [accounts, setAccounts] = useState<AccountData>(() => {
    const saved = localStorage.getItem(ACC_STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_ACCOUNTS;
  });

  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  
  const [formData, setFormData] = useState({
    type: '', 
    subTypeIndex: 0,
    date: today,
    l1: Object.keys(categories)[0] || '',
    l2: '',
    l3: '',
    details: '',
    in: '',
    out: '',
    remarks: ''
  });

  useEffect(() => {
    if (!formData.l1 || !categories[formData.l1]) {
      const firstL1 = Object.keys(categories)[0] || '';
      const firstL2 = firstL1 ? Object.keys(categories[firstL1])[0] || '' : '';
      const firstL3 = (firstL1 && firstL2) ? categories[firstL1][firstL2][0] || '' : '';
      setFormData(prev => ({ ...prev, l1: firstL1, l2: firstL2, l3: firstL3 }));
      return;
    }
    if (!formData.l2 || !categories[formData.l1][formData.l2]) {
      const firstL2 = Object.keys(categories[formData.l1])[0] || '';
      const firstL3 = firstL2 ? categories[formData.l1][firstL2][0] || '' : '';
      setFormData(prev => ({ ...prev, l2: firstL2, l3: firstL3 }));
      return;
    }
    if (!formData.l3 || !categories[formData.l1][formData.l2].includes(formData.l3)) {
      setFormData(prev => ({ ...prev, l3: categories[formData.l1][formData.l2][0] || '' }));
    }
  }, [formData.l1, formData.l2, categories]);

  useEffect(() => {
    localStorage.setItem(CAT_STORAGE_KEY, JSON.stringify(categories));
    localStorage.setItem(ACC_STORAGE_KEY, JSON.stringify(accounts));
  }, [categories, accounts]);

  const l1Options = useMemo(() => Object.keys(categories), [categories]);
  const l2Options = useMemo(() => (formData.l1 ? Object.keys(categories[formData.l1] || {}) : []), [formData.l1, categories]);
  const l3Options = useMemo(() => (formData.l1 && formData.l2 ? (categories[formData.l1][formData.l2] || []) : []), [formData.l1, formData.l2, categories]);

  const handleL1Change = (val: string) => setFormData(prev => ({ ...prev, l1: val }));
  const handleL2Change = (val: string) => setFormData(prev => ({ ...prev, l2: val }));

  const openAddAccountModal = (type: 'Bank' | 'Credit') => {
    setModalContext({ type });
    setNewNameInput('');
    setActiveModal('addAccount');
  };

  const detectBrand = (num: string): CardBrand => {
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5')) return 'master';
    if (num.startsWith('35')) return 'jcb';
    if (num.startsWith('36')) return 'diners';
    if (num.startsWith('37')) return 'amex';
    return 'generic';
  };

  const processAddAccount = () => {
    const raw = newNameInput.trim();
    if (raw.length < 4) return;
    const last4 = raw.slice(-4);
    const brand = detectBrand(raw);
    const masked = modalContext?.type === 'Bank' ? `***${last4}` : `**-${last4}`;

    setAccounts(prev => {
      const next = { ...prev };
      const newAcc = { masked, brand };
      if (modalContext?.type === 'Bank') {
        if (!next.banks.find(a => a.masked === masked)) next.banks = [...next.banks, newAcc];
      } else {
        if (!next.credits.find(a => a.masked === masked)) next.credits = [...next.credits, newAcc];
      }
      return next;
    });

    setActiveModal(null);
  };

  const processAddCategory = () => {
    const name = newNameInput.toUpperCase().trim();
    if (!name || !modalContext?.level) return;
    setCategories(prev => {
      const next = { ...prev };
      if (modalContext.level === 1) next[name] = next[name] || {};
      else if (modalContext.level === 2 && formData.l1) next[formData.l1][name] = next[formData.l1][name] || [];
      else if (modalContext.level === 3 && formData.l1 && formData.l2) {
        if (!next[formData.l1][formData.l2].includes(name)) {
          next[formData.l1][formData.l2] = [...next[formData.l1][formData.l2], name];
        }
      }
      return next;
    });
    setActiveModal(null);
  };

  const processDeleteCategory = () => {
    if (!modalContext?.level) return;
    setCategories(prev => {
      const next = { ...prev };
      if (modalContext.level === 1) delete next[formData.l1];
      else if (modalContext.level === 2) delete next[formData.l1][formData.l2];
      else if (modalContext.level === 3) next[formData.l1][formData.l2] = next[formData.l1][formData.l2].filter(i => i !== formData.l3);
      return next;
    });
    setActiveModal(null);
  };

  const handleCommit = () => {
    if (!formData.type || !formData.l1 || !formData.l2 || !formData.l3) return;
    
    const accountList = formData.type === 'Bank +' ? accounts.banks : formData.type === 'Credit +' ? accounts.credits : [];
    const selectedAcc = accountList[formData.subTypeIndex];

    const newEntry: LedgerEntry = {
      id: Math.random().toString(36).substr(2, 9),
      type: formData.type.replace(' +', '').toUpperCase(),
      subType: selectedAcc?.masked,
      subTypeBrand: selectedAcc?.brand,
      date: formData.date,
      category: { l1: formData.l1, l2: formData.l2, l3: formData.l3 },
      details: formData.details || 'Entry',
      in: formData.in ? parseFloat(formData.in) : null,
      out: formData.out ? parseFloat(formData.out) : null,
      remarks: formData.remarks
    };
    setEntries([newEntry, ...entries]);
    setFormData(prev => ({ ...prev, details: '', in: '', out: '', remarks: '' }));
    typeRef.current?.focus();
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
  };

  const currentSubType = formData.type === 'Bank +' ? accounts.banks[formData.subTypeIndex] : formData.type === 'Credit +' ? accounts.credits[formData.subTypeIndex] : null;

  return (
    <div className="relative flex flex-col items-center py-8 px-6 max-w-[1920px] mx-auto w-full gap-8">
      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-border-light w-full max-w-md p-8">
            {activeModal === 'addAccount' ? (
              <>
                <h4 className="text-navy-deep font-black text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">add_card</span>
                  Register {modalContext?.type}
                </h4>
                <p className="text-slate-500 text-xs mb-6 font-medium tracking-tight leading-relaxed">Logo detection (4:V, 5:M, 35:J, 36:D, 37:A). Last 4 digits stored.</p>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-slate-50 border-border-light rounded-lg h-12 px-4 text-sm font-bold tracking-widest mb-8 focus:ring-primary focus:border-primary"
                  placeholder="ACCOUNT OR CARD NUMBER"
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processAddAccount()}
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setActiveModal(null)} className="px-6 py-2 text-[10px] font-black uppercase text-slate-400">Cancel</button>
                  <button onClick={processAddAccount} className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase rounded-lg">Register</button>
                </div>
              </>
            ) : activeModal === 'add' ? (
              <>
                <h4 className="text-navy-deep font-black text-xs uppercase mb-2">Add Level {modalContext?.level}</h4>
                <input 
                  type="text" 
                  autoFocus
                  className="w-full bg-slate-50 border border-border-light rounded-lg h-12 px-4 text-sm font-bold uppercase mb-8"
                  value={newNameInput}
                  onChange={(e) => setNewNameInput(e.target.value)}
                />
                <div className="flex justify-end gap-3">
                  <button onClick={() => setActiveModal(null)} className="px-6 py-2 text-slate-400">Cancel</button>
                  <button onClick={processAddCategory} className="px-8 py-3 bg-primary text-white rounded-lg">Add</button>
                </div>
              </>
            ) : (
              <>
                <h4 className="text-red-600 font-black text-xs uppercase mb-2">Delete {modalContext?.value}</h4>
                <div className="flex justify-end gap-3 mt-8">
                  <button onClick={() => setActiveModal(null)} className="px-6 py-2 text-slate-400">Cancel</button>
                  <button onClick={processDeleteCategory} className="px-8 py-3 bg-red-500 text-white rounded-lg">Delete</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="w-full flex flex-col gap-2">
        <div className="flex items-center gap-2 text-accent-gold mb-1">
          <span className="h-[1px] w-8 bg-accent-gold"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Transaction Registry</span>
        </div>
        <h1 className="text-navy-deep text-4xl font-extralight tracking-tight">Terminal <span className="font-black text-primary">Input</span></h1>
      </div>

      {/* Input Terminal */}
      <div className="w-full bg-white rounded-xl border border-border-light p-6 shadow-sm overflow-x-auto">
        <h3 className="text-navy-deep text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-accent-gold text-2xl">workspace_premium</span>
          New Ledger Entry
        </h3>
        
        <div className="flex flex-row gap-4 items-end w-full min-w-[1350px] mb-6">
          {/* Enhanced Type & Account Selection */}
          <div className="flex flex-col gap-1.5 w-[16%] min-w-[240px]" translate="no">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-slate-500/80">Type & Account</label>
            <div className="flex flex-col gap-1.5">
              <select 
                ref={typeRef}
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value, subTypeIndex: 0})}
                className="w-full bg-slate-50 border-border-light text-navy-deep rounded-lg focus:ring-primary h-10 text-xs font-bold uppercase"
              >
                <option value="">SELECT TYPE</option>
                <option value="Bank +">BANK +</option>
                <option value="Cash">CASH</option>
                <option value="Credit +">CREDIT +</option>
              </select>

              {(formData.type === 'Bank +' || formData.type === 'Credit +') && (
                <div className="flex items-center gap-1.5 p-1 bg-slate-50 rounded-lg border border-border-light transition-all h-10">
                  <div className="flex-1 relative flex items-center h-full">
                    <div className="absolute left-2.5 z-10 flex items-center pointer-events-none">
                      <BrandIcon brand={currentSubType?.brand || 'generic'} className="size-4" />
                    </div>
                    {/* Integrated selector with suppressed browser arrows and better alignment */}
                    <select 
                      value={formData.subTypeIndex}
                      onChange={(e) => setFormData({...formData, subTypeIndex: parseInt(e.target.value)})}
                      className="w-full h-full bg-white border border-border-light text-primary rounded-md focus:ring-primary pl-9 pr-8 text-base font-bold font-mono tracking-widest appearance-none outline-none"
                      style={{ backgroundImage: 'none' }} // Ensure tailwind forms plugin arrow is gone
                    >
                      {(formData.type === 'Bank +' ? accounts.banks : accounts.credits).map((acc, idx) => (
                        <option key={acc.masked + idx} value={idx}>{acc.masked}</option>
                      ))}
                    </select>
                    {/* Only one custom refined arrow */}
                    <div className="absolute right-2 pointer-events-none text-slate-400 flex items-center h-full">
                      <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => openAddAccountModal(formData.type === 'Bank +' ? 'Bank' : 'Credit')}
                    className="size-8 bg-white text-slate-400 hover:bg-primary hover:text-white rounded-md flex items-center justify-center transition-all border border-border-light shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xl font-bold">add</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-[9%] min-w-[120px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-slate-500/80">Date</label>
            <input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full bg-slate-50 border-border-light rounded-lg h-10 text-xs font-mono text-navy-deep/80 appearance-none outline-none" />
          </div>

          {/* Category Hierarchy with dynamic width & fixed height */}
          <div className="flex flex-col gap-1.5 min-w-max" translate="no">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-slate-500/80">Why (Category)</label>
            <div className="flex gap-1.5 items-center">
              {[1, 2, 3].map((lvl) => {
                const key = `l${lvl}` as 'l1' | 'l2' | 'l3';
                const opts = lvl === 1 ? l1Options : lvl === 2 ? l2Options : l3Options;
                const changeHandler = lvl === 1 ? handleL1Change : lvl === 2 ? handleL2Change : (v:string) => setFormData({...formData, l3: v});
                return (
                  <React.Fragment key={lvl}>
                    <div className="flex items-center h-10 bg-slate-50 rounded-lg border border-border-light overflow-hidden focus-within:ring-1 focus-within:ring-primary shrink-0 transition-all">
                      <div className="relative flex items-center h-full group">
                        <span className="invisible px-3 text-[10px] font-bold uppercase whitespace-pre min-w-[70px] block">
                          {formData[key]}
                        </span>
                        <span className="invisible pr-8 block"></span>
                        
                        <select 
                          value={formData[key]} 
                          onChange={(e) => changeHandler(e.target.value)} 
                          className="absolute inset-0 w-full h-full bg-transparent border-none text-[10px] font-bold uppercase pl-3 pr-8 focus:ring-0 cursor-pointer appearance-none z-10 text-navy-deep/80"
                          style={{ backgroundImage: 'none' }}
                        >
                          {opts.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                        <div className="absolute right-2 pointer-events-none text-slate-300 z-0 flex items-center h-full">
                          <span className="material-symbols-outlined text-[14px]">expand_more</span>
                        </div>
                      </div>
                      <div className="flex flex-col border-l border-border-light bg-white/40 h-full justify-center">
                        <button onClick={() => { setModalContext({level: lvl as 1|2|3}); setActiveModal('add'); setNewNameInput(''); }} className="px-2.5 flex-1 flex items-center text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-[10px] font-bold">add</span></button>
                        <button onClick={() => { setModalContext({level: lvl as 1|2|3, value: formData[key]}); setActiveModal('delete'); }} className="px-2.5 flex-1 flex items-center border-t border-border-light/50 text-slate-400 hover:text-red-500 transition-colors"><span className="material-symbols-outlined text-[10px] font-bold">remove</span></button>
                      </div>
                    </div>
                    {lvl < 3 && <span className="text-slate-300 font-bold px-0.5">/</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-[10%] min-w-[130px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-slate-500/80">Details</label>
            <input type="text" placeholder="Description" value={formData.details} onChange={(e) => setFormData({...formData, details: e.target.value})} className="w-full bg-slate-50 border-border-light rounded-lg h-10 text-xs text-navy-deep/80 outline-none" />
          </div>

          <div className="flex flex-col gap-1.5 w-[7%] min-w-[90px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-right mr-1 text-slate-500/80">In</label>
            <input type="number" placeholder="0.00" value={formData.in} onChange={(e) => setFormData({...formData, in: e.target.value})} className="w-full bg-slate-50 border-border-light rounded-lg h-10 text-xs text-right font-mono text-navy-deep/80 outline-none" />
          </div>

          <div className="flex flex-col gap-1.5 w-[7%] min-w-[90px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-right mr-1 text-slate-500/80">Out</label>
            <input type="number" placeholder="0.00" value={formData.out} onChange={(e) => setFormData({...formData, out: e.target.value})} className="w-full bg-slate-50 border-border-light rounded-lg h-10 text-xs text-right font-mono text-navy-deep/80 outline-none" />
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 text-slate-500/80">Remarks</label>
            <input type="text" placeholder="Notes" value={formData.remarks} onChange={(e) => setFormData({...formData, remarks: e.target.value})} className="w-full bg-slate-50 border-border-light rounded-lg h-10 text-xs text-navy-deep/80 outline-none" />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-light/50">
          <button onClick={() => setFormData({...formData, type: '', details: '', in: '', out: '', remarks: ''})} className="h-10 px-6 text-[10px] font-black uppercase text-slate-400 hover:text-navy-deep">Reset Entry</button>
          <button onClick={handleCommit} className="h-10 px-8 bg-primary text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-primary/20 transition-all hover:bg-navy-deep">Commit Transaction</button>
        </div>
      </div>

      {/* Registry Table with Improved Action Column */}
      <div className="w-full bg-white rounded-xl border border-border-light overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1350px]">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest border-b border-border-light">
                <th className="px-6 py-4 w-[16%]">Type / Account</th>
                <th className="px-6 py-4 w-[9%]">Date</th>
                <th className="px-6 py-4 text-center">Why (Category)</th>
                <th className="px-6 py-4 w-[12%]">Details</th>
                <th className="px-6 py-4 w-[8%] text-right">In</th>
                <th className="px-6 py-4 w-[8%] text-right">Out</th>
                <th className="px-6 py-4 text-center">Remarks</th>
                <th className="px-6 py-4 w-[60px] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5" translate="no">
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-black text-navy-deep uppercase tracking-tight">{entry.type}</span>
                      {entry.subType && (
                        <div className="flex items-center gap-2">
                          <BrandIcon brand={entry.subTypeBrand || 'generic'} className="size-4" />
                          <span className="text-[14px] font-mono font-black text-primary tracking-widest leading-none">{entry.subType}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[12px] font-mono font-bold text-slate-500 uppercase">{entry.date}</td>
                  <td className="px-6 py-5" translate="no">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-[10px] text-accent-gold font-bold bg-accent-gold/5 px-2.5 py-1 rounded border border-accent-gold/20 uppercase tracking-tight">{entry.category.l1}</span>
                      <span className="text-slate-300 font-bold">/</span>
                      <span className="text-[10px] text-accent-gold font-bold bg-accent-gold/5 px-2.5 py-1 rounded border border-accent-gold/20 uppercase tracking-tight">{entry.category.l2}</span>
                      <span className="text-slate-300 font-bold">/</span>
                      <span className="text-[10px] text-accent-gold font-bold bg-accent-gold/5 px-2.5 py-1 rounded border border-accent-gold/20 uppercase tracking-tight">{entry.category.l3}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-[13px] font-bold text-navy-deep/80">{entry.details}</td>
                  <td className="px-6 py-5 text-right font-mono text-[15px] text-navy-deep font-black tracking-tight">{entry.in?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '--'}</td>
                  <td className="px-6 py-5 text-right font-mono text-[15px] text-navy-deep font-black tracking-tight">{entry.out?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '--'}</td>
                  <td className="px-6 py-5 text-[12px] text-slate-400 italic text-center font-medium">{entry.remarks}</td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => deleteEntry(entry.id)}
                      className="size-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-24 text-center text-slate-400 text-sm italic font-medium tracking-wide">
                    Session terminal currently empty. Begin recording entries above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionRegistry;
