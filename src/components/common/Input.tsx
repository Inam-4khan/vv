import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
  icon?: React.ComponentType<{ size?: number; className?: string }> | React.ReactNode;
  rightElement?: React.ReactNode;
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  disabled = false,
  icon: Icon,
  rightElement,
  className = '',
  containerClassName = '',
  autoComplete,
  ...props
}) => {
  const inputId = id || name;

  const renderIcon = () => {
    if (!Icon) return null;
    if (React.isValidElement(Icon)) return Icon;
    if (typeof Icon === 'function' || (typeof Icon === 'object' && Icon !== null)) {
      const IconComp = Icon as any;
      return <IconComp size={18} />;
    }
    return Icon as React.ReactNode;
  };

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-[#062B34]/80 dark:text-white/80"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center justify-center">
            {renderIcon()}
          </div>
        )}

        <input
          id={inputId}
          name={name || inputId}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={`w-full rounded-2xl border-2 bg-white/80 dark:bg-[#0F2229]/80 px-4 py-3 text-sm text-[#062B34] dark:text-white placeholder:text-slate-400 transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
            Icon ? 'pl-11' : ''
          } ${rightElement ? 'pr-11' : ''} ${
            error
              ? 'border-rose-500 focus:border-rose-600 focus:ring-2 focus:ring-rose-500/20'
              : 'border-[#062B34]/15 dark:border-white/10 focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20'
          } ${className}`}
          {...props}
        />

        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-xs font-medium text-rose-500 mt-0.5 animate-fadeIn"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
