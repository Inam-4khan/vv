import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { db } from './src/db/index.ts';
import { users, hush_notes } from './src/db/schema.ts';
import { desc, eq, and, sql } from 'drizzle-orm';

async function startServer() {
  const app = express();
  const PORT = 3000;

  const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Auth sync endpoint (called after Google login)
  app.post('/api/auth/sync', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { uid, email, name, picture } = req.user!;
      const user = await getOrCreateUser(uid, email || '', name || 'User', picture || '');
      res.json(user);
    } catch (error: any) {
      console.error('Failed to sync user:', error);
      res.status(500).json({ error: error.message || 'Failed to sync user' });
    }
  });

  // Get current user profile
  app.get('/api/users/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUsers = await db.select().from(users).where(eq(users.uid, req.user!.uid));
      if (dbUsers.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(dbUsers[0]);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });
  
  // Get all users (mocking discovery)
  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allUsers = await db.select().from(users).limit(50);
      res.json(allUsers);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Create a Hush Note
  app.post('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUsers = await db.select().from(users).where(eq(users.uid, req.user!.uid));
      if (dbUsers.length === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      const userId = dbUsers[0].id;
      
      const { text, lat, lng, musicTitle, musicArtist } = req.body;
      const selfDestructDuration = 24 * 60 * 60; // 24h
      
      const expiresAt = new Date(Date.now() + selfDestructDuration * 1000);
      
      const result = await db.insert(hush_notes).values({
        userId,
        text,
        lat: lat || 0,
        lng: lng || 0,
        expiresAt,
        selfDestructDuration,
        musicTitle: musicTitle || null,
        musicArtist: musicArtist || null,
      }).returning();
      
      res.status(201).json(result[0]);
    } catch (error: any) {
      console.error('Failed to create note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  });

  // Get Hush Notes
  app.get('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      // Return notes with author information
      const notesWithAuthors = await db
        .select({
          id: hush_notes.id,
          text: hush_notes.text,
          lat: hush_notes.lat,
          lng: hush_notes.lng,
          expiresAt: hush_notes.expiresAt,
          createdAt: hush_notes.createdAt,
          musicTitle: hush_notes.musicTitle,
          musicArtist: hush_notes.musicArtist,
          userId: users.id,
          userUid: users.uid,
          userName: users.name,
          userAvatar: users.avatar,
        })
        .from(hush_notes)
        .innerJoin(users, eq(hush_notes.userId, users.id))
        .orderBy(desc(hush_notes.createdAt))
        .limit(50);
        
      res.json(notesWithAuthors);
    } catch (error: any) {
      console.error('Failed to fetch notes:', error);
      res.status(500).json({ error: 'Failed to fetch notes' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
