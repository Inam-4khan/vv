
import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  color?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ className = '', size = 100, color = '#062B34' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M50 15C58 42 62 42 85 50C62 58 58 58 50 85C42 58 38 58 15 50C38 42 42 42 50 15Z" 
        fill={color} 
      />
    </svg>
  );
};
