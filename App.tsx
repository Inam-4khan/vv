import React, { useState, useEffect, Suspense } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LoadingPage } from './components/pages/LoadingPage';
import { DesktopSidebar } from './components/navigation/DesktopSidebar';
import { Navbar } from './components/navigation/Navbar';
import { User, HushNote } from './types';
import { MOCK_USERS, MOCK_HUSH_NOTES } from './constants';
import { useToast } from './src/context/ToastContext';
import { PageTransition } from './src/components/common/PageTransition';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';
import { InstallPrompt } from './src/components/common/InstallPrompt';
import { useAppState } from './src/context/AppStateContext';
import { useAuth } from './src/context/AuthContext';
import { pathToPage, pageToPath } from './src/router/routes';
import { parseLocalStorage, setLocalStorage, isHushNoteArray } from './src/utils/storage';

export interface AppOutletContext {
  hushNotes: HushNote[];
  isLoadingNotes: boolean;
  handleAddHushNote: (newNote: HushNote) => Promise<void>;
  handleStartOnboarding: () => void;
  handleFinishSplash: () => void;
  handleNextSplash: () => void;
  handleLogin: () => void;
  handleSignup: () => void;
  handleAccountSwitch: (newUser: User) => void;
  toggleGhostMode: () => void;
  toggleThemeMode: () => void;
}

interface ServerNoteResponse {
  id?: string | number;
  _id?: string | number;
  userId?: string | number;
  userUid?: string | number;
  userName?: string;
  username?: string;
  userAvatar?: string | null;
  avatar?: string | null;
  text?: string;
  musicTitle?: string | null;
  musicArtist?: string | null;
  createdAt?: string | number | Date;
  expiresAt?: string | number | Date;
  lat?: number;
  lng?: number;
}

const mapServerToHushNote = (n: ServerNoteResponse): HushNote => ({
  id: String(n.id ?? n._id ?? `note-${Date.now()}`),
  userId: String(n.userUid ?? n.userId ?? 'unknown'),
  username: n.userName ?? n.username ?? 'Explorer',
  avatar: n.userAvatar ?? n.avatar ?? 'https://picsum.photos/seed/anon/200',
  text: n.text ?? '',
  music: n.musicTitle ? { title: n.musicTitle, artist: n.musicArtist ?? '' } : undefined,
  timestamp: n.createdAt
    ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = React.useRef<HTMLElement>(null);
  const sidebarRef = React.useRef<HTMLElement>(null);
  const { showToast } = useToast();
  const {
    setUser,
    splashIndex,
    setSplashIndex,
    isGlobalGhostMode,
    setIsGlobalGhostMode,
    isDarkMode,
    setIsDarkMode,
  } = useAppState();

  const [isGhostTransitioning, setIsGhostTransitioning] = useState(false);
  
  const [hushNotes, setHushNotes] = useState<HushNote[]>(() =>
    parseLocalStorage<HushNote[]>('hush_all_notes', isHushNoteArray, MOCK_HUSH_NOTES)
  );
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const [_hasLoadedNotes, setHasLoadedNotes] = useState(false);
  
  // Guard useAuth safely
  const auth = useAuth();
  const accessToken = auth?.accessToken ?? null;

  // Synchronize notes state with local storage for offline resilience
  useEffect(() => {
    if (hushNotes && hushNotes.length > 0) {
      setLocalStorage('hush_all_notes', hushNotes);
    }
  }, [hushNotes]);
  
  useEffect(() => {
    const controller = new AbortController();

    const fetchNotes = async () => {
      if (!accessToken) {
        return;
      }
      setIsLoadingNotes(true);
      try {
        const res = await fetch('/api/notes', {
          signal: controller.signal,
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const formattedNotes = data.map(mapServerToHushNote);
            setHushNotes(formattedNotes);
            setHasLoadedNotes(true);
          } else if (Array.isArray(data)) {
            setHushNotes([]);
            setHasLoadedNotes(true);
          }
        } else {
          console.warn('Failed to fetch notes from server, status:', res.status);
          setHasLoadedNotes(false);
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') {
          return;
        }
        console.error('Failed to fetch notes:', err);
        setHasLoadedNotes(false);
      } finally {
        setIsLoadingNotes(false);
      }
    };

    fetchNotes();
    return () => controller.abort();
  }, [accessToken]);
  

  const currentPage = pathToPage(location.pathname);

  const handleMainScroll = () => {
    if (mainRef.current && sidebarRef.current) {
      const mainEl = mainRef.current;
      const sidebarEl = sidebarRef.current;
      const maxMainScroll = mainEl.scrollHeight - mainEl.clientHeight;
      const maxSidebarScroll = sidebarEl.scrollHeight - sidebarEl.clientHeight;
      if (maxMainScroll > 0 && maxSidebarScroll > 0) {
        const scrollRatio = mainEl.scrollTop / maxMainScroll;
        sidebarEl.scrollTop = scrollRatio * maxSidebarScroll;
      }
    }
  };

  // Focus management on route change: Focus first h1 or h2 heading, or main element
  useEffect(() => {
    if (mainRef.current) {
      const heading = mainRef.current.querySelector('h1, h2') as HTMLElement | null;
      if (heading) {
        if (!heading.hasAttribute('tabindex')) {
          heading.setAttribute('tabindex', '-1');
        }
        heading.focus({ preventScroll: false });
      } else {
        mainRef.current.focus();
      }
    }
  }, [location.pathname]);

  
  const [_isSavingNote, setIsSavingNote] = useState(false);

  const handleAddHushNote = async (newNote: HushNote) => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const optimisticNote: HushNote = {
      ...newNote,
      id: tempId,
    };

    // 1. Optimistic insert
    setHushNotes(prev => [optimisticNote, ...prev]);
    showToast('Secret whisper note published!', 'success');
    
    if (accessToken) {
      setIsSavingNote(true);
      try {
        const payload: Record<string, unknown> = {
          text: newNote.text,
          musicTitle: newNote.music?.title,
          musicArtist: newNote.music?.artist
        };
        const noteWithCoords = newNote as HushNote & { lat?: number; lng?: number };
        if (noteWithCoords.lat != null) payload.lat = noteWithCoords.lat;
        if (noteWithCoords.lng != null) payload.lng = noteWithCoords.lng;

        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          throw new Error(`Server responded with ${res.status}`);
        }

        const saved = await res.json();
        const serverNote = mapServerToHushNote(saved);

        // Reconcile temporary optimistic ID with server ID
        setHushNotes(prev => prev.map(n => (n.id === tempId ? { ...optimisticNote, id: serverNote.id } : n)));
      } catch (e) {
        console.error('Failed to save note:', e);
        // Rollback: Remove the optimistic note if API fails
        setHushNotes(prev => prev.filter(note => note.id !== tempId));
        showToast('Failed to save note to server. Rolled back.', 'error');
      } finally {
        setIsSavingNote(false);
      }
    }
  };


  useEffect(() => {
    if (location.pathname !== '/launch') {
      return;
    }
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);
    return () => clearTimeout(timer);
  }, [location.pathname, navigate]);

  useEffect(() => {
    if (isDarkMode || isGlobalGhostMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode, isGlobalGhostMode]);

  const handleStartOnboarding = () => {
    navigate('/auth/login');
  };

  const handleFinishSplash = () => {
    const defaultUser = MOCK_USERS[0];
    if (defaultUser) {
      setUser(defaultUser);
      navigate('/home');
      showToast('Welcome back, ' + defaultUser.displayName + '!', 'success');
    }
  };

  const handleNextSplash = () => {
    if (splashIndex < 4) {
      setSplashIndex(prev => prev + 1);
    } else {
      handleFinishSplash();
    }
  };

  const handleLogin = () => {
    const defaultUser = MOCK_USERS[0];
    if (defaultUser) {
      setUser(defaultUser);
      navigate('/home');
      showToast('Authenticated as ' + defaultUser.displayName, 'success');
    }
  };

  const handleSignup = () => {
    navigate('/splash');
    showToast('Persona registration started', 'info');
  };

  const handleAccountSwitch = (newUser: User) => {
    setUser(newUser);
    navigate('/persona');
    showToast('Switched to ' + newUser.displayName, 'info');
  };

  const toggleGhostMode = () => {
    setIsGhostTransitioning(true);
    const nextGhostState = !isGlobalGhostMode;
    setIsGlobalGhostMode(nextGhostState);
    showToast(nextGhostState ? 'Ghost Mode Activated (Encrypted Proximity)' : 'Ghost Mode Deactivated', 'warning');
    setTimeout(() => {
      setIsGhostTransitioning(false);
    }, 600);
  };

  const toggleThemeMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const navbarPages = ['home', 'vista', 'hush', 'persona', 'explore', 'notifications', 'connections', 'edit-profile', 'settings', 'switch-account', 'story-creator'];
  const showNavbar = navbarPages.includes(currentPage);
  const isDarkPage = ['launch', 'initial', 'loading'].includes(currentPage) || location.pathname === '/launch' || location.pathname === '/initial' || location.pathname === '/loading';

  const getAppBgClass = () => {
    if (isDarkPage) return 'bg-[var(--app-primary)] text-[var(--text-on-dark)]';
    if (isGlobalGhostMode) return 'bg-[var(--app-bg-ghost)] text-[var(--text-on-dark)]';
    return 'bg-[var(--app-bg)] text-slate-900 dark:text-[var(--text-on-dark)]';
  };

  const outletContext: AppOutletContext = {
    hushNotes,
    isLoadingNotes,
    handleAddHushNote,
    handleStartOnboarding,
    handleFinishSplash,
    handleNextSplash,
    handleLogin,
    handleSignup,
    handleAccountSwitch,
    toggleGhostMode,
    toggleThemeMode,
  };

  return (
    <div className={`relative h-screen w-full flex flex-col md:flex-row overflow-hidden min-h-screen transition-colors duration-500 ${getAppBgClass()} ${isGlobalGhostMode ? 'ghost-mode' : ''} ${isGhostTransitioning ? 'animate-ghost-trans-blur' : ''}`}>

      {/* Skip to Main Content Link for Screen Readers & Keyboard Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[500] focus:px-4 focus:py-2 focus:bg-[var(--app-accent)] focus:text-slate-900 dark:text-[var(--text-on-dark)] focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
      >
        Skip to main content
      </a>

      {showNavbar && (
        <DesktopSidebar
          ref={sidebarRef}
          activePage={currentPage}
          onNavigate={(page) => navigate(pageToPath(page))}
          isGhostActive={isGlobalGhostMode}
          onToggleGhost={toggleGhostMode}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleThemeMode}
        />
      )}

      <div className="flex-1 flex flex-col h-full overflow-hidden w-full relative">
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          onScroll={handleMainScroll}
          className={`flex-1 flex flex-col overflow-y-auto overflow-x-hidden safe-area-inset outline-none ${getAppBgClass()} ${showNavbar ? 'pb-24 md:pb-6' : ''}`}
        >
          <ErrorBoundary>
            <Suspense fallback={<LoadingPage />}>
              <PageTransition pageKey={location.pathname}>
                <Outlet context={outletContext} />
              </PageTransition>
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>

      {showNavbar && (
        <Navbar
          activePage={currentPage}
          onNavigate={(page) => navigate(pageToPath(page))}
          isGhostActive={isGlobalGhostMode}
        />
      )}

      <InstallPrompt />
    </div>
  );
};

export default AppLayout;
