import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Login } from '../pages/Login';

describe('Login Component', () => {
  it('renders centered card layout with VIZU brand logo and header', () => {
    render(<Login />);
    expect(screen.getByText('VIZU')).toBeInTheDocument();
    expect(
      screen.getByText(/Good to see you again/i)
    ).toBeInTheDocument();
  });

  it('renders email and password form fields with Input component', () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/^password/i);

    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  it('renders password input and forgot password link', () => {
    render(<Login />);
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByText(/forgot password\?/i)).toBeInTheDocument();
  });

  it('shows inline validation error messages when submitting empty form', async () => {
    render(<Login />);
    const submitButton = screen.getByRole('button', { name: /enter vizu/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter your username or email/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('shows error for invalid email format and short password', async () => {
    render(<Login />);
    const emailInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /enter vizu/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email address/i)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/password must be at least 8 characters long/i)
      ).toBeInTheDocument();
    });
  });

  it('handles successful submission and triggers callback or navigation', async () => {
    const handleLogin = vi.fn();
    const handleNavigate = vi.fn();

    render(<Login onLogin={handleLogin} onNavigate={handleNavigate} />);

    const emailInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/^password/i);
    const submitButton = screen.getByRole('button', { name: /enter vizu/i });

    fireEvent.change(emailInput, { target: { value: 'alex@vizu.app' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleLogin).toHaveBeenCalledWith(
        expect.objectContaining({ identifier: 'alex@vizu.app' })
      );
      expect(handleNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('switches to signup when clicking create persona button', () => {
    const handleSwitch = vi.fn();
    render(<Login onSwitchToSignup={handleSwitch} />);

    const signUpBtn = screen.getByRole('button', { name: /new here\? create a persona/i });
    fireEvent.click(signUpBtn);

    expect(handleSwitch).toHaveBeenCalledTimes(1);
  });
});
