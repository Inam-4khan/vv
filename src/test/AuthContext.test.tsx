import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthProvider, useAuth } from '../context/AuthContext';

const TestComponent = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? `LoggedIn: ${user?.username}` : 'LoggedOut'}
      </div>
      <button
        onClick={() =>
          login({
            id: '1',
            email: 'user@vizu.app',
            username: 'vizu_master',
          })
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  it('starts with unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LoggedOut');
  });

  it('login sets user correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(screen.getByTestId('auth-status')).toHaveTextContent('LoggedIn: vizu_master');
  });

  it('logout clears user correctly', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('LoggedIn: vizu_master');

    fireEvent.click(screen.getByText('Logout'));
    expect(screen.getByTestId('auth-status')).toHaveTextContent('LoggedOut');
  });

  it('throws error when useAuth is used outside AuthProvider', () => {
    const originalError = console.error;
    console.error = () => {};

    expect(() => render(<TestComponent />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );

    console.error = originalError;
  });
});
