import React, { useState, useContext } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { validateSignupForm } from '../utils/validation';
import { AuthContext } from '../context/AuthContext';

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
  const auth = useContext(AuthContext);

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

      if (auth && auth.login) {
        auth.login({
          id: formData.email,
          email: formData.email,
          username: formData.name || formData.email.split('@')[0],
        });
      }

      if (onSignup) onSignup(formData);
      if (onSuccess) onSuccess(formData);

      if (onNavigate) {
        onNavigate('/dashboard');
      } else if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/dashboard');
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
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#2EC4B6]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#2EC4B6]/15 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Clean White Card */}
      <div className="relative w-full max-w-md bg-white border border-[#062B34]/5 rounded-[2.2rem] p-6 sm:p-8 shadow-xl text-[#062B34] my-auto">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => {
              if (onBack) onBack();
              else if (onSwitchToLogin) onSwitchToLogin();
            }}
            className="w-10 h-10 rounded-full bg-[#E8F6F4] hover:bg-[#D8F0EC] text-[#062B34] flex items-center justify-center transition-all active:scale-90"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2">
            <BrandLogo size={26} color="#062B34" />
            <span className="font-extrabold tracking-wider text-base font-montserrat text-[#062B34]">
              VIZU
            </span>
          </div>

          <div className="w-10" /> {/* Balance spacer */}
        </div>

        {/* Header */}
        <div className="text-left mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-montserrat text-[#062B34]">
            Create Persona
          </h1>
          <p className="text-xs sm:text-sm text-[#062B34]/60 mt-1">
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
            <label htmlFor="signup-name" className="text-xs font-semibold text-[#062B34]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <UserIcon size={18} className="absolute left-3.5 text-[#062B34]/40 pointer-events-none" />
              <input
                id="signup-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onBlur={() => handleBlur('name')}
                placeholder="username"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[#062B34]/10 pl-11 pr-4 py-3 text-sm text-[#062B34] placeholder:text-[#062B34]/40 focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all font-medium"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-500">{errors.name}</p>
            )}
          </div>

          {/* Field 2: Email Address */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-email" className="text-xs font-semibold text-[#062B34]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={18} className="absolute left-3.5 text-[#062B34]/40 pointer-events-none" />
              <input
                id="signup-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleBlur('email')}
                placeholder="jane@vizu.com"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[#062B34]/10 pl-11 pr-4 py-3 text-sm text-[#062B34] placeholder:text-[#062B34]/40 focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all font-medium"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-500">{errors.email}</p>
            )}
          </div>

          {/* Field 3: Create Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="signup-password" className="text-xs font-semibold text-[#062B34]">
              Create Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-[#062B34]/40 pointer-events-none" />
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleBlur('password')}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[#062B34]/10 pl-11 pr-11 py-3 text-sm text-[#062B34] placeholder:text-[#062B34]/40 focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-[#062B34]/50 hover:text-[#062B34] transition-colors focus:outline-none"
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
            <label htmlFor="signup-confirm-password" className="text-xs font-semibold text-[#062B34]">
              Confirm Password
            </label>
            <div className="relative flex items-center">
              <Lock size={18} className="absolute left-3.5 text-[#062B34]/40 pointer-events-none" />
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onBlur={() => handleBlur('confirmPassword')}
                placeholder="••••••••"
                className="w-full rounded-2xl bg-[#FFFDE0] border border-[#062B34]/10 pl-11 pr-11 py-3 text-sm text-[#062B34] placeholder:text-[#062B34]/40 focus:outline-none focus:border-[#2EC4B6] focus:ring-2 focus:ring-[#2EC4B6]/20 transition-all font-medium"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Small Teal Checkbox for Terms & Privacy */}
          <div className="pt-1">
            <label htmlFor="signup-terms" className="flex items-center gap-2.5 cursor-pointer select-none text-xs text-[#062B34]/80 hover:text-[#062B34] transition-colors">
              <input
                id="signup-terms"
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleInputChange}
                onBlur={() => handleBlur('terms')}
                className="w-4 h-4 rounded border-[#062B34]/20 text-[#2EC4B6] focus:ring-[#2EC4B6]/30 focus:ring-offset-0 accent-[#2EC4B6] cursor-pointer shrink-0"
              />
              <span>
                I agree to{' '}
                <a href="#terms" className="text-[#2EC4B6] hover:underline font-semibold">
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
            className="w-full mt-6 bg-[#2EC4B6] hover:bg-[#25A89B] text-white font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-80"
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
        <div className="mt-8 text-center text-xs text-[#062B34]/70 pt-4 border-t border-[#062B34]/10">
          Already have a Persona?{' '}
          <button
            type="button"
            onClick={handleLoginClick}
            className="text-[#2EC4B6] hover:underline font-bold transition-colors focus:outline-none ml-1"
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
