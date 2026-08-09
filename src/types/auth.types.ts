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

