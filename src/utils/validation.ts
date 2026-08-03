/**
 * Form Validation Utilities for Vizu
 */

export const validateEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (
  password: string,
  minLength: number = 8
): { isValid: boolean; error?: string } => {
  if (!password || typeof password !== 'string' || !password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < minLength) {
    return {
      isValid: false,
      error: `Password must be at least ${minLength} characters long`,
    };
  }
  return { isValid: true };
};

export const validateName = (name: string): { isValid: boolean; error?: string } => {
  if (!name || typeof name !== 'string' || !name.trim()) {
    return { isValid: false, error: 'Full name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters long' };
  }
  return { isValid: true };
};

export const validateLoginForm = (email: string, password: string) => {
  let emailError: string | null = null;
  if (!email || !email.trim()) {
    emailError = 'Email is required';
  } else if (!validateEmail(email)) {
    emailError = 'Please enter a valid email address';
  }

  const passwordResult = validatePassword(password, 8);
  let passwordError: string | null = null;
  if (!password || !password.trim()) {
    passwordError = 'Password is required';
  } else if (!passwordResult.isValid) {
    passwordError = passwordResult.error || 'Password must be at least 8 characters long';
  }

  return {
    isValid: !emailError && !passwordError,
    errors: {
      email: emailError,
      password: passwordError,
    },
  };
};

export const validateSignupForm = (
  name: string,
  email: string,
  password: string,
  confirmPassword?: string,
  termsAccepted?: boolean
) => {
  const nameResult = validateName(name);
  
  let emailError: string | null = null;
  if (!email || !email.trim()) {
    emailError = 'Email is required';
  } else if (!validateEmail(email)) {
    emailError = 'Please enter a valid email address';
  }

  const passwordResult = validatePassword(password, 8);
  let passwordError: string | null = null;
  if (!password || !password.trim()) {
    passwordError = 'Password is required';
  } else if (!passwordResult.isValid) {
    passwordError = passwordResult.error || 'Password must be at least 8 characters long';
  }

  let confirmPasswordError: string | null = null;
  if (confirmPassword !== undefined) {
    if (!confirmPassword || !confirmPassword.trim()) {
      confirmPasswordError = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      confirmPasswordError = 'Passwords do not match';
    }
  }

  let termsError: string | null = null;
  if (termsAccepted !== undefined && !termsAccepted) {
    termsError = 'You must agree to the Terms of Service';
  }

  const isValid =
    nameResult.isValid &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !termsError;

  return {
    isValid,
    errors: {
      name: nameResult.isValid ? null : (nameResult.error ?? null),
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
      terms: termsError,
    },
  };
};

