import React, { lazy } from 'react';
import { createBrowserRouter, useNavigate, useOutletContext, useParams, Navigate } from 'react-router-dom';
import AppLayout, { AppOutletContext } from '../../App';
import { ProtectedRoute } from './ProtectedRoute';
import { Page } from '../../types';
import { useAppState } from '../context/AppStateContext';
import { useToast } from '../context/ToastContext';
import { LoadingPage } from '../../components/pages/LoadingPage';

const LaunchSplash = lazy(() => import('../../components/pages/LaunchSplash').then(m => ({ default: m.LaunchSplash })));
const InitialSplash = lazy(() => import('../../components/pages/InitialSplash').then(m => ({ default: m.InitialSplash })));
const WelcomePage = lazy(() => import('../../components/pages/WelcomePage').then(m => ({ default: m.WelcomePage })));
const LoginPage = lazy(() => import('../../components/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('../../components/pages/SignupPage').then(m => ({ default: m.SignupPage })));
const SplashScreen = lazy(() => import('../../components/pages/SplashScreen').then(m => ({ default: m.SplashScreen })));
const FlowPage = lazy(() => import('../../components/pages/FlowPage').then(m => ({ default: m.FlowPage })));
const HushPage = lazy(() => import('../../components/pages/HushPage').then(m => ({ default: m.HushPage })));
const PersonaPage = lazy(() => import('../../components/pages/PersonaPage').then(m => ({ default: m.PersonaPage })));
const SettingsPage = lazy(() => import('../../components/pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const SwitchAccountPage = lazy(() => import('../../components/pages/SwitchAccountPage').then(m => ({ default: m.SwitchAccountPage })));
const ExplorePage = lazy(() => import('../../components/pages/ExplorePage').then(m => ({ default: m.ExplorePage })));
const NotificationsPage = lazy(() => import('../../components/pages/NotificationsPage').then(m => ({ default: m.NotificationsPage })));
const ConnectionsPage = lazy(() => import('../../components/pages/ConnectionsPage').then(m => ({ default: m.ConnectionsPage })));
const EditProfilePage = lazy(() => import('../../components/pages/EditProfilePage').then(m => ({ default: m.EditProfilePage })));
const HushCameraPage = lazy(() => import('../../components/pages/HushCameraPage').then(m => ({ default: m.HushCameraPage })));
const StoryCreatorPage = lazy(() => import('../../components/pages/StoryCreatorPage').then(m => ({ default: m.StoryCreatorPage })));
const StoryViewerPage = lazy(() => import('../../components/pages/StoryViewerPage').then(m => ({ default: m.StoryViewerPage })));
const VistaPage = lazy(() => import('../../components/pages/VistaPage').then(m => ({ default: m.VistaPage })));
const NotFoundPage = lazy(() => import('../../components/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

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
    default: return '/home';
  }
};

export const pathToPage = (path: string): Page => {
  if (path === '/') return 'welcome';
  if (path.startsWith('/home')) return 'home';
  if (path.startsWith('/vista')) return 'vista';
  if (path.startsWith('/hush/camera')) return 'hush-camera';
  if (path.startsWith('/hush')) return 'hush';
  if (path.startsWith('/persona/connections')) return 'connections';
  if (path.startsWith('/persona/edit')) return 'edit-profile';
  if (path.startsWith('/persona/settings')) return 'settings';
  if (path.startsWith('/persona/switch-account')) return 'switch-account';
  if (path.startsWith('/persona')) return 'persona';
  if (path.startsWith('/explore')) return 'explore';
  if (path.startsWith('/notifications')) return 'notifications';
  if (path.startsWith('/story/create')) return 'story-creator';
  if (path.startsWith('/story')) return 'story-viewer';
  if (path.startsWith('/auth/login')) return 'login';
  if (path.startsWith('/auth/signup')) return 'signup';
  if (path.startsWith('/splash')) return 'splash';
  if (path.startsWith('/loading')) return 'loading';
  return 'home';
};

const useAppOutletContext = (): AppOutletContext => {
  const ctx = useOutletContext<AppOutletContext>();
  if (!ctx) {
    return {
      hushNotes: [],
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
  const { isGlobalGhostMode } = useAppState();
  return (
    <VistaPage
      isGhostMode={isGlobalGhostMode}
    />
  );
};

const HushRoute: React.FC = () => {
  const navigate = useNavigate();
  const { isGlobalGhostMode } = useAppState();
  const { hushNotes, handleAddHushNote } = useAppOutletContext();
  return (
    <HushPage
      isGhostMode={isGlobalGhostMode}
      onCameraOpen={() => navigate('/hush/camera')}
      notes={hushNotes}
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
  return (
    <PersonaPage
      user={user}
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
  if (!user) return null;
  return (
    <EditProfilePage
      user={user}
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
      currentUser={user}
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
  const activeStoryId = id || selectedStoryId;

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
      { path: 'auth/login', element: <LoginRoute /> },
      { path: 'auth/signup', element: <SignupRoute /> },
      { path: 'splash', element: <SplashRoute /> },
      { path: 'loading', element: <LoadingPage /> },
      { path: 'launch', element: <LaunchSplash /> },
      { path: 'initial', element: <InitialSplash /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'home', element: <FlowRoute /> },
          { path: 'vista', element: <VistaRoute /> },
          { path: 'hush', element: <HushRoute /> },
          { path: 'hush/camera', element: <HushCameraRoute /> },
          { path: 'persona', element: <PersonaRoute /> },
          { path: 'persona/connections', element: <ConnectionsRoute /> },
          { path: 'persona/edit', element: <EditProfileRoute /> },
          { path: 'persona/settings', element: <SettingsRoute /> },
          { path: 'persona/switch-account', element: <SwitchAccountRoute /> },
          { path: 'explore', element: <ExploreRoute /> },
          { path: 'notifications', element: <NotificationsRoute /> },
          { path: 'story/create', element: <StoryCreatorRoute /> },
          { path: 'story/:id', element: <StoryViewerRoute /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
