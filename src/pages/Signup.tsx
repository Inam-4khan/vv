import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { validateSignupForm } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

export interface SignupProps {
  onSignup?: (data?: any) => void;
  onBack?: () => void;
  onSwitchToLogin?: () => void;
  onNavigate?: (path: string) => void;
  onSuccess?: (data?: any) => void;
}

export const Signup: React.FC<SignupProps> = ({
  onSignup,
  onBack,
  onSwitchToLogin,
  onNavigate,
  onSuccess,
}) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<{
    name: string | null;
    email: string | null;
    password: string | null;
    confirmPassword?: string | null;
    terms: string | null;
  }>({
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
    terms: null,
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    const fieldKey = name === 'termsAccepted' ? 'terms' : name;
    if (touched[fieldKey as keyof typeof touched] || errors[fieldKey as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [fieldKey]: null,
      }));
    }
  };

  const handleBlur = (field: 'name' | 'email' | 'password' | 'confirmPassword' | 'terms') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const validation = validateSignupForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.termsAccepted
    );
    setErrors((prev) => ({
      ...prev,
      [field]: (validation.errors as any)[field],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateSignupForm(
      formData.name,
      formData.email,
      formData.password,
      formData.confirmPassword,
      formData.termsAccepted
    );

    setErrors(validation.errors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      terms: true,
    });

    if (!validation.isValid) {
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (login) {
        login({
          id: formData.email,
          email: formData.email,
          username: formData.name || formData.email.split('@')[0],
        });
      }

      if (onSignup) onSignup(formData);
      if (onSuccess) onSuccess(formData);

      if (onNavigate) {
        onNavigate('/home');
      } else if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/home');
        window.dispatchEvent(new Event('popstate'));
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSwitchToLogin) onSwitchToLogin();
    else if (onBack) onBack();
    else if (onNavigate) onNavigate('/login');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E8F6F4] p-4 sm:p-6 lg:p-8 animate-fade-in relative overflow-hidden font-lexend">
      {/* Background ambient mint glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[color-mix(in_srgb,var(--app-accent)_15%,transparent)] rounded-full blur-3xl"></div>
      </div>

      {/* Floating Clean White Card */}
      <div className="relative w-full max-w-md bg-white border border-[color-mix(in_srgb,var(--app-primary)_5%,transparent)] rounded-[2.2rem] p-6 sm:p-8 shadow-xl text-slate-900 dark:text-[#F1FAEE] my-auto">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else if (onSwitchToLogin) onSwitchToLogin();
            }}
            className="w-10 h-10 rounded-full bg-[#E8F6F4] hover:bg-[#D8F0EC] text-slate-900 dark:text-[#F1FAEE] flex items-center justify-center transition-all active:scale-90"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <BrandLogo size={26} color="var(--app-primary)" />
            <span className="font-extrabold tracking-wider text-base font-montserrat text-slate-900 dark:text-[#F1FAEE]">
              VIZU
            </span>
          </div>

          <div className="w-10" /> {/* Balance spacer */}
        </div>

        {/* Header */}
        <div className="text-left mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-montserrat text-slate-900 dark:text-[#F1FAEE]">
            Create Persona
          </h1>
          <p className="text-xs sm:text-sm text-[color-mix(in_srgb,var(--app-primary)_60%,transparent)] mt-1">
            Join the Vizu community
          </p>
        </div>

        {submitError && (
          <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-medium text-rose-600 text-center">
            {submitError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Field 1: Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-name" className="text-xs font-semibold text-slate-900 dark:text-[#F1FAEE]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <UserIcon size={18} className="absolute left-3.5 text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] pointer-events-none" />
              <input
                id="signup-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                placeholder="username"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-[#F1FAEE] placeholder:text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] focus:outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] transition-all font-medium"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          {/* Field 2: Email Address */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="text-xs font-semibold text-slate-900 dark:text-[#F1FAEE]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] pointer-events-none" />
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                placeholder="jane@vizu.com"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-[#F1FAEE] placeholder:text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] focus:outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] transition-all font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500">{errors.email}</p>
            )}
          </div>

          {/* Field 3: Create Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-password" className="text-xs font-semibold text-slate-900 dark:text-[#F1FAEE]">
              Create Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] pointer-events-none" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] pl-11 pr-11 py-3 text-sm text-slate-900 dark:text-[#F1FAEE] placeholder:text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] focus:outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[color-mix(in_srgb,var(--app-primary)_50%,transparent)] hover:text-slate-900 dark:text-[#F1FAEE] transition-colors focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500">{errors.password}</p>
            )}
          </div>

          {/* Field 4: Confirm Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-confirm-password" className="text-xs font-semibold text-slate-900 dark:text-[#F1FAEE]">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] pointer-events-none" />
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] pl-11 pr-11 py-3 text-sm text-slate-900 dark:text-[#F1FAEE] placeholder:text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] focus:outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] transition-all font-medium"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Small Teal Checkbox for Terms & Privacy */}
          <div className="pt-1">
            <label htmlFor="signup-terms" className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[color-mix(in_srgb,var(--app-primary)_80%,transparent)] hover:text-slate-900 dark:text-[#F1FAEE] transition-colors">
              <input
                id="signup-terms"
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                onBlur={() => handleBlur('terms')}
                className="w-4 h-4 rounded border-[color-mix(in_srgb,var(--app-primary)_20%,transparent)] text-[var(--app-accent)] focus:ring-[color-mix(in_srgb,var(--app-accent)_30%,transparent)] focus:ring-offset-0 accent-[var(--app-accent)] cursor-pointer shrink-0"
              />
              <span>
                I agree to{' '}
                <a href="#terms" className="text-[var(--app-accent)] hover:underline font-semibold">
                  Terms & Privacy
                </a>
              </span>
            </label>
            {errors.terms && (
              <p className="text-xs text-rose-500 mt-1">{errors.terms}</p>
            )}
          </div>

          {/* Centered Bright Teal Pill-Shaped CTA Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-[var(--app-accent)] hover:bg-[#25A89B] text-slate-900 dark:text-[#F1FAEE] font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-80"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Creating Persona...</span>
              </>
            ) : (
              'Create My Persona'
            )}
          </button>
        </form>

        {/* Bottom Link */}
        <div className="mt-8 text-center text-xs text-[color-mix(in_srgb,var(--app-primary)_70%,transparent)] pt-4 border-t border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)]">
          Already have a Persona?{' '}
          <button
            type="button"
            onClick={handleLoginClick}
            className="text-[var(--app-accent)] hover:underline font-bold transition-colors focus:outline-none ml-1"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
