
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  isPrivate: boolean;
  distance?: number; // in meters
  status: 'online' | 'invisible' | 'away';
  interests?: string[];
  lastSeenLocation?: { lat: number; lng: number };
}

export interface HushNote {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  text: string;
  music?: {
    title: string;
    artist: string;
  };
  timestamp: string;
  expiresAt?: number; // timestamp in ms when note should auto disappear
  selfDestructDuration?: number; // original set duration in seconds
  category?: 'public' | 'nearby' | 'friends';
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  imageUrl: string;
  isSeen: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  timestamp: string;
  type: 'flow';
  bandName?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  mediaType?: 'text' | 'voice' | 'video' | 'one-time-image';
  mediaUrl?: string;
  duration?: number;
  timestamp: string;
  isViewed?: boolean;
}

export type Page = 'launch' | 'initial' | 'welcome' | 'splash' | 'login' | 'signup' | 'loading' | 'home' | 'vista' | 'hush' | 'persona' | 'settings' | 'switch-account' | 'explore' | 'notifications' | 'connections' | 'edit-profile' | 'hush-camera' | 'story-creator' | 'story-viewer';
