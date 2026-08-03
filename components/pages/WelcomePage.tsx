
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
    <div className="flex-1 flex flex-col items-center justify-between py-20 px-8 text-center bg-[var(--app-bg,#FFF9E6)] text-[var(--text-primary,#0B1720)] animate-fade-in h-full">
      <div className="flex flex-col items-center mt-10">
        <BrandLogo size={60} color="#062B34" className="mb-4" />
        <h1 className="text-4xl font-bold tracking-tighter text-primary font-montserrat">
          VIZU
        </h1>
        <p className="text-primary/60 text-[10px] uppercase tracking-[0.4em] font-medium mt-1">
          Proximity Social
        </p>
      </div>

      <div className="w-full max-w-xs space-y-8">
        <p className="text-primary/70 font-light text-sm italic font-lexend">
          Discover who's nearby. Experience the flow.
        </p>

        <button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full bg-[#2EC4B6] text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:brightness-105 active:scale-95 transition-all transform flex items-center justify-center gap-2.5 disabled:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Getting Started...</span>
            </>
          ) : (
            'Get Started'
          )}
        </button>
      </div>
      
      <div className="text-[8px] font-bold text-primary/30 uppercase tracking-[0.2em]">
        Privacy Protected • No Face Rec
      </div>
    </div>
  );
});
