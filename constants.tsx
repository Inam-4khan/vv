
import { User, Post, HushNote, Story } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'alex_rhythm',
    displayName: 'Alex Rhythm',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Music is my soul. Catching the vibe in London.',
    isPrivate: false,
    distance: 12,
    status: 'online',
    interests: ['Techno', 'Cycling', 'Vinyl'],
    lastSeenLocation: { lat: 51.5074, lng: -0.1278 }
  },
  {
    id: '2',
    username: 'maya_codes',
    displayName: 'Maya Chen',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    bio: 'React lover & Coffee addict. Always building something.',
    isPrivate: true,
    distance: 45,
    status: 'online',
    interests: ['AI', 'Bouldering', 'Matcha'],
    lastSeenLocation: { lat: 51.5080, lng: -0.1285 }
  },
  {
    id: '3',
    username: 'sam_vista',
    displayName: 'Sam Visuals',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    bio: 'Photographer exploring the urban jungle.',
    isPrivate: false,
    distance: 89,
    status: 'away',
    interests: ['Analog', 'Travel', 'Street Art'],
    lastSeenLocation: { lat: 51.5065, lng: -0.1260 }
  },
  {
    id: '4',
    username: 'elena_vance',
    displayName: 'Elena Vance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    bio: 'Spatial audio engineer & soundscape designer.',
    isPrivate: false,
    distance: 120,
    status: 'online',
    interests: ['Synthesizers', 'Ambient', 'Design'],
    lastSeenLocation: { lat: 51.5090, lng: -0.1290 }
  },
  {
    id: '5',
    username: 'marcus_w',
    displayName: 'Marcus Wright',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Architectural minimalism & street culture.',
    isPrivate: false,
    distance: 240,
    status: 'offline',
    interests: ['Architecture', 'Skate', 'Photography'],
    lastSeenLocation: { lat: 51.5045, lng: -0.1220 }
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    userId: '1',
    username: 'alex_rhythm',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    isSeen: false,
  },
  {
    id: 's2',
    userId: '2',
    username: 'maya_codes',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
    isSeen: false,
  },
  {
    id: 's3',
    userId: '3',
    username: 'sam_vista',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    isSeen: false,
  },
  {
    id: 's4',
    userId: '4',
    username: 'elena_vance',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    isSeen: true,
  }
];

export const MOCK_HUSH_NOTES: HushNote[] = [
  {
    id: 'n1',
    userId: '1',
    username: 'alex_rhythm',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    text: 'Vibing to this new mix...',
    music: { title: 'Midnight City', artist: 'M83' },
    timestamp: '10m ago'
  },
  {
    id: 'n2',
    userId: '2',
    username: 'maya_codes',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    text: 'Deep work mode 💻',
    music: { title: 'Lofi Study', artist: 'Chillhop' },
    timestamp: '1h ago'
  },
  {
    id: 'n3',
    userId: '3',
    username: 'sam_vista',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    text: 'Golden hour is coming! 🌅',
    timestamp: '2h ago'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: '1',
    username: 'alex_rhythm',
    content: 'Just finished a new live set! The rhythm was electric tonight in Shoreditch.',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    likes: 234,
    comments: 12,
    timestamp: '2h ago',
    type: 'flow',
    bandName: 'The Neon Pulse'
  },
  {
    id: 'p2',
    userId: '2',
    username: 'maya_codes',
    content: 'New ambient setup ready for late night coding sessions. Clean lines, zero noise.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    likes: 180,
    comments: 15,
    timestamp: '4h ago',
    type: 'flow',
    bandName: 'Binary Beats'
  },
  {
    id: 'p3',
    userId: '3',
    username: 'sam_vista',
    content: 'Sunset over the metropolitan ridge. Capturing real-world proximity light.',
    image: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
    likes: 312,
    comments: 24,
    timestamp: '6h ago',
    type: 'flow',
    bandName: 'Vibe Seekers'
  }
];

export const SPLASH_SCREENS = [
  {
    title: "Flow",
    subtitle: "(home scroll page)",
    text: "Find your rhythm in the Flow—where the best content lives.",
    color: "var(--app-primary)"
  },
  {
    title: "Zaps",
    subtitle: "(short video)",
    text: "Feel the energy. Catch quick moments in Zaps.",
    color: "#20878E"
  },
  {
    title: "Vista",
    subtitle: "(camera function)",
    text: "See clearly. Capture your world through Vista.",
    color: "var(--app-primary)"
  },
  {
    title: "Hush",
    subtitle: "(chats)",
    text: "Keep it private. Start a quiet conversation in Hush.",
    color: "#20878E"
  },
  {
    title: "Persona",
    subtitle: "(profile)",
    text: "Be yourself. Polish your Persona for the world to see.",
    color: "var(--app-primary)"
  }
];
