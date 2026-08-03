import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Signup } from '../pages/Signup';
import { AppStateProvider } from '../context/AppStateContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <AppStateProvider>
        <ToastProvider>
          {ui}
        </ToastProvider>
      </AppStateProvider>
    </AuthProvider>
  );
};

describe('SignupPage', () => {
  it('shows name, email, password, confirm password fields', () => {
    renderWithProviders(<Signup />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/create password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("shows error when passwords don't match", async () => {
    renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Rivers' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@vizu.com' } });
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different321' } });

    const termsCheckbox = screen.getByLabelText(/terms & privacy/i);
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /create my persona/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it('terms checkbox must be checked before submit succeeds', async () => {
    renderWithProviders(<Signup />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Rivers' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@vizu.com' } });
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /create my persona/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument();
    });
  });

  it('calls onSignup when all fields valid', async () => {
    const handleSignup = vi.fn();
    renderWithProviders(<Signup onSignup={handleSignup} />);

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Alex Rivers' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'alex@vizu.com' } });
    fireEvent.change(screen.getByLabelText(/create password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'password123' } });

    const termsCheckbox = screen.getByLabelText(/terms & privacy/i);
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /create my persona/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSignup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alex Rivers',
          email: 'alex@vizu.com',
          password: 'password123',
        })
      );
    });
  });
});
