import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from '../pages/Login';
import { AppStateProvider } from '../context/AppStateContext';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <AuthProvider>
      <AppStateProvider>
        <ToastProvider>{ui}</ToastProvider>
      </AppStateProvider>
    </AuthProvider>
  );
};

describe('LoginPage Component', () => {
  it('renders the login form without crashing', () => {
    renderWithProviders(<Login />);
    expect(screen.getByText('VIZU')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  it('shows email and password fields', () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
  });

  it('shows validation error when form submitted empty', async () => {
    renderWithProviders(<Login />);
    const submitBtn = screen.getByRole('button', { name: /enter vizu/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter your username or email/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows email format error for invalid email', async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitBtn = screen.getByRole('button', { name: /enter vizu/i });

    fireEvent.change(emailInput, { target: { value: 'notanemail' } });
    fireEvent.change(passwordInput, { target: { value: 'validpassword123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it('shows password error for password under 8 chars', async () => {
    renderWithProviders(<Login />);
    const emailInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitBtn = screen.getByRole('button', { name: /enter vizu/i });

    fireEvent.change(emailInput, { target: { value: 'user@vizu.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
    });
  });

  it('calls onLogin prop when valid credentials entered and form submitted', async () => {
    const handleLogin = vi.fn();
    renderWithProviders(<Login onLogin={handleLogin} />);

    const emailInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitBtn = screen.getByRole('button', { name: /enter vizu/i });

    fireEvent.change(emailInput, { target: { value: 'valid@vizu.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith(
        expect.objectContaining({ identifier: 'valid@vizu.com', password: 'password123' })
      );
    });
  });

  it('loading state: submit button shows spinner and is disabled during submission', async () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitBtn = screen.getByRole('button', { name: /enter vizu/i });

    fireEvent.change(emailInput, { target: { value: 'valid@vizu.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(screen.getByText(/entering vizu/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });
  });
});
