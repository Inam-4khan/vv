
import { User, Post, HushNote, Story } from './types';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'alex_rhythm',
    displayName: 'Alex Rhythm',
    avatar: 'https://picsum.photos/seed/alex/200',
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
    avatar: 'https://picsum.photos/seed/maya/200',
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
    avatar: 'https://picsum.photos/seed/sam/200',
    bio: 'Photographer exploring the urban jungle.',
    isPrivate: false,
    distance: 89,
    status: 'away',
    interests: ['Analog', 'Travel', 'Street Art'],
    lastSeenLocation: { lat: 51.5065, lng: -0.1260 }
  }
];

export const MOCK_STORIES: Story[] = [
  {
    id: 's1',
    userId: '1',
    username: 'alex_rhythm',
    avatar: 'https://picsum.photos/seed/alex/100',
    imageUrl: 'https://picsum.photos/seed/s1/400/700',
    isSeen: false,
  },
  {
    id: 's2',
    userId: '2',
    username: 'maya_codes',
    avatar: 'https://picsum.photos/seed/maya/100',
    imageUrl: 'https://picsum.photos/seed/s2/400/700',
    isSeen: false,
  },
  {
    id: 's3',
    userId: '3',
    username: 'sam_vista',
    avatar: 'https://picsum.photos/seed/sam/100',
    imageUrl: 'https://picsum.photos/seed/s3/400/700',
    isSeen: true,
  }
];

export const MOCK_HUSH_NOTES: HushNote[] = [
  {
    id: 'n1',
    userId: '1',
    username: 'alex_rhythm',
    avatar: 'https://picsum.photos/seed/alex/200',
    text: 'Vibing to this new mix...',
    music: { title: 'Midnight City', artist: 'M83' },
    timestamp: '10m ago'
  },
  {
    id: 'n2',
    userId: '2',
    username: 'maya_codes',
    avatar: 'https://picsum.photos/seed/maya/200',
    text: 'Deep work mode 💻',
    music: { title: 'Lofi Study', artist: 'Chillhop' },
    timestamp: '1h ago'
  },
  {
    id: 'n3',
    userId: '3',
    username: 'sam_vista',
    avatar: 'https://picsum.photos/seed/sam/200',
    text: 'Golden hour is coming!',
    timestamp: '2h ago'
  }
];

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: '1',
    username: 'alex_rhythm',
    content: 'Just finished a new track! The rhythm is infectious.',
    image: 'https://picsum.photos/seed/post1/600/400',
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
    content: 'New setup, who dis?',
    image: 'https://picsum.photos/seed/post2/600/400',
    likes: 120,
    comments: 5,
    timestamp: '4h ago',
    type: 'flow',
    bandName: 'Binary Beats'
  }
];

export const SPLASH_SCREENS = [
  {
    title: "Flow",
    subtitle: "(home scroll page)",
    text: "Find your rhythm in the Flow—where the best content lives.",
    color: "#062B34"
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
    color: "#062B34"
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
    color: "#062B34"
  }
];
