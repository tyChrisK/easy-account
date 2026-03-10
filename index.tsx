
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TransactionRegistry from './components/TransactionRegistry';
import BalanceSetup from './components/BalanceSetup';
import EquityReport from './components/EquityReport';
import EarningReport from './components/EarningReport';
import SuccessModal from './components/SuccessModal';
import SettingsModal from './components/SettingsModal';
import { AppView, LedgerEntry, BalanceState } from './types';

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  currency: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(() => {
    const saved = localStorage.getItem('easy_account_view');
    return (saved as AppView) || AppView.SETUP;
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [recordedCapital, setRecordedCapital] = useState<number>(() => {
    const saved = localStorage.getItem('easy_account_capital');
    return saved ? parseFloat(saved) : 0;
  });
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(() => {
    const saved = localStorage.getItem('easy_account_setup_complete');
    return saved === 'true';
  });
  const [entries, setEntries] = useState<LedgerEntry[]>(() => {
    const saved = localStorage.getItem('easy_account_entries');
    return saved ? JSON.parse(saved) : [];
  });

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('easy_account_profile');
    return saved ? JSON.parse(saved) : {
      name: 'John Doe',
      email: 'john.doe@easyaccount.com',
      initials: 'JD',
      currency: 'USD'
    };
  });

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('easy_account_entries', JSON.stringify(entries));
    localStorage.setItem('easy_account_profile', JSON.stringify(userProfile));
    localStorage.setItem('easy_account_setup_complete', isSetupComplete.toString());
    localStorage.setItem('easy_account_capital', recordedCapital.toString());
    localStorage.setItem('easy_account_view', currentView);
  }, [entries, userProfile, isSetupComplete, recordedCapital, currentView]);

  const handleSaveSetup = (capital: number, balances: Omit<BalanceState, 'capital'>) => {
    setRecordedCapital(capital);
    
    // Clear existing entries and map initial balances to new entries
    const newEntries: LedgerEntry[] = [];
    const date = new Date().toISOString().split('T')[0];
    const category = { l1: 'EQUITY', l2: 'OPENING', l3: 'BALANCE' };

    if (balances.cash > 0) {
      newEntries.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'CASH',
        date,
        category,
        details: 'Initial Cash',
        in: balances.cash,
        out: null,
        remarks: 'Opening Balance'
      });
    }

    if (balances.bank > 0) {
      newEntries.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'BANK +',
        subType: '***0000', // Default
        date,
        category,
        details: 'Initial Bank',
        in: balances.bank,
        out: null,
        remarks: 'Opening Balance'
      });
    }

    if (balances.stock > 0) {
      newEntries.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'CASH',
        date,
        category: { ...category, l3: 'ASSET' },
        details: 'Initial Stock',
        in: balances.stock,
        out: null,
        remarks: 'Stock Asset Value'
      });
    }

    if (balances.loan > 0) {
      newEntries.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'CREDIT +',
        subType: '**-0000', // Default
        date,
        category: { ...category, l3: 'LIABILITY' },
        details: 'Initial Loan',
        in: null,
        out: balances.loan,
        remarks: 'Loan Liability'
      });
    }

    if (balances.card > 0) {
      newEntries.push({
        id: Math.random().toString(36).substr(2, 9),
        type: 'CREDIT +',
        subType: '**-0000', // Default
        date,
        category: { ...category, l3: 'LIABILITY' },
        details: 'Initial Card',
        in: null,
        out: balances.card,
        remarks: 'Card Liability'
      });
    }

    setEntries(newEntries);
    setShowSuccess(true);
  };

  const handleGetStarted = () => {
    setShowSuccess(false);
    setIsSetupComplete(true);
    setCurrentView(AppView.TERMINAL);
  };

  const handleSaveSettings = (newProfile: UserProfile, shouldReset: boolean = false) => {
    if (shouldReset) {
      // Clear all data if currency changed and user confirmed
      setEntries([]);
      setRecordedCapital(0);
      setIsSetupComplete(false);
      setCurrentView(AppView.SETUP);
      localStorage.removeItem('easy_account_entries');
      localStorage.removeItem('easy_account_setup_complete');
      localStorage.removeItem('easy_account_capital');
    }
    setUserProfile(newProfile);
    setIsSettingsOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.TERMINAL:
        return <TransactionRegistry entries={entries} onUpdateEntries={setEntries} />;
      case AppView.EQUITY_REPORT:
        return <EquityReport entries={entries} userProfile={userProfile} />;
      case AppView.EARNING_REPORT:
        return <EarningReport entries={entries} userProfile={userProfile} />;
      case AppView.SETUP:
      default:
        return <BalanceSetup onSave={handleSaveSetup} />;
    }
  };

  return (
    <>
      <div className={`flex flex-col min-h-screen ${isSettingsOpen ? 'blur-[2px] pointer-events-none select-none' : ''}`}>
        <Header 
          currentView={currentView} 
          onNavigate={(view) => setCurrentView(view)} 
          isSetupComplete={isSetupComplete}
          onOpenSettings={() => setIsSettingsOpen(true)}
          userInitials={userProfile.initials}
        />
        
        <main className="flex-1">
          {renderView()}
        </main>

        <Footer />
      </div>

      {showSuccess && (
        <SuccessModal 
          amount={recordedCapital} 
          onClose={handleGetStarted} 
        />
      )}

      {isSettingsOpen && (
        <SettingsModal 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)}
          currentProfile={userProfile}
          onSave={handleSaveSettings}
          isSetupComplete={isSetupComplete}
        />
      )}
    </>
  );
};

export default App;
