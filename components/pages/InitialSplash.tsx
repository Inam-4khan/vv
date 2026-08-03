
import React from 'react';
import { BrandLogo } from '../common/BrandLogo';

export const InitialSplash: React.FC = () => {
  return (
    <div className="w-full h-full min-h-full flex-1 flex flex-col items-center justify-center bg-[#062B34] px-12">
      <div className="flex items-center gap-6 animate-fade-in">
        <BrandLogo size={70} color="#FFF9E6" />
        <h1 className="text-6xl font-normal tracking-tighter text-white font-montserrat select-none">
          VIZU
        </h1>
      </div>
    </div>
  );
};
