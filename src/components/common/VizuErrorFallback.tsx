import React from 'react';
import { Ghost, RefreshCw, Home } from 'lucide-react';

export interface VizuErrorFallbackProps {
  error?: Error;
  reset?: () => void;
}

export const VizuErrorFallback: React.FC<VizuErrorFallbackProps> = ({ error, reset }) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen w-full bg-[#062B34] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#2EC4B6]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md w-full bg-[#03171C]/90 border border-[#2EC4B6]/30 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center text-center animate-fade-in">
        {/* Ghost Icon Badge */}
        <div className="w-20 h-20 rounded-3xl bg-[#2EC4B6]/20 border border-[#2EC4B6]/40 flex items-center justify-center mb-6 shadow-lg shadow-[#2EC4B6]/10">
          <Ghost size={40} className="text-[#80FFEC] animate-bounce" />
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#80FFEC] mb-2">
          Vizu System Alert
        </p>

        <h1 className="text-2xl font-bold mb-3 text-white">
          Something went wrong
        </h1>

        <p className="text-xs text-white/70 leading-relaxed mb-6 max-w-xs">
          {error?.message ? error.message : 'A temporary anomaly occurred while rendering this view. You can try again or return home.'}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
          {reset && (
            <button
              onClick={reset}
              className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-[#2EC4B6] hover:bg-[#80FFEC] text-[#062B34] font-black text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 cursor-pointer"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}

          <button
            onClick={handleGoHome}
            className="w-full flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all active:scale-95 cursor-pointer"
          >
            <Home size={16} />
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default VizuErrorFallback;
