import React from 'react';

/**
 * VIZU AR Glassmorphic UI Component System
 *
 * Visual Specifications:
 * - Backdrop Blur: Sigma 12px to 16px (backdrop-filter: blur(14px))
 * - Fill Opacity: Light Mode: #062B34 @ 18% | Dark Mode: #062B34 @ 68%
 * - Rim Lighting: 1.2px border stroke with top-left Neon Mint (#80FFEC) to Caribbean Teal (#2EC4B6) gradient
 * - Shadows: Soft diffused drop shadow (0 10px 30px -5px rgba(0,0,0,0.5))
 * - Typography: Primary Soft Mint White (#F1FAEE), Muted Atmospheric Ice (#8AADB5)
 * - Accent Actions: Solid Caribbean Teal (#2EC4B6) with Neon Mint (#80FFEC) highlights
 */

export interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  isDarkMode?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  glowOnHover?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  isDarkMode = true,
  onClick,
  style,
  glowOnHover = false,
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative rounded-3xl overflow-hidden backdrop-blur-[14px] transition-all duration-300 ${
        isDarkMode
          ? 'bg-[#062B34]/68 text-[#F1FAEE] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.5)]'
          : 'bg-[#062B34]/18 text-[#062B34] shadow-[0_10px_25px_-5px_rgba(6,43,52,0.15)]'
      } ${
        glowOnHover ? 'hover:shadow-[0_0_25px_rgba(46,196,182,0.4)] hover:scale-[1.02]' : ''
      } ${onClick ? 'cursor-pointer active:scale-95' : ''} ${className}`}
    >
      {/* Rim Lighting / Gradient Border Overlay */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none p-[1.2px] -z-10"
        style={{
          background: 'linear-gradient(135deg, rgba(128,255,236,0.8) 0%, rgba(46,196,182,0.4) 40%, rgba(6,43,52,0.1) 100%)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />
      
      {/* Top Refractive Light Beam Accent */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-[#80FFEC]/60 to-transparent pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'solid' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'solid',
  size = 'md',
  className = '',
  icon,
  fullWidth = false,
  disabled = false,
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px] rounded-xl',
    md: 'px-5 py-2.5 text-xs rounded-2xl',
    lg: 'px-6 py-3 text-sm rounded-2xl',
  };

  const variantClasses = {
    solid:
      'bg-[#2EC4B6] hover:bg-[#80FFEC] text-[#062B34] font-black shadow-[0_4px_15px_rgba(46,196,182,0.4)] hover:shadow-[0_6px_20px_rgba(128,255,236,0.6)] active:scale-95',
    glass:
      'bg-[#062B34]/60 backdrop-blur-[14px] text-[#F1FAEE] font-bold border border-[#80FFEC]/40 hover:border-[#80FFEC] hover:bg-[#062B34]/80 active:scale-95',
    ghost:
      'bg-transparent hover:bg-white/10 text-[#F1FAEE] font-bold border border-transparent hover:border-white/10 active:scale-95',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 uppercase tracking-widest transition-all duration-200 select-none ${
        sizeClasses[size]
      } ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${
        disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
      } ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export interface GlassBadgeProps {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const GlassBadge: React.FC<GlassBadgeProps> = ({
  label,
  icon,
  active = false,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-mono tracking-widest uppercase backdrop-blur-[14px] border transition-all ${
        active
          ? 'bg-[#2EC4B6]/25 text-[#80FFEC] border-[#80FFEC]/60 shadow-[0_0_10px_rgba(128,255,236,0.3)]'
          : 'bg-[#062B34]/60 text-[#8AADB5] border-white/10'
      } ${className}`}
    >
      {active && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#80FFEC] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#80FFEC]"></span>
        </span>
      )}
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </div>
  );
};

export interface GlassHUDContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassHUDContainer: React.FC<GlassHUDContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-4 sm:p-6 w-full max-w-lg mx-auto space-y-4 pointer-events-auto ${className}`}>
      {children}
    </div>
  );
};
