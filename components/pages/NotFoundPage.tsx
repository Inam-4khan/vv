import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Compass, Home, RefreshCw, Sparkles, Ghost } from 'lucide-react';
import { useAppState } from '../../src/context/AppStateContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError() as { statusText?: string; message?: string } | null;
  const { isGlobalGhostMode } = useAppState();

  const isGhost = isGlobalGhostMode;

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center text-primary dark:text-white">
      <div className={`relative p-6 rounded-3xl mb-6 ${
        isGhost ? 'bg-[var(--app-bg-ghost)] border border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)]' : 'bg-[var(--app-bg-surface)] border border-white/10'
      }`}>
        <div className="relative flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isGhost ? 'bg-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] text-[var(--app-accent-light)]' : 'bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)] text-[var(--app-accent)]'
          }`}>
            {isGhost ? <Ghost size={40} className="animate-pulse" /> : <Compass size={40} className="animate-spin-slow" />}
          </div>
          <div className="absolute -top-1 -right-1 p-2 rounded-full bg-[var(--app-accent)] text-primary dark:text-white shadow-lg">
            <Sparkles size={16} />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-extrabold mb-3">Lost in the Vizu Flow?</h2>

      <p className="max-w-md text-sm opacity-70 mb-8 leading-relaxed font-medium text-primary/40 dark:text-white/40">
        {error?.message || error?.statusText || "The destination or secret whisper page you're searching for doesn't exist, has been moved, or dissolved in ghost mode."}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/home')}
          className="w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md bg-[var(--app-accent)] hover:bg-[color-mix(in_srgb,var(--app-accent)_90%,transparent)] text-white"
        >
          <Home size={18} />
          Return to Flow
        </button>

        <button
          onClick={() => navigate(-1)}
          className={`w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            isGhost
              ? 'bg-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] hover:bg-[color-mix(in_srgb,var(--app-accent)_30%,transparent)] text-[var(--app-accent-light)] border border-[color-mix(in_srgb,var(--app-accent)_30%,transparent)]'
              : 'bg-white/10 hover:bg-white/15 text-primary dark:text-white'
          }`}
        >
          <RefreshCw size={16} />
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
