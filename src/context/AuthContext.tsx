import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { User, AuthUser, AppUser } from '../types/auth.types';
import { useToast } from './ToastContext';

export interface AuthContextType {
  user: any;
  profile: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  login?: (userData?: any) => void;
}

let inMemoryAccessToken: string | null = null;
export const getAccessToken = () => inMemoryAccessToken;
export const setAccessToken = (token: string | null) => { inMemoryAccessToken = token; };

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [isSyncing, setIsSyncing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setAccessToken(token);
        
        setIsSyncing(true);
        try {
          // Sync with our backend
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) throw new Error('Failed to fetch');
          const dbUser = await res.json();
          setUser(firebaseUser);
          setProfile(dbUser);
        } catch (err) {
          console.error(err);
          showToast('Could not load user profile. Try again.', 'error');
          setUser(null);
          setProfile(null);
        } finally {
          setIsSyncing(false);
          setIsLoading(false);
        }
      } else {
        setUser(null);
        setProfile(null);
        setAccessToken(null);
        setIsLoading(false);
      }
    });
    
    return unsubscribe;
  }, [showToast]);

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Login failed", error);
      setIsLoading(false);
    }
  };

  const login = (userData?: any) => {
    if (userData) {
      const mockUser: any = {
        uid: userData.id || '1',
        email: userData.email,
        displayName: userData.username || userData.name || 'User',
        username: userData.username || userData.name || 'User',
        getIdToken: async () => 'mock-token-demo',
      };
      const mockProfile: any = {
        id: userData.id || '1',
        email: userData.email,
        username: userData.username || userData.name || 'User',
        displayName: userData.username || userData.name || 'User',
        avatar: userData.avatar || `https://picsum.photos/seed/${userData.username || 'demo'}/200`,
      };
      setAccessToken('mock-token-demo');
      setUser(mockUser);
      setProfile(mockProfile);
    }
  };

  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    setProfile(null);
    try {
      await signOut(auth);
    } catch {
      // Ignored for testing or offline environments
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user && !!profile,
        isLoading,
        accessToken: inMemoryAccessToken,
        loginWithGoogle,
        logout,
        login,
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
