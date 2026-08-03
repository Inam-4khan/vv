import React, { useState } from 'react';

export interface OptimizedImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  blurColor?: string;
}

export const OptimizedImg: React.FC<OptimizedImgProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  style,
  loading = 'lazy',
  blurColor = 'bg-gray-300/40 dark:bg-gray-700/40',
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ ...style }}
    >
      {/* LQIP Placeholder with CSS background blur effect */}
      {!isLoaded && !isError && (
        <div
          className={`absolute inset-0 ${blurColor} backdrop-blur-md animate-pulse transition-opacity duration-500 z-10`}
        />
      )}

      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        onLoad={(e) => {
          setIsLoaded(true);
          if (onLoad) onLoad(e);
        }}
        onError={(e) => {
          setIsError(true);
          if (onError) onError(e);
        }}
        className={`w-full h-full object-cover transition-all duration-500 ${
          isLoaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-sm scale-105'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImg;
