import React from 'react';
import { Loader2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--app-primary)] text-white flex flex-col items-center justify-center p-6 select-none font-lexend">
      {/* Centered Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[color-mix(in_srgb,var(--app-accent)_15%,transparent)] rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-4 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_0_30px_rgba(46,196,182,0.2)]">
          <BrandLogo size={40} color="var(--app-bg)" />
        </div>

        <p className="text-xl font-bold tracking-tight font-montserrat text-[var(--app-bg)]">VIZU</p>

        <div className="flex items-center gap-2 mt-2 text-[var(--app-accent)] font-medium text-xs">
          <Loader2 size={18} className="animate-spin" />
          <span>Connecting...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
