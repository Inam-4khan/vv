import React, { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';

export interface OptimizedImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  blurColor?: string;
  fallbackSrc?: string;
}

export const OptimizedImg: React.FC<OptimizedImgProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  loading = 'lazy',
  blurColor = 'bg-slate-200/60 dark:bg-slate-800/60',
  fallbackSrc,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setIsError(false);
  }, [src]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      return;
    }
    setIsError(true);
    if (onError) onError(e);
  };

  const initialLetter = alt?.trim() ? alt.trim().replace(/^@/, '').charAt(0).toUpperCase() : '';

  return (
    <div
      className={`relative overflow-hidden flex items-center justify-center ${className}`}
      style={{ ...style }}
    >
      {/* LQIP / Loading Skeleton Placeholder */}
      {!isLoaded && !isError && (
        <div
          className={`absolute inset-0 ${blurColor} backdrop-blur-md animate-pulse transition-opacity duration-300 z-10`}
        />
      )}

      {/* Fallback Graphic UI if image fails entirely */}
      {isError ? (
        <div className="w-full h-full min-h-[40px] flex flex-col items-center justify-center bg-gradient-to-br from-[#062B34] via-[#0C3B46] to-[#20878E] text-[#F1FAEE] p-2 text-center select-none">
          {initialLetter ? (
            <span className="text-sm md:text-base font-black tracking-widest font-montserrat text-[#80FFEC]">
              {initialLetter}
            </span>
          ) : (
            <ImageIcon size={18} className="text-[#80FFEC] opacity-80" />
          )}
        </div>
      ) : (
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          referrerPolicy="no-referrer"
          onLoad={(e) => {
            setIsLoaded(true);
            if (onLoad) onLoad(e);
          }}
          onError={handleImageError}
          className={`w-full h-full object-cover transition-all duration-300 ${
            isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
          }`}
          {...props}
        />
      )}
    </div>
  );
};

export default OptimizedImg;
