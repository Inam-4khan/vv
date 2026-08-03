import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateLoginForm,
  validateSignupForm,
} from '../utils/validation';

describe('Form Validation Logic', () => {
  describe('validateEmail', () => {
    it('returns true for valid email formats', () => {
      expect(validateEmail('alex@vizu.app')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('returns false for invalid email formats', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@domain')).toBe(false);
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null as any)).toBe(false);
      expect(validateEmail(undefined as any)).toBe(false);
    });
  });

  describe('validatePassword', () => {
    it('returns valid when password meets minimum length requirement', () => {
      const result = validatePassword('securepass123', 8);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('returns error when password is too short', () => {
      const result = validatePassword('short', 8);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters long');
    });

    it('supports custom minimum length parameter', () => {
      const resultCustom = validatePassword('12345', 5);
      expect(resultCustom.isValid).toBe(true);

      const resultCustomFail = validatePassword('1234', 5);
      expect(resultCustomFail.isValid).toBe(false);
    });

    it('returns error when password is empty or null', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword(null as any).isValid).toBe(false);
    });
  });

  describe('validateName', () => {
    it('returns valid for names at least 2 characters long', () => {
      expect(validateName('Alex Rivers').isValid).toBe(true);
    });

    it('returns error for empty or single char names', () => {
      expect(validateName('').isValid).toBe(false);
      expect(validateName('A').isValid).toBe(false);
    });
  });

  describe('validateLoginForm', () => {
    it('validates complete form successfully when inputs are correct', () => {
      const result = validateLoginForm('persona@vizu.app', 'password123');
      expect(result.isValid).toBe(true);
      expect(result.errors.email).toBeNull();
      expect(result.errors.password).toBeNull();
    });

    it('returns proper error object when form inputs fail', () => {
      const result = validateLoginForm('bad-email', '123');
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Please enter a valid email address');
      expect(result.errors.password).toBe(
        'Password must be at least 8 characters long'
      );
    });
  });

  describe('validateSignupForm', () => {
    it('validates signup form successfully when all inputs match criteria', () => {
      const result = validateSignupForm(
        'Alex Rivers',
        'alex@vizu.app',
        'password123',
        'password123',
        true
      );
      expect(result.isValid).toBe(true);
      expect(result.errors.name).toBeNull();
      expect(result.errors.email).toBeNull();
      expect(result.errors.password).toBeNull();
      expect(result.errors.confirmPassword).toBeNull();
      expect(result.errors.terms).toBeNull();
    });

    it('detects mismatched passwords', () => {
      const result = validateSignupForm(
        'Alex Rivers',
        'alex@vizu.app',
        'password123',
        'password456',
        true
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toBe('Passwords do not match');
    });

    it('detects unaccepted terms', () => {
      const result = validateSignupForm(
        'Alex Rivers',
        'alex@vizu.app',
        'password123',
        'password123',
        false
      );
      expect(result.isValid).toBe(false);
      expect(result.errors.terms).toBe('You must agree to the Terms of Service');
    });
  });
});
