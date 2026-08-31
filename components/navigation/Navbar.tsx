import React from 'react';
import { Home, Camera, User, MessageSquare, PlusCircle } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isGhostActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ activePage, onNavigate, isGhostActive = false }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Flow' },
    { id: 'vista', icon: Camera, label: 'Vista' },
    { id: 'story-creator', icon: PlusCircle, label: 'Create', isSpecial: true },
    { id: 'hush', icon: MessageSquare, label: 'Hush' },
    { id: 'persona', icon: User, label: 'Persona' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-3 sm:p-4 z-[100] pointer-events-none max-w-lg mx-auto md:hidden">
      <nav 
        aria-label="Mobile Bottom Navigation"
        className={`pointer-events-auto px-3 py-2 flex justify-around items-center transition-all duration-500 rounded-[2.5rem] shadow-2xl border ${
          isGhostActive 
            ? 'bg-[var(--app-primary)] text-[var(--app-accent-light)] border-[color-mix(in_srgb,var(--app-accent)_30%,transparent)]' 
            : 'bg-[var(--app-primary)] text-white border-white/5'
        }`}
      >
        <span className="sr-only" aria-live="polite">
          {isGhostActive ? 'Ghost mode is active' : 'Ghost mode is off'}
        </span>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || 
            (item.id === 'vista' && activePage === 'explore') ||
            (item.id === 'story-creator' && activePage === 'story-creator');
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label="Create new story or post"
                className={`flex items-center justify-center -translate-y-2 p-2.5 rounded-full shadow-lg transition-transform active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent-light)] ${
                  isGhostActive
                    ? 'bg-[var(--app-accent)] text-[#062B34] ring-4 ring-[#03171C]'
                    : 'bg-gradient-to-tr from-[var(--app-accent)] to-[var(--app-accent-light)] text-slate-900 ring-4 ring-[var(--app-primary)]'
                }`}
              >
                <Icon size={24} strokeWidth={2.5} />
              </button>
            );
          }

          if (isActive) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                aria-label={`Navigate to ${item.label}`}
                aria-current="page"
                className={`nav-button flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 transform scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent-light)] ${
                  isGhostActive 
                    ? 'bg-[var(--app-accent)] text-[#062B34] font-black shadow-md' 
                    : 'bg-white/15 text-[var(--app-accent)] font-bold shadow-sm'
                }`}
              >
                <Icon size={18} strokeWidth={3} fill="currentColor" aria-hidden="true" />
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              aria-label={`Navigate to ${item.label}`}
              className={`nav-button flex flex-col items-center justify-center gap-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent-light)] rounded-full p-2 ${
                isGhostActive ? 'text-[#8AADB5] hover:text-[var(--app-accent-light)]' : 'text-white/70 hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={2} aria-hidden="true" />
              <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
});

export default Navbar;
