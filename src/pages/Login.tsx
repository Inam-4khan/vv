import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { BrandLogo } from '../../components/common/BrandLogo';
import { validateLoginForm } from '../utils/validation';
import { useAuth } from '../context/AuthContext';

export interface LoginProps {
  onLogin?: (data?: any) => void;
  onSignUp?: () => void;
  onSwitchToSignup?: () => void;
  onNavigate?: (path: string) => void;
  onSuccess?: (data?: any) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  onSignUp,
  onSwitchToSignup,
  onNavigate,
  onSuccess,
  onBack,
}) => {
  const { loginWithGoogle, login } = useAuth();

  const [mode, setMode] = useState<'login' | 'reset'>('login');

  // Login form state
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
    rememberMe: false,
  });

  useEffect(() => {
    try {
      const savedId = localStorage.getItem('vizu_remember_identifier');
      if (savedId) {
        setFormData((prev) => ({
          ...prev,
          identifier: savedId,
          rememberMe: true,
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const [errors, setErrors] = useState<{
    identifier: string | null;
    password: string | null;
  }>({
    identifier: null,
    password: null,
  });

  const [touched, setTouched] = useState({
    identifier: false,
    password: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));

    if (touched[name as keyof typeof touched] || errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleBlur = (field: 'identifier' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (!formData[field]) {
      setErrors((prev) => ({ ...prev, [field]: `${field === 'identifier' ? 'Username or Email' : 'Password'} is required` }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateLoginForm(formData.identifier || '', formData.password);
    const identifierError = !formData.identifier
      ? 'Please enter your username or email'
      : validation.errors.email;
    
    if (identifierError || validation.errors.password) {
      setErrors({
        identifier: identifierError,
        password: validation.errors.password,
      });
      return;
    }

    setIsLoading(true);

    try {
      if (formData.rememberMe) {
        localStorage.setItem('vizu_remember_identifier', formData.identifier);
      } else {
        localStorage.removeItem('vizu_remember_identifier');
      }

      await new Promise((resolve) => setTimeout(resolve, 800));

      if (login) {
        login({
          id: formData.identifier,
          email: formData.identifier.includes('@') ? formData.identifier : `${formData.identifier}@vizu.com`,
          username: formData.identifier.split('@')[0],
        });
      }

      if (onLogin) onLogin(formData);
      if (onSuccess) onSuccess(formData);

      if (onNavigate) {
        onNavigate('/home');
      } else if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/home');
        window.dispatchEvent(new Event('popstate'));
      }
    } catch (err: any) {
      setSubmitError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setResetLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setResetLoading(false);
    setResetSuccess(true);
  };

  const handleSignUpClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSwitchToSignup) onSwitchToSignup();
    else if (onSignUp) onSignUp();
    else if (onNavigate) onNavigate('/signup');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#E8F6F4] p-4 sm:p-6 lg:p-8 animate-fade-in relative overflow-hidden font-lexend">
      {/* Background ambient mint glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[color-mix(in_srgb,var(--app-accent)_15%,transparent)] rounded-full blur-3xl"></div>
      </div>

      {/* Floating Clean White Card */}
      <div className="relative w-full max-w-md bg-white border border-[color-mix(in_srgb,var(--app-primary)_5%,transparent)] rounded-[2.2rem] p-6 sm:p-8 shadow-xl text-slate-900 dark:text-[#F1FAEE] my-auto transition-all">
        {/* Top Bar with Back Navigation & VIZU Logo */}
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={() => {
              if (mode === 'reset') setMode('login');
              else if (onBack) onBack();
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

          <div className="w-10" /> {/* Spacer balance */}
        </div>

        {mode === 'login' ? (
          <>
            {/* Left-Aligned Header */}
            <div className="text-left mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-montserrat text-slate-900 dark:text-[#F1FAEE]">
                Login
              </h1>
              <p className="text-xs sm:text-sm text-[color-mix(in_srgb,var(--app-primary)_60%,transparent)] mt-1">
                Good to see you again
              </p>
            </div>

            {submitError && (
              <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-medium text-rose-600 text-center">
                {submitError}
              </div>
            )}

            {/* Form */}
            
            <div className="mb-4">
              <button
                type="button"
                onClick={async () => {
                  try {
                    setSubmitError(null);
                    await loginWithGoogle();
                    if (onLogin) onLogin();
                    if (onSuccess) onSuccess();
                    if (onNavigate) onNavigate('/home');
                  } catch (e: any) {
                    console.error('Google login error:', e);
                    setSubmitError(e?.message || 'Google sign-in failed. Please try again.');
                  }
                }}
                className="w-full bg-white text-gray-700 font-bold py-3 px-6 rounded-full shadow-sm hover:shadow-md border border-gray-200 transition-all flex items-center justify-center gap-3"
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
                Sign in with Google
              </button>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)]"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-semibold text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)]">OR</span>
                <div className="flex-grow border-t border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)]"></div>
              </div>
            </div>

<form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Field 1: Username or Email */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-identifier" className="text-xs font-semibold text-slate-900 dark:text-[#F1FAEE]">
                  Username or Email
                </label>
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-3.5 text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] pointer-events-none" />
                  <input
                    id="login-identifier"
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('identifier')}
                    placeholder="vizu_user"
                    className="w-full rounded-2xl bg-[#FFFDE0] border border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-[#F1FAEE] placeholder:text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] focus:outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] transition-all font-medium"
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-rose-500">{errors.identifier}</p>
                )}
              </div>

              {/* Field 2: Password */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold text-slate-900 dark:text-[#F1FAEE]">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-3.5 text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] pointer-events-none" />
                  <input
                    id="login-password"
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

              {/* Remember Me Toggle & Forgot Password */}
              <div className="flex items-center justify-between pt-1">
                <label htmlFor="rememberMe" className="flex items-center gap-2 cursor-pointer select-none text-xs font-semibold text-slate-900 dark:text-[#F1FAEE] hover:text-[var(--app-accent)] transition-colors">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 rounded border-[color-mix(in_srgb,var(--app-primary)_20%,transparent)] text-[var(--app-accent)] focus:ring-[color-mix(in_srgb,var(--app-accent)_30%,transparent)] focus:ring-offset-0 accent-[var(--app-accent)] cursor-pointer shrink-0"
                  />
                  <span>Remember Me</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setSubmitError(null);
                    setMode('reset');
                  }}
                  className="text-xs text-[color-mix(in_srgb,var(--app-primary)_70%,transparent)] hover:text-[var(--app-accent)] font-medium transition-colors focus:outline-none"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Centered Bright Teal Pill-Shaped Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 bg-[var(--app-accent)] hover:bg-[#25A89B] text-slate-900 dark:text-[#F1FAEE] font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-80"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Entering Vizu...</span>
                  </>
                ) : (
                  'Enter Vizu'
                )}
              </button>
            </form>

            {/* Bottom Links */}
            <div className="mt-8 pt-4 border-t border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] text-center text-xs">
              <button
                type="button"
                onClick={handleSignUpClick}
                className="text-[color-mix(in_srgb,var(--app-primary)_80%,transparent)] hover:text-[var(--app-accent)] font-semibold transition-colors focus:outline-none"
              >
                New here? <span className="text-[var(--app-accent)] underline font-bold">Create a Persona</span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Password Recovery View */}
            <div className="text-left mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)] text-[var(--app-accent)] flex items-center justify-center mb-4">
                <KeyRound size={24} />
              </div>

              <h1 className="text-2xl font-extrabold tracking-tight font-montserrat text-slate-900 dark:text-[#F1FAEE]">
                Reset Password
              </h1>
              <p className="text-xs sm:text-sm text-[color-mix(in_srgb,var(--app-primary)_60%,transparent)] mt-1">
                Enter your email to receive a recovery code
              </p>
            </div>

            {resetSuccess ? (
              <div className="py-6 flex flex-col items-center text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-[#F1FAEE] text-base">Check your inbox</h3>
                <p className="text-xs text-[color-mix(in_srgb,var(--app-primary)_70%,transparent)] max-w-xs">
                  We've sent recovery instructions to <span className="font-semibold text-slate-900 dark:text-[#F1FAEE]">{resetEmail}</span>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setResetSuccess(false);
                    setMode('login');
                  }}
                  className="mt-4 w-full bg-[var(--app-accent)] hover:bg-[#25A89B] text-slate-900 dark:text-[#F1FAEE] font-bold py-3.5 rounded-full shadow-md transition-all"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4" noValidate>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-900 dark:text-[#F1FAEE]">
                    Registered Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail size={18} className="absolute left-3.5 text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] pointer-events-none" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="yourname@domain.com"
                      required
                      className="w-full rounded-2xl bg-[#FFFDE0] border border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] pl-11 pr-4 py-3 text-sm text-slate-900 dark:text-[#F1FAEE] placeholder:text-[color-mix(in_srgb,var(--app-primary)_40%,transparent)] focus:outline-none focus:border-[var(--app-accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] transition-all font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading || !resetEmail}
                  className="w-full mt-6 bg-[var(--app-accent)] hover:bg-[#25A89B] text-slate-900 dark:text-[#F1FAEE] font-bold py-3.5 px-6 rounded-full shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5 disabled:opacity-70"
                >
                  {resetLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            )}

            <div className="mt-6 pt-4 border-t border-[color-mix(in_srgb,var(--app-primary)_10%,transparent)] text-center">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[color-mix(in_srgb,var(--app-primary)_80%,transparent)] hover:text-[var(--app-accent)] font-semibold transition-colors focus:outline-none"
              >
                Back to Login
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
