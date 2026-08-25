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
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center text-white">
      <div className={`relative p-6 rounded-3xl mb-6 ${
        isGhost ? 'bg-[#03171C] border border-[#2EC4B6]/20' : 'bg-[#0A2832] border border-white/10'
      }`}>
        <div className="relative flex items-center justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isGhost ? 'bg-[#2EC4B6]/20 text-[#80FFEC]' : 'bg-[#2EC4B6]/10 text-[#2EC4B6]'
          }`}>
            {isGhost ? <Ghost size={40} className="animate-pulse" /> : <Compass size={40} className="animate-spin-slow" />}
          </div>
          <div className="absolute -top-1 -right-1 p-2 rounded-full bg-[#2EC4B6] text-[#062B34] shadow-lg">
            <Sparkles size={16} />
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-black tracking-tight mb-2">404</h1>
      <h2 className="text-xl font-extrabold mb-3">Lost in the Vizu Flow?</h2>

      <p className="max-w-md text-sm opacity-70 mb-8 leading-relaxed font-medium text-white/70">
        {error?.message || error?.statusText || "The destination or secret whisper page you're searching for doesn't exist, has been moved, or dissolved in ghost mode."}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/home')}
          className="w-full py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md bg-[#2EC4B6] hover:bg-[#2EC4B6]/90 text-[#062B34]"
        >
          <Home size={18} />
          Return to Flow
        </button>

        <button
          onClick={() => navigate(-1)}
          className={`w-full py-3.5 px-5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
            isGhost
              ? 'bg-[#2EC4B6]/20 hover:bg-[#2EC4B6]/30 text-[#80FFEC] border border-[#2EC4B6]/30'
              : 'bg-white/10 hover:bg-white/15 text-white'
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
