
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = React.memo(({ onGetStarted }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      onGetStarted();
    }, 300);
  };

  return (
    <div className="min-h-full w-full flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#FFF9E6] text-[#062B34] select-none">
      <div className="flex flex-col items-center justify-center max-w-sm w-full mx-auto space-y-8">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center">
          <BrandLogo size={52} color="#062B34" className="mb-5" />
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#062B34] font-montserrat">
            VIZU
          </h1>
          <p className="text-[10px] sm:text-[11px] font-bold text-[#062B34] uppercase tracking-[0.38em] mt-2">
            PROXIMITY SOCIAL
          </p>
          <p className="text-sm font-light italic text-[#062B34]/80 mt-2 font-serif">
            Discover who's nearby. Experience the flow.
          </p>
        </div>

        {/* CTA Button & Footer Disclaimer */}
        <div className="w-full max-w-xs space-y-4 pt-2">
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="w-full bg-[#2EC4B6] text-white py-3.5 px-6 rounded-2xl font-extrabold text-base shadow-lg shadow-[#2EC4B6]/30 hover:bg-[#20878E] active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-90 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Get Started</span>
              </>
            ) : (
              'Get Started'
            )}
          </button>

          <div className="text-[9px] font-extrabold text-[#062B34]/70 uppercase tracking-[0.2em] pt-1">
            PRIVACY PROTECTED • NO FACE REC
          </div>
        </div>

      </div>
    </div>
  );
});

