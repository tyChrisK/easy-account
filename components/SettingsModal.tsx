
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../App';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentProfile, onSave }) => {
  const [currency, setCurrency] = useState(currentProfile.currency);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(currentProfile.name);
  const [email, setEmail] = useState(currentProfile.email);
  const [initials, setInitials] = useState(currentProfile.initials);

  // Sync state if props change while open
  useEffect(() => {
    if (isOpen) {
      setName(currentProfile.name);
      setEmail(currentProfile.email);
      setInitials(currentProfile.initials);
      setCurrency(currentProfile.currency);
    }
  }, [isOpen, currentProfile]);

  const handleInitialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Enforce max 2 characters, uppercase, and English letters only
    const val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    setInitials(val);
  };

  const handleSaveChanges = () => {
    const newProfile: UserProfile = {
      name,
      email,
      initials,
      currency
    };

    // Prepare JSON export
    const settingsData = {
      ...newProfile,
      exportedAt: new Date().toISOString(),
      type: 'account_settings'
    };

    // Download JSON
    const blob = new Blob([JSON.stringify(settingsData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `account_settings_${initials}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Update App State
    onSave(newProfile);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] modal-overlay flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl gold-modal-border overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-accent-gold mb-0.5">
              <span className="h-[1px] w-4 bg-accent-gold"></span>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Preferences</span>
            </div>
            <h2 className="text-navy-deep text-2xl font-extralight tracking-tight">Account <span className="font-black text-primary">Settings</span></h2>
          </div>
          <button onClick={onClose} className="text-slate-300 hover:text-navy-deep transition-colors">
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        
        <div className="p-8 space-y-8">
            {/* My Profile Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-accent-gold text-lg">person</span>
                    <h3 className="text-navy-deep text-[11px] font-black uppercase tracking-widest">My Profile</h3>
                </div>
                
                {!isEditingProfile ? (
                  <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100 group transition-all duration-300 hover:border-accent-gold/20">
                      <div className="flex items-center gap-4">
                          <div className="flex size-12 items-center justify-center rounded-full bg-white text-accent-gold font-bold text-lg border border-accent-gold/20 shadow-sm">
                              {initials || 'JD'}
                          </div>
                          <div className="flex flex-col">
                              <p className="text-navy-deep font-bold text-sm">{name}</p>
                              <p className="text-slate-500 text-xs">{email}</p>
                          </div>
                      </div>
                      <button 
                        onClick={() => setIsEditingProfile(true)}
                        className="px-3 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-accent-gold border border-accent-gold/20 bg-white rounded-md opacity-70 hover:opacity-100 hover:bg-accent-gold hover:text-white transition-all duration-300"
                      >
                          Edit
                      </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 p-4 rounded-lg bg-slate-50 border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex items-start gap-4">
                      <div className="flex size-12 items-center justify-center rounded-full bg-white text-accent-gold font-bold text-lg border border-accent-gold/20 shadow-sm shrink-0">
                          {initials || 'JD'}
                      </div>
                      <div className="flex-1 flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Initials</label>
                          <input 
                            type="text" 
                            value={initials}
                            onChange={handleInitialsChange}
                            placeholder="JD"
                            className="w-full bg-white border border-border-light rounded-md h-9 px-3 text-sm font-bold text-navy-deep focus:border-primary focus:ring-primary placeholder-slate-300"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white border border-border-light rounded-md h-9 px-3 text-sm font-bold text-navy-deep focus:border-primary focus:ring-primary"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border border-border-light rounded-md h-9 px-3 text-sm font-bold text-navy-deep focus:border-primary focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                       <button 
                        onClick={() => setIsEditingProfile(false)}
                        className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-md hover:bg-navy-deep transition-colors shadow-sm"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
            </section>

            {/* Currency Settings Section */}
            <section>
                <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-accent-gold text-lg">payments</span>
                    <h3 className="text-navy-deep text-[11px] font-black uppercase tracking-widest">Currency Settings</h3>
                </div>
                <div className="space-y-3">
                    <div 
                        onClick={() => setCurrency('USD')}
                        className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 group ${currency === 'USD' ? 'bg-slate-50 border-primary/30 ring-1 ring-primary/10' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className={`font-bold text-sm transition-colors ${currency === 'USD' ? 'text-primary' : 'text-navy-deep'}`}>USD ($)</span>
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">Standard 2-Decimal Point Default</span>
                            </div>
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${currency === 'USD' ? 'border-primary' : 'border-slate-200'}`}>
                                <div className={`size-2.5 rounded-full bg-primary transition-transform duration-300 ${currency === 'USD' ? 'scale-100' : 'scale-0'}`}></div>
                            </div>
                        </div>
                    </div>

                    <div 
                        onClick={() => setCurrency('KRW')}
                        className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 group ${currency === 'KRW' ? 'bg-slate-50 border-primary/30 ring-1 ring-primary/10' : 'border-slate-100 hover:bg-slate-50'}`}
                    >
                        <div className="flex-1 flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className={`font-bold text-sm transition-colors ${currency === 'KRW' ? 'text-primary' : 'text-navy-deep'}`}>KRW (원)</span>
                                <span className="text-slate-400 text-[10px] uppercase font-bold tracking-tighter">No Decimal Points Selection</span>
                            </div>
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${currency === 'KRW' ? 'border-primary' : 'border-slate-200'}`}>
                                <div className={`size-2.5 rounded-full bg-primary transition-transform duration-300 ${currency === 'KRW' ? 'scale-100' : 'scale-0'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button onClick={onClose} className="h-10 px-6 rounded-lg text-[10px] font-black text-slate-400 hover:text-navy-deep transition-all uppercase tracking-widest">
                Cancel
            </button>
            <button onClick={handleSaveChanges} className="h-10 px-8 rounded-lg bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-navy-deep transition-all active-tab-glow shadow-md shadow-primary/20">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;
