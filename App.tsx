
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TransactionRegistry from './components/TransactionRegistry';
import BalanceSetup from './components/BalanceSetup';
import EquityReport from './components/EquityReport';
import EarningReport from './components/EarningReport';
import SuccessModal from './components/SuccessModal';
import SettingsModal from './components/SettingsModal';
import { AppView } from './types';

export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  currency: string;
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.SETUP);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [recordedCapital, setRecordedCapital] = useState(0);
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@easyaccount.com',
    initials: 'JD',
    currency: 'USD'
  });

  const handleSaveSetup = (capital: number) => {
    setRecordedCapital(capital);
    setShowSuccess(true);
  };

  const handleGetStarted = () => {
    setShowSuccess(false);
    setIsSetupComplete(true);
    setCurrentView(AppView.TERMINAL);
  };

  const handleSaveSettings = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    setIsSettingsOpen(false);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.TERMINAL:
        return <TransactionRegistry />;
      case AppView.EQUITY_REPORT:
        return <EquityReport />;
      case AppView.EARNING_REPORT:
        return <EarningReport />;
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
        />
      )}
    </>
  );
};

export default App;
