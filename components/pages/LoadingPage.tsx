import React from 'react';
import { Loader2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

export const LoadingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#062B34] text-white flex flex-col items-center justify-center p-6 select-none font-lexend">
      {/* Centered Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#2EC4B6]/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-4">
        <div className="p-4 rounded-3xl bg-white/10 border border-white/15 backdrop-blur-md shadow-[0_0_30px_rgba(46,196,182,0.2)]">
          <BrandLogo size={40} color="#FFF9E6" />
        </div>

        <p className="text-xl font-bold tracking-tight font-montserrat text-[#FFF9E6]">VIZU</p>

        <div className="flex items-center gap-2 mt-2 text-[#2EC4B6] font-medium text-xs">
          <Loader2 size={18} className="animate-spin" />
          <span>Connecting...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
