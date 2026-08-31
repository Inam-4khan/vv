import React, { ReactNode } from 'react';

interface PageTransitionProps {
  pageKey: string;
  children: ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  pageKey,
  children,
  className = '',
}) => {
  return (
    <div
      key={pageKey}
      className={`w-full flex-1 flex flex-col animate-fade-in ${className}`}
    >
      {children}
    </div>
  );
};

export default PageTransition;


