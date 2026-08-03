
import React from 'react';
import { SPLASH_SCREENS } from '../../constants';
import { ChevronRight } from 'lucide-react';

interface SplashScreenProps {
  index: number;
  onNext: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ index, onNext }) => {
  const data = SPLASH_SCREENS[index] ?? SPLASH_SCREENS[0] ?? {
    title: 'Vizu',
    subtitle: 'Vibe. Vision. Vista.',
    text: 'Experience social flow with privacy at its core.',
    color: '#0B1720',
  };

  return (
    <div 
      className="flex-1 flex flex-col items-center justify-between p-10 transition-colors duration-700 h-full w-full"
      style={{ backgroundColor: data.color }}
    >
      <div className="mt-16 text-center animate-fade-in" key={index}>
        <h1 className="text-4xl font-bold text-white font-montserrat mb-1">{data.title}</h1>
        <p className="text-white/40 font-mono text-[10px] mb-8 tracking-widest uppercase">{data.subtitle}</p>
        <p className="text-white/80 text-lg font-light leading-relaxed max-w-[260px] mx-auto">
          "{data.text}"
        </p>
      </div>

      <div className="w-full flex flex-col items-center gap-10 mb-8">
        <div className="flex gap-2">
          {SPLASH_SCREENS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? 'w-8 bg-white' : 'w-2 bg-white/20'
              }`} 
            />
          ))}
        </div>
        
        <button
          onClick={onNext}
          className="bg-[#2EC4B6] text-white p-5 rounded-full transition-all active:scale-90 shadow-xl hover:brightness-110"
        >
          <ChevronRight size={28} />
        </button>

        <p className="text-white/20 text-[9px] uppercase tracking-widest font-bold">
          {index === 4 ? "Final Step" : `Step ${index + 1} of 5`}
        </p>
      </div>
    </div>
  );
};
