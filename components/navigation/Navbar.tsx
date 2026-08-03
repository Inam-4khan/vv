
import React from 'react';
import { Home, Camera, User, MessageSquare } from 'lucide-react';

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  isGhostActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = React.memo(({ activePage, onNavigate, isGhostActive = false }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Flow' },
    { id: 'vista', icon: Camera, label: 'Vista' },
    { id: 'hush', icon: MessageSquare, label: 'Hush' },
    { id: 'persona', icon: User, label: 'Persona' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-[100] pointer-events-none max-w-lg mx-auto md:hidden">
      <nav 
        aria-label="Mobile Bottom Navigation"
        className={`pointer-events-auto px-4 py-3 flex justify-around items-center transition-all duration-500 rounded-[2.5rem] shadow-2xl border ${
          isGhostActive 
            ? 'bg-[#062B34] text-[#80FFEC] border-[#2EC4B6]/30' 
            : 'bg-[#062B34] text-white border-white/5'
        }`}
      >
        <span className="sr-only" aria-live="polite">
          {isGhostActive ? 'Ghost mode is active' : 'Ghost mode is off'}
        </span>

        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id || (item.id === 'vista' && (activePage === 'explore' || activePage === 'story-creator'));
          
          if (isActive) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate(item.id);
                  }
                }}
                aria-label={`Navigate to ${item.label}`}
                aria-current="page"
                className={`nav-button flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full transition-all duration-300 transform scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80FFEC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#062B34] ${
                  isGhostActive 
                    ? 'bg-[#2EC4B6] text-[#062B34] font-black shadow-md' 
                    : 'bg-white/10 text-[#FFF9E6]'
                }`}
              >
                <Icon size={20} strokeWidth={3} fill="currentColor" aria-hidden="true" />
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onNavigate(item.id);
                }
              }}
              aria-label={`Navigate to ${item.label}`}
              className={`nav-button flex flex-col items-center justify-center gap-0.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#80FFEC] focus-visible:ring-offset-2 focus-visible:ring-offset-[#062B34] rounded-full p-2 ${
                isGhostActive ? 'text-[#8AADB5] hover:text-[#80FFEC]' : 'text-white/60 hover:text-white'
              }`}
            >
              <Icon size={20} strokeWidth={2} aria-hidden="true" />
              <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
});
