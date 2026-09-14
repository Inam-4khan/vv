import React from 'react';
import { 
  Home, 
  Compass, 
  MessageSquare, 
  User, 
  Ghost, 
  Sun, 
  Moon, 
  Sparkles, 
  Plus, 
  LogOut 
} from 'lucide-react';
import { Page, User as UserType } from '../../types';
import { OptimizedImg } from '../common/OptimizedImg';

interface DesktopSidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
  isGhostActive?: boolean;
  onToggleGhost?: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  currentUser?: UserType | null;
  onLogout?: () => void;
}

export const DesktopSidebar = React.forwardRef<HTMLElement, DesktopSidebarProps>(({
  activePage,
  onNavigate,
  isGhostActive = false,
  onToggleGhost,
  isDarkMode = false,
  onToggleTheme,
  currentUser,
  onLogout,
}, ref) => {
  const navItems = [
    { id: 'home' as Page, icon: Home, label: 'Flow', badge: undefined },
    { id: 'explore' as Page, icon: Compass, label: 'Explore', badge: undefined },
    { id: 'hush' as Page, icon: MessageSquare, label: 'Hush Whispers', badge: '3' },
    { id: 'persona' as Page, icon: User, label: 'Persona Profile', badge: undefined },
  ];

  return (
    <aside
      ref={ref}
      className={`hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 border-r shrink-0 p-5 z-40 transition-colors duration-500 overflow-y-auto ${
        isGhostActive
          ? 'bg-[var(--app-bg-ghost)] text-[#F1FAEE] border-[color-mix(in_srgb,var(--app-accent-light)_15%,transparent)]'
          : 'bg-[var(--app-primary)] text-white border-white/10'
      }`}
    >
      {/* App Brand Logo Header */}
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => onNavigate('home')} 
          aria-label="Go to home flow page"
          className="w-full text-left cursor-pointer flex items-center gap-3 px-2 pt-1 group focus:outline-none"
        >
          <div className={`p-2.5 rounded-2xl transition-all duration-300 shadow-md ${
            isGhostActive 
              ? 'bg-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] text-[var(--app-accent-light)]' 
              : 'bg-white/10 text-[var(--app-accent-light)] group-hover:bg-white/20'
          }`}>
            <Sparkles size={24} className="group-hover:rotate-12 transition-transform duration-300" aria-hidden="true" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl font-black font-montserrat tracking-tight">VIZU</h1>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Proximity Mesh Active" />
            </div>
            <p className="text-[9px] font-mono tracking-widest opacity-60 uppercase">PROXIMITY SOCIAL</p>
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
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-sm font-bold tracking-tight transition-all duration-200 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-accent)] cursor-pointer ${
                  isActive
                    ? isGhostActive
                      ? 'bg-[var(--app-accent)] text-[#062B34] font-black shadow-md'
                      : 'bg-white/15 text-white border border-white/15 shadow-md'
                    : isGhostActive
                    ? 'text-[#8AADB5] hover:text-[#F1FAEE] hover:bg-[#0C3B46]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2.5 : 2}
                    aria-hidden="true"
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? (isGhostActive ? 'text-[#062B34]' : 'text-[var(--app-accent-light)]') : ''
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                    isActive 
                      ? 'bg-black/20 text-current' 
                      : item.badge === 'LIVE'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      : 'bg-[var(--app-accent)]/20 text-[var(--app-accent-light)]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Primary Create Action Button */}
        <button
          onClick={() => onNavigate('story-creator')}
          className="w-full py-3 px-4 rounded-2xl bg-[var(--app-accent)] hover:bg-teal-400 text-[#062B34] font-black text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={18} strokeWidth={3} />
          <span>New Moment / Story</span>
        </button>
      </div>

      {/* Footer / Ghost Mode, Theme Mode, and User Profile */}
      <div className="pt-4 border-t border-white/10 space-y-3">
        {/* Toggle Switches */}
        <div className="grid grid-cols-2 gap-2">
          {onToggleGhost && (
            <button
              type="button"
              onClick={onToggleGhost}
              aria-pressed={isGhostActive}
              aria-label={`Toggle Ghost Mode, currently ${isGhostActive ? 'on' : 'off'}`}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                isGhostActive
                  ? 'bg-[var(--app-primary)] text-[var(--app-accent-light)] border-[var(--app-accent)]/40 shadow-inner'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
              }`}
            >
              <Ghost size={15} aria-hidden="true" className={isGhostActive ? 'text-[var(--app-accent-light)] animate-pulse' : 'text-white/80'} />
              <span>{isGhostActive ? 'Ghost ON' : 'Ghost'}</span>
            </button>
          )}

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              aria-pressed={isDarkMode}
              aria-label={`Toggle Theme Mode, currently ${isDarkMode ? 'dark' : 'light'}`}
              className={`flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl text-xs font-bold transition-all border cursor-pointer ${
                isDarkMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-white/5 text-white/80 border-white/10 hover:bg-white/10'
              }`}
            >
              {isDarkMode ? <Sun size={15} className="text-amber-300" /> : <Moon size={15} className="text-white/80" />}
              <span>{isDarkMode ? 'Dark' : 'Light'}</span>
            </button>
          )}
        </div>

        {/* User Profile Card */}
        {currentUser && (
          <div 
            onClick={() => onNavigate('persona')}
            className="group flex items-center justify-between p-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative w-9 h-9 shrink-0">
                <OptimizedImg
                  src={currentUser.avatar}
                  alt={currentUser.displayName}
                  width={36}
                  height={36}
                  className="w-9 h-9 rounded-xl object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate text-white group-hover:text-[var(--app-accent-light)] transition-colors">
                  {currentUser.displayName}
                </p>
                <p className="text-[10px] text-white/60 truncate font-mono">
                  @{currentUser.username}
                </p>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLogout();
                }}
                className="p-1.5 rounded-xl text-white/50 hover:text-rose-400 hover:bg-white/10 transition-colors"
                title="Log out of session"
                aria-label="Log out"
              >
                <LogOut size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
});

DesktopSidebar.displayName = 'DesktopSidebar';

