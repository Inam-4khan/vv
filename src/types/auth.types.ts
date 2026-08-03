export interface AuthUser {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  role: 'user' | 'admin' | 'moderator';
  createdAt: string;
}

export interface AppUser extends AuthUser {
  displayName: string;
  avatar: string;
  bio: string;
  isPrivate: boolean;
  status: 'online' | 'invisible' | 'away';
  interests?: string[];
  ghostModeEnabled: boolean;
  proximityMeters?: number;
}

export interface TokenPair {
  accessToken: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  profile: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken?: () => Promise<boolean>;
  verifyEmail?: (code: string) => Promise<void>;
  setupTwoFactor?: () => Promise<{ qrCodeUrl: string; secret: string }>;
  verifyTwoFactor?: (code: string) => Promise<void>;
}
