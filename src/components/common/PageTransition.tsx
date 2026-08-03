import React, { useEffect, useState, ReactNode } from 'react';

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
  const [displayedChildren, setDisplayedChildren] = useState<ReactNode>(children);
  const [transitionStage, setTransitionStage] = useState<'enter' | 'active' | 'exit'>('active');

  useEffect(() => {
    if (children === displayedChildren) {
      return;
    }

    // Trigger exit animation
    setTransitionStage('exit');

    const timer = setTimeout(() => {
      setDisplayedChildren(children);
      setTransitionStage('enter');

      // Immediately follow with active state in next frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransitionStage('active');
        });
      });
    }, 150); // 150ms exit fade out duration

    return () => clearTimeout(timer);
  }, [pageKey, children, displayedChildren]);

  const getTransitionStyle = () => {
    switch (transitionStage) {
      case 'enter':
        return 'opacity-0 translate-y-6 scale-[0.98] transition-none';
      case 'exit':
        return 'opacity-0 -translate-y-3 scale-[0.98] transition-all duration-180 ease-out pointer-events-none';
      case 'active':
      default:
        return 'opacity-100 translate-y-0 scale-100 transition-all duration-350 ease-[cubic-bezier(0.34,1.3,0.64,1)]';
    }
  };

  return (
    <div className={`w-full flex-1 flex flex-col ${getTransitionStyle()} ${className}`}>
      {displayedChildren}
    </div>
  );
};
