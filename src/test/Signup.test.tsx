import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Signup } from '../pages/Signup';

describe('Signup Component', () => {
  it('renders centered card layout with VIZU brand logo and header', () => {
    render(<Signup />);
    expect(screen.getByText('VIZU')).toBeInTheDocument();
    expect(
      screen.getByText(/Join the Vizu community/i)
    ).toBeInTheDocument();
  });

  it('renders name, email, password, and terms checkbox', () => {
    render(<Signup />);
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/create password/i)).toBeInTheDocument();
    expect(
      screen.getByLabelText(/terms & privacy/i)
    ).toBeInTheDocument();
  });

  it('shows inline error messages when required fields are missing on submit', async () => {
    render(<Signup />);
    const submitButton = screen.getByRole('button', { name: /create my persona/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument();
    });
  });

  it('validates email format and terms checkbox', async () => {
    render(<Signup />);
    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInput = screen.getByLabelText(/create password/i);
    const submitButton = screen.getByRole('button', { name: /create my persona/i });

    fireEvent.change(nameInput, { target: { value: 'Alex Rivers' } });
    fireEvent.change(emailInput, { target: { value: 'bad-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/you must agree to the terms/i)).toBeInTheDocument();
    });
  });

  it('submits successfully and navigates when all inputs are valid', async () => {
    const handleSignup = vi.fn();
    const handleNavigate = vi.fn();

    render(<Signup onSignup={handleSignup} onNavigate={handleNavigate} />);

    fireEvent.change(screen.getByLabelText(/full name/i), {
      target: { value: 'Alex Rivers' },
    });
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alex@vizu.app' },
    });
    fireEvent.change(screen.getByLabelText(/create password/i), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' },
    });

    const termsCheckbox = screen.getByLabelText(/terms & privacy/i);
    fireEvent.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /create my persona/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSignup).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Alex Rivers',
          email: 'alex@vizu.app',
        })
      );
      expect(handleNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('switches to login when clicking log in button', () => {
    const handleSwitch = vi.fn();
    render(<Signup onSwitchToLogin={handleSwitch} />);

    const loginBtn = screen.getByRole('button', { name: /log in/i });
    fireEvent.click(loginBtn);

    expect(handleSwitch).toHaveBeenCalledTimes(1);
  });
});
