import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase';
import { signInWithPopup, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { AppUser } from '../types/auth.types';
import { useToast } from './ToastContext';

export interface AuthContextType {
  user: FirebaseUser | null;
  profile: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  login?: (userData?: { id: string; email: string; username: string }) => void;
}

let inMemoryAccessToken: string | null = null;
export const getAccessToken = () => inMemoryAccessToken;
export const setAccessToken = (token: string | null) => {
  inMemoryAccessToken = token;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        setAccessToken(token);
        
        try {
          // Sync with backend
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) throw new Error('Failed to fetch user profile');
          const dbUser = await res.json();
          setUser(firebaseUser);
          setProfile(dbUser);
        } catch (err) {
          console.error('Error syncing user profile:', err);
          showToast('Could not load user profile. Try again.', 'error');
          setUser(null);
          setProfile(null);
        } finally {
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
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setAccessToken(null);
    setUser(null);
    setProfile(null);
  };

  const login = (userData?: { id: string; email: string; username: string }) => {
    if (userData) {
      const mockUser: any = {
        uid: userData.id,
        email: userData.email,
        displayName: userData.username,
        getIdToken: async () => 'mock-token-demo'
      };
      const mockProfile: AppUser = {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        displayName: userData.username,
        avatar: `https://picsum.photos/seed/${userData.username}/200`,
        bio: 'Digital explorer',
        emailVerified: true,
        twoFactorEnabled: false,
        role: 'user',
        isPrivate: false,
        status: 'online',
        ghostModeEnabled: false,
        createdAt: new Date().toISOString()
      };
      setAccessToken('mock-token-demo');
      setUser(mockUser);
      setProfile(mockProfile);
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
