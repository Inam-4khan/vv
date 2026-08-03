
import React from 'react';
import { BrandLogo } from '../common/BrandLogo';

export const LaunchSplash: React.FC = () => {
  return (
    <div className="w-full h-full min-h-full flex-1 flex flex-col items-center justify-center bg-[#062B34] overflow-hidden">
      <div className="flex items-center gap-6">
        <div className="animate-logo-entrance">
          <BrandLogo size={100} color="#FFF9E6" className="drop-shadow-[0_0_15px_rgba(255,249,230,0.5)]" />
        </div>
        <h1 className="text-7xl font-black tracking-[-0.08em] text-[#FFF9E6] font-montserrat select-none animate-text-entrance opacity-0">
          VIZU
        </h1>
      </div>

      <style>{`
        @keyframes logoEntrance {
          0% {
            transform: scale(0) rotate(-180deg);
            filter: brightness(3) blur(10px);
          }
          50% {
            transform: scale(1.4) rotate(10deg);
            filter: brightness(1.5) blur(0px);
          }
          100% {
            transform: scale(1) rotate(0deg);
            filter: brightness(1);
          }
        }

        @keyframes textEntrance {
          0% {
            opacity: 0;
            transform: translateY(40px) scale(0.8);
            letter-spacing: 0.5em;
            filter: blur(20px);
          }
          60% {
            opacity: 0.5;
            transform: translateY(-10px) scale(1.05);
            letter-spacing: -0.05em;
            filter: blur(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            letter-spacing: -0.08em;
            filter: blur(0);
          }
        }

        .animate-logo-entrance {
          animation: logoEntrance 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .animate-text-entrance {
          animation: textEntrance 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};
