import React from 'react';
import { useNavigate, useRouteError } from 'react-router-dom';
import { Compass, Home, RefreshCw, Sparkles, Ghost } from 'lucide-react';
import { useAppState } from '../../src/context/AppStateContext';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const error = useRouteError() as { statusText?: string; message?: string } | null;
  const { isGlobalGhostMode, isDarkMode } = useAppState();

  const isGhost = isGlobalGhostMode;

  return (
    <div className={`min-h-[80vh] flex flex-col items-center justify-center p-6 text-center ${
      isGhost ? 'text-purple-200' : isDarkMode ? 'text-gray-100' : 'text-[#0B1720]'
    }`}>
      <div className={`relative p-6 rounded-3xl mb-6 ${
        isGhost ? 'bg-purple-900/30 border border-purple-500/20' : isDarkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white shadow-xl border border-black/5'
      }`}>
        <div className="relative flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isGhost ? 'bg-purple-600/20 text-purple-400' : 'bg-sky-500/10 text-sky-600 dark:text-sky-400'
          }`}>
            {isGhost ? <Ghost size={40} className="animate-pulse" /> : <Compass size={40} className="animate-spin-slow" />}
          </div>
          <div className="absolute -top-1 -right-1 p-2 rounded-full bg-amber-500 text-white shadow-lg">
            <Sparkles size={16} />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-extrabold mb-3">Lost in the Vizu Flow?</h2>

      <p className="max-w-md text-sm opacity-70 mb-8 leading-relaxed font-medium">
        {error?.message || error?.statusText || "The destination or secret whisper page you're searching for doesn't exist, has been moved, or dissolved in ghost mode."}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/home')}
          className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
            isGhost
              ? 'bg-purple-600 hover:bg-purple-500 text-white'
              : 'bg-[#0B1720] hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-gray-100'
          }`}
        >
          <Home size={18} />
          Return to Flow
        </button>

        <button
          onClick={() => navigate(-1)}
          className={`w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            isGhost
              ? 'bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/30'
              : 'bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/15'
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
