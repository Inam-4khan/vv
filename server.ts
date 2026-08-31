import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { requireAuth, AuthRequest } from './src/middleware/auth.ts';
import { getOrCreateUser } from './src/db/users.ts';
import { db, isDbConfigured } from './src/db/index.ts';
import { users, hush_notes } from './src/db/schema.ts';
import { desc, eq } from 'drizzle-orm';
import geminiHandler from './api/gemini.ts';
import {
  getOrCreateMemoryUser,
  getMemoryUserByUid,
  getAllMemoryUsers,
  createMemoryNote,
  getMemoryNotesWithAuthors,
} from './src/db/memoryStore.ts';

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

  // Gemini AI Route
  app.all('/api/gemini', async (req, res) => {
    return geminiHandler(req, res);
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
      if (isDbConfigured && db) {
        try {
          const dbUsers = await db.select().from(users).where(eq(users.uid, req.user!.uid));
          if (dbUsers.length > 0) {
            res.json(dbUsers[0]);
            return;
          }
        } catch (dbErr) {
          console.warn('DB select user failed, checking memory store:', dbErr);
        }
      }
      
      const memUser = getMemoryUserByUid(req.user!.uid) ||
        getOrCreateMemoryUser(
          req.user!.uid,
          req.user!.email || '',
          req.user!.name || 'User',
          req.user!.picture || ''
        );
      res.json(memUser);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch user profile' });
    }
  });
  
  // Get all users (mocking discovery)
  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (isDbConfigured && db) {
        try {
          const allUsers = await db.select().from(users).limit(50);
          if (allUsers.length > 0) {
            res.json(allUsers);
            return;
          }
        } catch (dbErr) {
          console.warn('DB select users failed, checking memory store:', dbErr);
        }
      }
      res.json(getAllMemoryUsers());
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });

  // Create a Hush Note
  app.post('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { text, lat, lng, musicTitle, musicArtist } = req.body;
      const selfDestructDuration = 24 * 60 * 60; // 24h
      const expiresAt = new Date(Date.now() + selfDestructDuration * 1000);

      let createdNote: any = null;

      if (isDbConfigured && db) {
        try {
          const dbUsers = await db.select().from(users).where(eq(users.uid, req.user!.uid));
          if (dbUsers.length > 0) {
            const userId = dbUsers[0].id;
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
            if (result.length > 0) {
              createdNote = result[0];
            }
          }
        } catch (dbErr) {
          console.warn('DB note insert failed, falling back to memory store:', dbErr);
        }
      }

      if (!createdNote) {
        const memUser = getMemoryUserByUid(req.user!.uid) ||
          getOrCreateMemoryUser(
            req.user!.uid,
            req.user!.email || '',
            req.user!.name || 'User',
            req.user!.picture || ''
          );
        createdNote = createMemoryNote(
          memUser.id,
          text,
          lat || 0,
          lng || 0,
          expiresAt,
          selfDestructDuration,
          musicTitle,
          musicArtist
        );
      }
      
      res.status(201).json(createdNote);
    } catch (error: any) {
      console.error('Failed to create note:', error);
      res.status(500).json({ error: 'Failed to create note' });
    }
  });

  // Get Hush Notes
  app.get('/api/notes', requireAuth, async (req: AuthRequest, res) => {
    try {
      if (isDbConfigured && db) {
        try {
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
          
          if (notesWithAuthors.length > 0) {
            res.json(notesWithAuthors);
            return;
          }
        } catch (dbErr) {
          console.warn('DB notes select failed, using memory store:', dbErr);
        }
      }
      
      res.json(getMemoryNotesWithAuthors());
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
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
