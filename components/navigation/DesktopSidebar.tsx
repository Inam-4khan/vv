import React from 'react';
import { Home, Compass, MessageSquare, User, Ghost, Sun, Moon, Sparkles, PlusCircle } from 'lucide-react';
import { Page } from '../../types';

interface DesktopSidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  isGhostActive?: boolean;
  onToggleGhost?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const DesktopSidebar = React.forwardRef<HTMLElement, DesktopSidebarProps>(({
  activePage,
  onNavigate,
  isGhostActive = false,
  onToggleGhost,
  isDarkMode = false,
  onToggleTheme,
}, ref) => {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Flow' },
    { id: 'explore' as Page, icon: Compass, label: 'Explore' },
    { id: 'story-creator' as Page, icon: PlusCircle, label: 'Create' },
    { id: 'hush' as Page, icon: MessageSquare, label: 'Hush' },
    { id: 'persona' as Page, icon: User, label: 'Persona' },
  ];

  return (
    <aside
      ref={ref}
      className={`hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r shrink-0 p-6 z-40 transition-colors duration-500 overflow-y-auto ${
        isGhostActive
          ? 'bg-[var(--app-bg-ghost)] text-[#F1FAEE] border-[color-mix(in_srgb,var(--app-accent-light)_15%,transparent)]'
          : 'bg-[var(--app-primary)] text-white border-white/10'
      }`}
    >
      {/* App Brand Logo Header */}
      <div className="space-y-8">
        <button
          type="button"
          onClick={() => onNavigate('home')} 
          aria-label="Go to home flow page"
          className="w-full text-left cursor-pointer flex items-center gap-3 px-2 pt-2 group focus:outline-none"
        >
          <div className={`p-2 rounded-2xl transition-all duration-300 ${
            isGhostActive ? 'bg-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] text-[var(--app-accent-light)]' : 'bg-white/10 text-[var(--app-bg)]'
          }`}>
            <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-black font-montserrat tracking-tight">VIZU</h1>
            <p className="text-[10px] font-mono tracking-widest opacity-50 uppercase">Social Flow</p>
          </div>
        </button>

        {/* Navigation Items */}
        <nav className="space-y-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id || (item.id === 'home' && activePage === ('home' as Page));

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
                aria-current={isActive ? 'page' : undefined}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-bold tracking-tight transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] ${
                  isActive
                    ? isGhostActive
                      ? 'bg-[var(--app-accent)] text-primary dark:text-white font-black shadow-md'
                      : 'bg-white/15 text-[var(--app-bg)] border border-white/10 shadow-md'
                    : isGhostActive
                    ? 'text-[#8AADB5] hover:text-[#F1FAEE] hover:bg-[#0C3B46]'
                    : 'text-primary/40 dark:text-white/40 hover:text-primary dark:text-white hover:bg-white/5'
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.5 : 2}
                  aria-hidden="true"
                  className={`transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? (isGhostActive ? 'text-primary dark:text-white' : 'text-[var(--app-accent)]') : ''
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Ghost Mode & Theme Mode Switcher */}
      <div className="pt-4 border-t border-white/10 space-y-2">
        {onToggleGhost && (
          <button
            type="button"
            onClick={onToggleGhost}
            aria-pressed={isGhostActive}
            aria-label={`Toggle Ghost Mode, currently ${isGhostActive ? 'on' : 'off'}`}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-primary)] ${
              isGhostActive
                ? 'bg-[var(--app-primary)] text-[var(--app-accent-light)] border-[color-mix(in_srgb,var(--app-accent)_40%,transparent)] shadow-inner'
                : 'bg-white/5 text-primary/40 dark:text-white/40 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Ghost size={18} aria-hidden="true" className={isGhostActive ? 'text-[var(--app-accent-light)] animate-pulse' : 'text-primary/40 dark:text-white/40'} />
              <span>Ghost Mode</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono ${
              isGhostActive ? 'bg-[color-mix(in_srgb,var(--app-accent)_30%,transparent)] text-[var(--app-accent-light)]' : 'bg-white/10 text-primary/40 dark:text-white/40'
            }`}>
              {isGhostActive ? 'ON' : 'OFF'}
            </span>
            <span className="sr-only" aria-live="polite">
              Ghost mode {isGhostActive ? 'on' : 'off'}
            </span>
          </button>
        )}

        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            aria-pressed={isDarkMode}
            aria-label={`Toggle Theme Mode, currently ${isDarkMode ? 'dark' : 'light'}`}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-primary)] ${
              isDarkMode
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-white/5 text-primary/40 dark:text-white/40 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isDarkMode ? <Sun size={18} className="text-amber-300" aria-hidden="true" /> : <Moon size={18} className="text-primary/40 dark:text-white/40" aria-hidden="true" />}
              <span>Theme Mode</span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-mono ${
              isDarkMode ? 'bg-amber-500/30 text-amber-300' : 'bg-white/10 text-primary/40 dark:text-white/40'
            }`}>
              {isDarkMode ? 'DARK' : 'LIGHT'}
            </span>
          </button>
        )}
      </div>
    </aside>
  );
});

DesktopSidebar.displayName = 'DesktopSidebar';
