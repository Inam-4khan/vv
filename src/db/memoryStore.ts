export interface InMemoryUser {
  id: number;
  uid: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  createdAt: Date;
}

export interface InMemoryHushNote {
  id: number;
  userId: number;
  text: string;
  lat: number;
  lng: number;
  expiresAt: Date;
  selfDestructDuration: number;
  musicTitle: string | null;
  musicArtist: string | null;
  createdAt: Date;
}

let nextUserId = 10;
let nextNoteId = 10;

const memoryUsers: InMemoryUser[] = [
  {
    id: 1,
    uid: 'mock-uid-alex',
    email: 'alex@vizu.app',
    name: 'Alex Rhythm',
    avatar: 'https://picsum.photos/seed/alex/200',
    bio: 'Music is my soul. Catching the vibe in London.',
    createdAt: new Date(),
  },
  {
    id: 2,
    uid: 'mock-uid-maya',
    email: 'maya@vizu.app',
    name: 'Maya Chen',
    avatar: 'https://picsum.photos/seed/maya/200',
    bio: 'React lover & Coffee addict. Always building something.',
    createdAt: new Date(),
  },
  {
    id: 3,
    uid: 'mock-uid-sam',
    email: 'sam@vizu.app',
    name: 'Sam Visuals',
    avatar: 'https://picsum.photos/seed/sam/200',
    bio: 'Photographer exploring the urban jungle.',
    createdAt: new Date(),
  },
];

const memoryNotes: InMemoryHushNote[] = [
  {
    id: 1,
    userId: 1,
    text: 'Secret rave at the abandoned warehouse near Shoreditch tonight at 11pm. Bring your own headphones for the silent disco!',
    lat: 51.5074,
    lng: -0.1278,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    selfDestructDuration: 86400,
    musicTitle: 'Midnight City',
    musicArtist: 'M83',
    createdAt: new Date(Date.now() - 25 * 60 * 1000),
  },
  {
    id: 2,
    userId: 2,
    text: 'Found an amazing quiet rooftop garden with free wifi and great specialty coffee on 4th floor. Password is on the planter.',
    lat: 51.5080,
    lng: -0.1285,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    selfDestructDuration: 86400,
    musicTitle: 'Coffee & Cigarettes',
    musicArtist: 'Lofi Beats',
    createdAt: new Date(Date.now() - 75 * 60 * 1000),
  },
];

export function getOrCreateMemoryUser(
  uid: string,
  email: string,
  name: string,
  avatar: string = ''
): InMemoryUser {
  const existing = memoryUsers.find((u) => u.uid === uid);
  if (existing) {
    if (email) existing.email = email;
    if (name) existing.name = name;
    if (avatar) existing.avatar = avatar;
    return existing;
  }

  const newUser: InMemoryUser = {
    id: ++nextUserId,
    uid,
    email,
    name: name || 'Explorer',
    avatar: avatar || 'https://picsum.photos/seed/' + uid + '/200',
    bio: null,
    createdAt: new Date(),
  };
  memoryUsers.push(newUser);
  return newUser;
}

export function getMemoryUserByUid(uid: string): InMemoryUser | undefined {
  return memoryUsers.find((u) => u.uid === uid);
}

export function getAllMemoryUsers(): InMemoryUser[] {
  return [...memoryUsers];
}

export function createMemoryNote(
  userId: number,
  text: string,
  lat: number = 0,
  lng: number = 0,
  expiresAt: Date = new Date(Date.now() + 86400000),
  selfDestructDuration: number = 86400,
  musicTitle?: string,
  musicArtist?: string
): InMemoryHushNote {
  const newNote: InMemoryHushNote = {
    id: ++nextNoteId,
    userId,
    text,
    lat,
    lng,
    expiresAt,
    selfDestructDuration,
    musicTitle: musicTitle || null,
    musicArtist: musicArtist || null,
    createdAt: new Date(),
  };
  memoryNotes.unshift(newNote);
  return newNote;
}

export function getMemoryNotesWithAuthors() {
  return memoryNotes.map((note) => {
    const author = memoryUsers.find((u) => u.id === note.userId) || {
      id: note.userId,
      uid: 'unknown',
      name: 'Anonymous Whisperer',
      avatar: 'https://picsum.photos/seed/anon/200',
    };
    return {
      id: note.id,
      text: note.text,
      lat: note.lat,
      lng: note.lng,
      expiresAt: note.expiresAt,
      createdAt: note.createdAt,
      musicTitle: note.musicTitle,
      musicArtist: note.musicArtist,
      userId: author.id,
      userUid: author.uid,
      userName: author.name,
      userAvatar: author.avatar,
    };
  });
}
