import React from 'react';
import { createBrowserRouter, useNavigate, useOutletContext, useParams, Navigate } from 'react-router-dom';
import AppLayout, { AppOutletContext } from '../../App';
import { ProtectedRoute } from './ProtectedRoute';
import { Page } from '../../types';
import { MOCK_USERS, MOCK_STORIES } from '../../constants';
import { useAppState } from '../context/AppStateContext';
import { useToast } from '../context/ToastContext';
import { LoadingPage } from '../../components/pages/LoadingPage';

import { LaunchSplash } from '../../components/pages/LaunchSplash';
import { InitialSplash } from '../../components/pages/InitialSplash';
import { WelcomePage } from '../../components/pages/WelcomePage';
import { LoginPage } from '../../components/pages/LoginPage';
import { SignupPage } from '../../components/pages/SignupPage';
import { SplashScreen } from '../../components/pages/SplashScreen';
import { FlowPage } from '../../components/pages/FlowPage';
import { HushPage } from '../../components/pages/HushPage';
import { PersonaPage } from '../../components/pages/PersonaPage';
import { SettingsPage } from '../../components/pages/SettingsPage';
import { SwitchAccountPage } from '../../components/pages/SwitchAccountPage';
import { ExplorePage } from '../../components/pages/ExplorePage';
import { NotificationsPage } from '../../components/pages/NotificationsPage';
import { ConnectionsPage } from '../../components/pages/ConnectionsPage';
import { EditProfilePage } from '../../components/pages/EditProfilePage';
import { HushCameraPage } from '../../components/pages/HushCameraPage';
import { StoryCreatorPage } from '../../components/pages/StoryCreatorPage';
import { StoryViewerPage } from '../../components/pages/StoryViewerPage';
import { VistaPage } from '../../components/pages/VistaPage';
import { NotFoundPage } from '../../components/pages/NotFoundPage';

export const pageToPath = (page: string): string => {
  switch (page) {
    case 'welcome': return '/';
    case 'home': return '/home';
    case 'vista': return '/vista';
    case 'hush': return '/hush';
    case 'persona': return '/persona';
    case 'explore': return '/explore';
    case 'notifications': return '/notifications';
    case 'hush-camera': return '/hush/camera';
    case 'story-creator': return '/story/create';
    case 'story-viewer': return '/story';
    case 'connections': return '/persona/connections';
    case 'edit-profile': return '/persona/edit';
    case 'settings': return '/persona/settings';
    case 'switch-account': return '/persona/switch-account';
    case 'login': return '/auth/login';
    case 'signup': return '/auth/signup';
    case 'splash': return '/splash';
    case 'loading': return '/loading';
    case 'launch': return '/launch';
    case 'initial': return '/initial';
    default: return '/home';
  }
};

export const pathToPage = (path: string): Page => {
  if (path === '/' || path === '/welcome') return 'welcome';
  if (path.startsWith('/home') || path.startsWith('/flow') || path.startsWith('/dashboard')) return 'home';
  if (path.startsWith('/vista')) return 'vista';
  if (path.startsWith('/hush/camera') || path.startsWith('/hush-camera')) return 'hush-camera';
  if (path.startsWith('/hush')) return 'hush';
  if (path.startsWith('/persona/connections') || path.startsWith('/connections')) return 'connections';
  if (path.startsWith('/persona/edit') || path.startsWith('/edit-profile') || path.startsWith('/profile/edit')) return 'edit-profile';
  if (path.startsWith('/persona/settings') || path.startsWith('/settings')) return 'settings';
  if (path.startsWith('/persona/switch-account') || path.startsWith('/switch-account')) return 'switch-account';
  if (path.startsWith('/persona') || path.startsWith('/profile')) return 'persona';
  if (path.startsWith('/explore')) return 'explore';
  if (path.startsWith('/notifications')) return 'notifications';
  if (path.startsWith('/story/create') || path.startsWith('/story-creator') || path.startsWith('/create')) return 'story-creator';
  if (path.startsWith('/story')) return 'story-viewer';
  if (path.startsWith('/auth/login') || path.startsWith('/login')) return 'login';
  if (path.startsWith('/auth/signup') || path.startsWith('/signup')) return 'signup';
  if (path.startsWith('/splash')) return 'splash';
  if (path.startsWith('/loading')) return 'loading';
  if (path.startsWith('/launch')) return 'launch';
  if (path.startsWith('/initial')) return 'initial';
  return 'home';
};

const useAppOutletContext = (): AppOutletContext => {
  const ctx = useOutletContext<AppOutletContext>();
  if (!ctx) {
    return {
      hushNotes: [],
      isLoadingNotes: false,
      handleAddHushNote: () => {},
      handleStartOnboarding: () => {},
      handleFinishSplash: () => {},
      handleNextSplash: () => {},
      handleLogin: () => {},
      handleSignup: () => {},
      handleAccountSwitch: () => {},
      toggleGhostMode: () => {},
      toggleThemeMode: () => {},
    };
  }
  return ctx;
};

const WelcomeRoute: React.FC = () => {
  const { handleStartOnboarding } = useAppOutletContext();
  return <WelcomePage onGetStarted={handleStartOnboarding} />;
};

const RootRedirect: React.FC = () => {
  const { user } = useAppState();
  const { handleStartOnboarding } = useAppOutletContext();

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return <WelcomePage onGetStarted={handleStartOnboarding} />;
};

const LoginRoute: React.FC = () => {
  const navigate = useNavigate();
  const { handleLogin } = useAppOutletContext();
  return (
    <LoginPage
      onLogin={handleLogin}
      onBack={() => navigate('/')}
      onSignUp={() => navigate('/auth/signup')}
    />
  );
};

const SignupRoute: React.FC = () => {
  const navigate = useNavigate();
  const { handleSignup } = useAppOutletContext();
  return (
    <SignupPage
      onSignup={handleSignup}
      onBack={() => navigate('/auth/login')}
    />
  );
};

const SplashRoute: React.FC = () => {
  const { splashIndex } = useAppState();
  const { handleNextSplash } = useAppOutletContext();
  return <SplashScreen index={splashIndex} onNext={handleNextSplash} />;
};

const FlowRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode, setSelectedStoryId } = useAppState();
  return (
    <FlowPage
      onExplore={() => navigate('/explore')}
      onNotifications={() => navigate('/notifications')}
      onAddStory={() => navigate('/story/create')}
      onViewStory={(id) => {
        setSelectedStoryId(id);
        navigate(`/story/${id}`);
      }}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const VistaRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  return (
    <VistaPage
      isGhostMode={isGlobalGhostMode}
      onCreateContent={() => navigate('/story/create')}
    />
  );
};

const HushRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  const { hushNotes, isLoadingNotes, handleAddHushNote } = useAppOutletContext();
  return (
    <HushPage
      isGhostMode={isGlobalGhostMode}
      onCameraOpen={() => navigate('/hush/camera')}
      notes={hushNotes}
      isLoadingNotes={isLoadingNotes}
      onAddNote={handleAddHushNote}
    />
  );
};

const HushCameraRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  return (
    <HushCameraPage
      onBack={() => navigate('/hush')}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const PersonaRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user, isGlobalGhostMode, isDarkMode } = useAppState();
  const { hushNotes, toggleGhostMode, toggleThemeMode } = useAppOutletContext();
  const activeUser = user || MOCK_USERS[0];
  return (
    <PersonaPage
      user={activeUser}
      isGhostMode={isGlobalGhostMode}
      onToggleGhost={toggleGhostMode}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleThemeMode}
      onSettings={() => navigate('/persona/settings')}
      onConnections={() => navigate('/persona/connections')}
      onEditProfile={() => navigate('/persona/edit')}
      userNotes={hushNotes}
    />
  );
};

const ConnectionsRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  const { handleAccountSwitch } = useAppOutletContext();
  return (
    <ConnectionsPage
      onBack={() => navigate('/persona')}
      onViewProfile={(u) => handleAccountSwitch(u)}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const EditProfileRoute: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user, setUser, isGlobalGhostMode } = useAppState();
  const activeUser = user || MOCK_USERS[0];
  
  return (
    <EditProfilePage
      user={activeUser}
      onBack={() => navigate('/persona')}
      onSave={(updatedUser) => {
        setUser(updatedUser);
        showToast('Persona profile updated successfully!', 'success');
      }}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const SettingsRoute: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setUser, setSplashIndex, isGlobalGhostMode, isDarkMode } = useAppState();
  const { toggleThemeMode, toggleGhostMode } = useAppOutletContext();
  return (
    <SettingsPage
      onBack={() => navigate('/persona')}
      isGhostMode={isGlobalGhostMode}
      isDarkMode={isDarkMode}
      onToggleTheme={toggleThemeMode}
      onToggleGhost={toggleGhostMode}
      onLogout={() => {
        setUser(null);
        navigate('/');
        setSplashIndex(0);
        showToast('Logged out of persona session', 'info');
      }}
    />
  );
};

const SwitchAccountRoute: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAppState();
  const { handleAccountSwitch } = useAppOutletContext();
  return (
    <SwitchAccountPage
      currentUser={user || MOCK_USERS[0]}
      onSelect={handleAccountSwitch}
      onBack={() => navigate('/persona')}
    />
  );
};

const ExploreRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  return (
    <ExplorePage
      onBack={() => navigate('/home')}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const NotificationsRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  return (
    <NotificationsPage
      onBack={() => navigate('/home')}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const StoryCreatorRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  return (
    <StoryCreatorPage
      onBack={() => navigate('/home')}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const StoryViewerRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isGlobalGhostMode, selectedStoryId, setSelectedStoryId } = useAppState();
  const activeStoryId = id || selectedStoryId || MOCK_STORIES[0]?.id;

  if (!activeStoryId) return <Navigate to="/home" replace />;

  return (
    <StoryViewerPage
      storyId={activeStoryId}
      onClose={() => {
        setSelectedStoryId(null);
        navigate('/home');
      }}
      isGhostMode={isGlobalGhostMode}
    />
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <RootRedirect /> },
      { path: 'welcome', element: <WelcomeRoute /> },
      { path: 'auth/login', element: <LoginRoute /> },
      { path: 'auth/signup', element: <SignupRoute /> },
      { path: 'login', element: <Navigate to="/auth/login" replace /> },
      { path: 'signup', element: <Navigate to="/auth/signup" replace /> },
      { path: 'splash', element: <SplashRoute /> },
      { path: 'loading', element: <LoadingPage /> },
      { path: 'launch', element: <LaunchSplash /> },
      { path: 'initial', element: <InitialSplash /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'home', element: <FlowRoute /> },
          { path: 'flow', element: <Navigate to="/home" replace /> },
          { path: 'dashboard', element: <Navigate to="/home" replace /> },
          { path: 'vista', element: <VistaRoute /> },
          { path: 'hush', element: <HushRoute /> },
          { path: 'hush/camera', element: <HushCameraRoute /> },
          { path: 'hush-camera', element: <Navigate to="/hush/camera" replace /> },
          { path: 'persona', element: <PersonaRoute /> },
          { path: 'profile', element: <Navigate to="/persona" replace /> },
          { path: 'persona/connections', element: <ConnectionsRoute /> },
          { path: 'connections', element: <Navigate to="/persona/connections" replace /> },
          { path: 'persona/edit', element: <EditProfileRoute /> },
          { path: 'edit-profile', element: <Navigate to="/persona/edit" replace /> },
          { path: 'profile/edit', element: <Navigate to="/persona/edit" replace /> },
          { path: 'persona/settings', element: <SettingsRoute /> },
          { path: 'settings', element: <Navigate to="/persona/settings" replace /> },
          { path: 'persona/switch-account', element: <SwitchAccountRoute /> },
          { path: 'switch-account', element: <Navigate to="/persona/switch-account" replace /> },
          { path: 'explore', element: <ExploreRoute /> },
          { path: 'notifications', element: <NotificationsRoute /> },
          { path: 'story/create', element: <StoryCreatorRoute /> },
          { path: 'story-creator', element: <Navigate to="/story/create" replace /> },
          { path: 'create', element: <Navigate to="/story/create" replace /> },
          { path: 'story', element: <StoryViewerRoute /> },
          { path: 'story/:id', element: <StoryViewerRoute /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
