import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { signInWithPopup, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { User, AuthUser, AppUser } from '../types/auth.types.ts';
import { useToast } from './ToastContext.tsx';

export interface AuthContextType {
  user: any;
  profile: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

let inMemoryAccessToken: string | null = null;
export const getAccessToken = () => inMemoryAccessToken;

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
        inMemoryAccessToken = token;
        
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
        inMemoryAccessToken = null;
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

  const logout = async () => {
    await signOut(auth);
    inMemoryAccessToken = null;
    setUser(null);
    setProfile(null);
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
