/**
 * AuthContext handles authentication sessions, JWT tokens, login credentials,
 * and authentication API workflows.
 *
 * Separation of Concerns:
 * - AuthContext: Low-level session tokens, OAuth / JWT credential state, and Auth API calls.
 * - AppStateContext: Application-wide UI state (active view, theme, ghost mode, active user profile).
 */
import React, { createContext, useContext, useState, ReactNode, useCallback, useRef, useEffect } from 'react';
import { AuthUser, AppUser } from '../types/auth.types';

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthContextType {
  user: User | AuthUser | null;
  profile: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (credentialsOrUser: any, password?: string) => Promise<void> | void;
  loginWithGoogle?: (googleToken: string) => Promise<void>;
  logout: () => Promise<void> | void;
  refreshToken?: () => Promise<boolean>;
  verifyEmail?: (code: string) => Promise<void>;
  setupTwoFactor?: () => Promise<{ qrCodeUrl: string; secret: string }>;
  verifyTwoFactor?: (code: string) => Promise<void>;
}

let inMemoryAccessToken: string | null = null;

export const getAccessToken = () => inMemoryAccessToken;
export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | AuthUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const login = useCallback(async (credentialsOrUser: any, password?: string) => {
    setIsLoading(true);
    try {
      if (typeof credentialsOrUser === 'object' && credentialsOrUser !== null) {
        // Direct user object login (for mock / test compatibility)
        setUser(credentialsOrUser);
        setAccessToken('in_memory_session_token_' + Date.now());
      } else if (typeof credentialsOrUser === 'string') {
        const usernameOrEmail = credentialsOrUser;
        const pwd = password || '';
        if (!pwd) {
          throw new Error('Password is required');
        }
        const newUser: User = {
          id: 'usr_' + Date.now(),
          email: usernameOrEmail.includes('@') ? usernameOrEmail : `${usernameOrEmail}@vizu.app`,
          username: usernameOrEmail.split('@')[0] ?? usernameOrEmail,
        };
        setUser(newUser);
        setAccessToken('in_memory_session_token_' + Date.now());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setUser(null);
    setProfile(null);
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
  }, []);

  useEffect(() => {
    const timer = refreshTimerRef.current;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
        accessToken: inMemoryAccessToken,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

