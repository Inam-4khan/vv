import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'glass' | 'ghost' | 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold tracking-wider uppercase transition-all duration-200 select-none focus:outline-none';

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px] rounded-xl',
    md: 'px-5 py-2.5 text-xs rounded-2xl',
    lg: 'px-6 py-3 text-sm rounded-2xl',
  };

  const variantClasses = {
    solid:
      'bg-[#2EC4B6] hover:bg-[#80FFEC] text-[#062B34] font-black shadow-[0_4px_15px_rgba(46,196,182,0.4)] active:scale-95',
    glass:
      'bg-[#062B34]/60 backdrop-blur-[14px] text-[#F1FAEE] border border-[#80FFEC]/40 hover:border-[#80FFEC] active:scale-95',
    ghost:
      'bg-transparent hover:bg-white/10 text-[#F1FAEE] border border-transparent hover:border-white/10 active:scale-95',
    primary:
      'bg-[#062B34] hover:bg-[#0C3B46] text-[#F1FAEE] shadow-md active:scale-95',
    secondary:
      'bg-white/10 hover:bg-white/20 text-[#F1FAEE] border border-white/10 active:scale-95',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-md active:scale-95',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
