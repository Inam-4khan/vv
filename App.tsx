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
import { parseLocalStorage, setLocalStorage, isHushNoteArray } from './src/utils/storage';
import { pathToPage, pageToPath } from './src/router/routes';

export interface AppOutletContext {
  hushNotes: HushNote[];
  isLoadingNotes: boolean;
  handleAddHushNote: (newNote: HushNote) => void;
  handleStartOnboarding: () => void;
  handleFinishSplash: () => void;
  handleNextSplash: () => void;
  handleLogin: () => void;
  handleSignup: () => void;
  handleAccountSwitch: (newUser: User) => void;
  toggleGhostMode: () => void;
  toggleThemeMode: () => void;
}

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
  
  const [hushNotes, setHushNotes] = useState<HushNote[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(false);
  const { accessToken } = useAuth();
  
  useEffect(() => {
    const fetchNotes = async () => {
      if (!accessToken) return;
      setIsLoadingNotes(true);
      try {
        const res = await fetch('/api/notes', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        const formattedNotes = data.map((n: any) => ({
          id: String(n.id),
          userId: String(n.userUid),
          username: n.userName,
          avatar: n.userAvatar,
          text: n.text,
          music: n.musicTitle ? { title: n.musicTitle, artist: n.musicArtist } : undefined,
          timestamp: new Date(n.createdAt).toLocaleTimeString()
        }));
        setHushNotes(formattedNotes);
      } catch (err) {
        console.error(err);
        showToast('Could not load notes. Try again.', 'error');
        setHushNotes([]);
      } finally {
        setIsLoadingNotes(false);
      }
    };
    fetchNotes();
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

  
  const [isSavingNote, setIsSavingNote] = useState(false);

  const handleAddHushNote = async (newNote: HushNote) => {
    // Add optimistically
    setHushNotes(prev => [newNote, ...prev]);
    showToast('Secret whisper note published!', 'success');
    
    if (accessToken) {
      setIsSavingNote(true);
      try {
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({
            text: newNote.text,
            lat: 0,
            lng: 0,
            musicTitle: newNote.music?.title,
            musicArtist: newNote.music?.artist
          })
        });
        if (!res.ok) throw new Error('Failed to fetch');
      } catch (err) {
        console.error(err);
        showToast('Could not save note. Try again.', 'error');
        // If we want to rollback optimistic update:
        // setHushNotes(prev => prev.filter(n => n.id !== newNote.id));
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

  const navbarPages = ['home', 'vista', 'hush', 'persona', 'explore', 'notifications', 'connections', 'edit-profile', 'settings', 'story-creator'];
  const showNavbar = navbarPages.includes(currentPage);
  const isDarkPage = ['launch', 'initial', 'loading'].includes(currentPage) || location.pathname === '/launch' || location.pathname === '/initial' || location.pathname === '/loading';

  const getAppBgClass = () => {
    if (isDarkPage) return 'bg-[var(--app-primary)] text-[#F1FAEE]';
    if (isGlobalGhostMode) return 'bg-[var(--app-bg-ghost)] text-[#F1FAEE]';
    return 'bg-[var(--app-bg)] text-primary dark:text-white';
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
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[500] focus:px-4 focus:py-2 focus:bg-[var(--app-accent)] focus:text-primary dark:text-white focus:font-black focus:rounded-xl focus:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white"
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
