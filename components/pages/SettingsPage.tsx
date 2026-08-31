
import React, { useState } from 'react';
import { ArrowLeft, Bell, Globe, LogOut, ChevronRight, Users, Moon, ShieldCheck, ShieldAlert, UserCheck, Heart, Sun, Ghost } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
  isGhostMode?: boolean;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onToggleGhost?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = React.memo(({
  onBack,
  onLogout,
  isGhostMode = false,
  isDarkMode = false,
  onToggleTheme,
  onToggleGhost,
}) => {
  const [quietHours, setQuietHours] = useState(false);
  const [ageFiltering, setAgeFiltering] = useState(true);
  const [activeCircle, setActiveCircle] = useState<'Everyone' | 'Close Friends' | 'No one'>('Everyone');

  const sections = [
    { title: 'Communication', icon: Bell, items: ['Push Notifications', 'Hush Sounds', 'Recording Quality'] },
    { title: 'Global Discovery', icon: Globe, items: ['Language', 'GPS Precision', 'Persona Sync'] },
    { title: 'Account Support', icon: ShieldCheck, items: ['Verify Identity', 'Help Center', 'About Vizu'] },
  ];

  return (
    <div className="min-h-full pb-24 transition-colors duration-500 bg-[var(--app-bg)] text-slate-900 dark:text-[#F1FAEE]">
      <header className={`p-6 text-slate-900 dark:text-[#F1FAEE] flex items-center justify-between sticky top-0 z-20 shadow-md transition-colors duration-500 ${isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'}`}>
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-xl transition-all active:scale-90" title="Back"><ArrowLeft size={24} /></button>
          <h1 className="text-xl font-bold font-montserrat tracking-tight">Persona Settings</h1>
        </div>
        {onToggleTheme && (
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-xl transition-all bg-amber-500/20 text-amber-300 border border-amber-500/30"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        )}
      </header>

      <div className="p-6 space-y-8 animate-fade-in">
        {/* Privacy Controls */}
        <div className="space-y-4">
          <div className="p-6 rounded-[2.5rem] shadow-xl border transition-colors bg-[var(--app-bg-surface)] border-black/5 dark:border-white/10 text-slate-900 dark:text-[#F1FAEE] ">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-slate-500 dark:text-slate-400 ">
                 <ShieldAlert size={14} className="text-[var(--app-accent)]" /> Privacy Suite
               </h3>
               <div className="bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)] px-3 py-1 rounded-full border border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)]">
                  <span className="text-[8px] font-black text-[var(--app-accent-light)] uppercase tracking-widest">Enhanced</span>
               </div>
            </div>
            
            <div className="space-y-8">
              {/* Ghost Mode Toggle */}
              {onToggleGhost && (
                <div className="flex items-center justify-between group pb-4 border-b border-white/10">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isGhostMode ? 'bg-[color-mix(in_srgb,var(--app-accent-light)_20%,transparent)] text-[var(--app-accent-light)] shadow-inner' : 'bg-white/10 text-slate-500 dark:text-slate-400 '}`}>
                      <Ghost size={24} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-[#F1FAEE] ">Ghost Mode</h4>
                      <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 ">Invisible to nearby users</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    role="switch"
                    aria-checked={isGhostMode}
                    aria-label="Ghost Mode"
                    onClick={onToggleGhost}
                    className={`w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent-light)] ${isGhostMode ? 'bg-[var(--app-accent)]' : 'bg-white/20'}`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-500 ${isGhostMode ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
              )}

              {/* Visibility Circles */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Users size={24} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold">Visibility Circle</h4>
                    <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500 dark:text-slate-400 ' : 'text-slate-500 dark:text-slate-400'}`}>Who can find you in Vista?</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['Everyone', 'Close Friends', 'No one'].map((circle) => (
                    <button 
                      key={circle}
                      onClick={() => setActiveCircle(circle as any)}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                        activeCircle === circle 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105' 
                        : isDarkMode
                        ? 'bg-white/5 text-slate-500 dark:text-slate-400  border-white/10 hover:bg-white/10'
                        : 'bg-primary/5 text-slate-500 dark:text-slate-400 border-transparent hover:bg-primary/10'
                      }`}
                    >
                      {circle === 'Close Friends' ? (
                        <span className="flex items-center justify-center gap-1"><Heart size={8} fill="currentColor" /> Close</span>
                      ) : circle}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quiet Hours / Time Availability */}
              <div className="flex items-center justify-between group pt-4 border-t border-primary/5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${quietHours ? 'bg-orange-100 text-orange-600 shadow-inner' : 'bg-primary/5 text-slate-500 dark:text-slate-400'}`}>
                    <Moon size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Quiet Hours</h4>
                    <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500 dark:text-slate-400 ' : 'text-slate-500 dark:text-slate-400'}`}>Hide persona from 10 PM - 7 AM</p>
                  </div>
                </div>
                <button 
                  type="button"
                  role="switch"
                  aria-checked={quietHours}
                  aria-label="Quiet Hours"
                  onClick={() => setQuietHours(!quietHours)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] ${quietHours ? 'bg-orange-600' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-500 ${quietHours ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Age Filtering */}
              <div className="flex items-center justify-between group pt-4 border-t border-primary/5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${ageFiltering ? 'bg-secondary/10 text-secondary shadow-inner' : 'bg-primary/5 text-slate-500 dark:text-slate-400'}`}>
                    <UserCheck size={24} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Persona Filter</h4>
                    <p className={`text-[10px] font-medium ${isDarkMode ? 'text-slate-500 dark:text-slate-400 ' : 'text-slate-500 dark:text-slate-400'}`}>Auto-filter explicit proximity cards</p>
                  </div>
                </div>
                <button 
                  type="button"
                  role="switch"
                  aria-checked={ageFiltering}
                  aria-label="Persona Filter"
                  onClick={() => setAgeFiltering(!ageFiltering)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] ${ageFiltering ? 'bg-secondary' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-lg transition-transform duration-500 ${ageFiltering ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="space-y-6">
          {sections.map((section, idx) => (
            <div key={section.title} className="animate-fade-in" style={{ animationDelay: `${0.2 + idx * 0.1}s` }}>
              <div className="flex items-center gap-2 mb-4 px-4">
                <section.icon size={16} className="text-secondary" />
                <h4 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-slate-500 dark:text-slate-400 ' : 'text-slate-500 dark:text-slate-400'}`}>{section.title}</h4>
              </div>
              <div className={`rounded-[2.5rem] overflow-hidden border shadow-lg transition-colors ${
                isDarkMode ? 'bg-[#15222D] border-white/10 text-slate-900 dark:text-[#F1FAEE]' : 'bg-white border-black/5 text-slate-900 dark:text-[#F1FAEE]'
              }`}>
                {section.items.map((item, i) => (
                  <button key={item} className={`w-full flex items-center justify-between p-6 text-sm font-bold hover:bg-primary/5 transition-all group ${i < section.items.length - 1 ? (isDarkMode ? 'border-b border-white/10' : 'border-b border-primary/5') : ''}`}>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                    <ChevronRight size={18} className={`${isDarkMode ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'} group-hover:text-secondary transition-colors`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8">
           <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-6 text-red-500 font-black text-xs uppercase tracking-[0.3em] bg-white dark:bg-[#15222D] rounded-[2.5rem] border-2 border-red-100 dark:border-red-900/30 shadow-xl active:scale-95 transition-all hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            <LogOut size={20} strokeWidth={3} />
            Logout
          </button>
          
          <p className={`text-center text-[8px] font-black uppercase tracking-[0.5em] mt-10 mb-8 leading-relaxed ${isDarkMode ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
             VIZU PERSONA ENGINE v2.8.4<br/>
             © 2025 PROTOCOL VIZU
          </p>
        </div>
      </div>
    </div>
  );
});

