"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");

// src/lib/firebase-admin.ts
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");
var adminAuthInstance = null;
var getAdminAuth = () => {
  if (!adminAuthInstance) {
    if (!(0, import_app.getApps)().length) {
      (0, import_app.initializeApp)({
        projectId: process.env.FIREBASE_PROJECT_ID || "atlantean-genre-8t8c4"
      });
    }
    adminAuthInstance = (0, import_auth.getAuth)();
  }
  return adminAuthInstance;
};
var adminAuth = {
  verifyIdToken: async (token) => {
    return getAdminAuth().verifyIdToken(token);
  }
};

// src/middleware/auth.ts
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized: Missing token" });
    return;
  }
  const token = authHeader.split("Bearer ")[1];
  if (token === "mock-token-demo" || token.startsWith("demo-")) {
    req.user = {
      uid: "demo-user-123",
      email: "demo@vizu.social",
      name: "Demo Explorer",
      picture: "https://picsum.photos/seed/demo/200",
      aud: "demo",
      auth_time: Math.floor(Date.now() / 1e3),
      exp: Math.floor(Date.now() / 1e3) + 3600,
      firebase: { identities: {}, sign_in_provider: "custom" },
      iat: Math.floor(Date.now() / 1e3),
      iss: "demo",
      sub: "demo-user-123"
    };
    next();
    return;
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    res.status(401).json({ error: "Unauthorized: Invalid token" });
    return;
  }
};

// src/db/index.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = __toESM(require("pg"), 1);

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  hushNotesRelations: () => hushNotesRelations,
  hush_notes: () => hush_notes,
  users: () => users,
  usersRelations: () => usersRelations
});
var import_drizzle_orm = require("drizzle-orm");
var import_pg_core = require("drizzle-orm/pg-core");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  uid: (0, import_pg_core.text)("uid").notNull().unique(),
  // Firebase Auth UID
  email: (0, import_pg_core.text)("email").notNull(),
  name: (0, import_pg_core.text)("name").notNull(),
  avatar: (0, import_pg_core.text)("avatar"),
  bio: (0, import_pg_core.text)("bio"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var hush_notes = (0, import_pg_core.pgTable)("hush_notes", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.integer)("user_id").references(() => users.id).notNull(),
  text: (0, import_pg_core.text)("text").notNull(),
  lat: (0, import_pg_core.real)("lat").notNull(),
  lng: (0, import_pg_core.real)("lng").notNull(),
  expiresAt: (0, import_pg_core.timestamp)("expires_at").notNull(),
  selfDestructDuration: (0, import_pg_core.integer)("self_destruct_duration").notNull(),
  musicTitle: (0, import_pg_core.text)("music_title"),
  musicArtist: (0, import_pg_core.text)("music_artist"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var usersRelations = (0, import_drizzle_orm.relations)(users, ({ many }) => ({
  notes: many(hush_notes)
}));
var hushNotesRelations = (0, import_drizzle_orm.relations)(hush_notes, ({ one }) => ({
  author: one(users, {
    fields: [hush_notes.userId],
    references: [users.id]
  })
}));

// src/db/index.ts
var isDbConfigured = Boolean(
  process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME
);
var createPool = () => {
  if (!isDbConfigured) {
    return null;
  }
  if (!global._postgresPool) {
    global._postgresPool = new import_pg.default.Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 5e3
    });
    global._postgresPool.on("error", (err) => {
      console.warn("Postgres client error:", err.message);
    });
  }
  return global._postgresPool;
};
var dbInstance = null;
try {
  const pool = createPool();
  if (pool) {
    dbInstance = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });
  }
} catch (error) {
  console.warn("[AI Studio] Database init warning, using fallback store:", error);
}
var db = dbInstance;

// src/db/memoryStore.ts
var nextUserId = 10;
var nextNoteId = 10;
var memoryUsers = [
  {
    id: 1,
    uid: "mock-uid-alex",
    email: "alex@vizu.app",
    name: "Alex Rhythm",
    avatar: "https://picsum.photos/seed/alex/200",
    bio: "Music is my soul. Catching the vibe in London.",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: 2,
    uid: "mock-uid-maya",
    email: "maya@vizu.app",
    name: "Maya Chen",
    avatar: "https://picsum.photos/seed/maya/200",
    bio: "React lover & Coffee addict. Always building something.",
    createdAt: /* @__PURE__ */ new Date()
  },
  {
    id: 3,
    uid: "mock-uid-sam",
    email: "sam@vizu.app",
    name: "Sam Visuals",
    avatar: "https://picsum.photos/seed/sam/200",
    bio: "Photographer exploring the urban jungle.",
    createdAt: /* @__PURE__ */ new Date()
  }
];
var memoryNotes = [
  {
    id: 1,
    userId: 1,
    text: "Secret rave at the abandoned warehouse near Shoreditch tonight at 11pm. Bring your own headphones for the silent disco!",
    lat: 51.5074,
    lng: -0.1278,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3),
    selfDestructDuration: 86400,
    musicTitle: "Midnight City",
    musicArtist: "M83",
    createdAt: new Date(Date.now() - 25 * 60 * 1e3)
  },
  {
    id: 2,
    userId: 2,
    text: "Found an amazing quiet rooftop garden with free wifi and great specialty coffee on 4th floor. Password is on the planter.",
    lat: 51.508,
    lng: -0.1285,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1e3),
    selfDestructDuration: 86400,
    musicTitle: "Coffee & Cigarettes",
    musicArtist: "Lofi Beats",
    createdAt: new Date(Date.now() - 75 * 60 * 1e3)
  }
];
function getOrCreateMemoryUser(uid, email, name, avatar = "") {
  const existing = memoryUsers.find((u) => u.uid === uid);
  if (existing) {
    if (email) existing.email = email;
    if (name) existing.name = name;
    if (avatar) existing.avatar = avatar;
    return existing;
  }
  const newUser = {
    id: ++nextUserId,
    uid,
    email,
    name: name || "Explorer",
    avatar: avatar || "https://picsum.photos/seed/" + uid + "/200",
    bio: null,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryUsers.push(newUser);
  return newUser;
}
function getMemoryUserByUid(uid) {
  return memoryUsers.find((u) => u.uid === uid);
}
function getAllMemoryUsers() {
  return [...memoryUsers];
}
function createMemoryNote(userId, text2, lat = 0, lng = 0, expiresAt = new Date(Date.now() + 864e5), selfDestructDuration = 86400, musicTitle, musicArtist) {
  const newNote = {
    id: ++nextNoteId,
    userId,
    text: text2,
    lat,
    lng,
    expiresAt,
    selfDestructDuration,
    musicTitle: musicTitle || null,
    musicArtist: musicArtist || null,
    createdAt: /* @__PURE__ */ new Date()
  };
  memoryNotes.unshift(newNote);
  return newNote;
}
function getMemoryNotesWithAuthors() {
  return memoryNotes.map((note) => {
    const author = memoryUsers.find((u) => u.id === note.userId) || {
      id: note.userId,
      uid: "unknown",
      name: "Anonymous Whisperer",
      avatar: "https://picsum.photos/seed/anon/200"
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
      userAvatar: author.avatar
    };
  });
}

// src/db/users.ts
async function getOrCreateUser(uid, email, name, avatar = "") {
  if (isDbConfigured && db) {
    try {
      const result = await db.insert(users).values({ uid, email, name, avatar }).onConflictDoUpdate({
        target: users.uid,
        set: { email, name, avatar }
      }).returning();
      if (result && result.length > 0) {
        return result[0];
      }
    } catch (error) {
      console.warn("Database query failed, falling back to memory store:", error);
    }
  }
  return getOrCreateMemoryUser(uid, email, name, avatar);
}

// server.ts
var import_drizzle_orm2 = require("drizzle-orm");

// api/gemini.ts
var import_genai = require("@google/genai");
async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {
      }
    }
    const { prompt, model } = body || {};
    if (!prompt || typeof prompt !== "string" || prompt.trim() === "") {
      return res.status(400).json({ error: "Prompt is required and cannot be empty" });
    }
    if (prompt.length > 2e3) {
      return res.status(400).json({ error: "Prompt exceeds maximum allowed length of 2000 characters" });
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }
    const ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    const selectedModel = model || "gemini-flash-latest";
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: prompt
    });
    const text2 = response.text ?? "";
    return res.status(200).json({ text: text2 });
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate content via Gemini API"
    });
  }
}

// server.ts
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true
  };
  app.use((0, import_cors.default)(corsOptions));
  app.use(import_express.default.json());
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.all("/api/gemini", async (req, res) => {
    return handler(req, res);
  });
  app.post("/api/auth/sync", requireAuth, async (req, res) => {
    try {
      const { uid, email, name, picture } = req.user;
      const user = await getOrCreateUser(uid, email || "", name || "User", picture || "");
      res.json(user);
    } catch (error) {
      console.error("Failed to sync user:", error);
      res.status(500).json({ error: error.message || "Failed to sync user" });
    }
  });
  app.get("/api/users/me", requireAuth, async (req, res) => {
    try {
      if (isDbConfigured && db) {
        try {
          const dbUsers = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.uid, req.user.uid));
          if (dbUsers.length > 0) {
            res.json(dbUsers[0]);
            return;
          }
        } catch (dbErr) {
          console.warn("DB select user failed, checking memory store:", dbErr);
        }
      }
      const memUser = getMemoryUserByUid(req.user.uid) || getOrCreateMemoryUser(
        req.user.uid,
        req.user.email || "",
        req.user.name || "User",
        req.user.picture || ""
      );
      res.json(memUser);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });
  app.get("/api/users", requireAuth, async (req, res) => {
    try {
      if (isDbConfigured && db) {
        try {
          const allUsers = await db.select().from(users).limit(50);
          if (allUsers.length > 0) {
            res.json(allUsers);
            return;
          }
        } catch (dbErr) {
          console.warn("DB select users failed, checking memory store:", dbErr);
        }
      }
      res.json(getAllMemoryUsers());
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app.post("/api/notes", requireAuth, async (req, res) => {
    try {
      const { text: text2, lat, lng, musicTitle, musicArtist } = req.body;
      const selfDestructDuration = 24 * 60 * 60;
      const expiresAt = new Date(Date.now() + selfDestructDuration * 1e3);
      let createdNote = null;
      if (isDbConfigured && db) {
        try {
          const dbUsers = await db.select().from(users).where((0, import_drizzle_orm2.eq)(users.uid, req.user.uid));
          if (dbUsers.length > 0) {
            const userId = dbUsers[0].id;
            const result = await db.insert(hush_notes).values({
              userId,
              text: text2,
              lat: lat || 0,
              lng: lng || 0,
              expiresAt,
              selfDestructDuration,
              musicTitle: musicTitle || null,
              musicArtist: musicArtist || null
            }).returning();
            if (result.length > 0) {
              createdNote = result[0];
            }
          }
        } catch (dbErr) {
          console.warn("DB note insert failed, falling back to memory store:", dbErr);
        }
      }
      if (!createdNote) {
        const memUser = getMemoryUserByUid(req.user.uid) || getOrCreateMemoryUser(
          req.user.uid,
          req.user.email || "",
          req.user.name || "User",
          req.user.picture || ""
        );
        createdNote = createMemoryNote(
          memUser.id,
          text2,
          lat || 0,
          lng || 0,
          expiresAt,
          selfDestructDuration,
          musicTitle,
          musicArtist
        );
      }
      res.status(201).json(createdNote);
    } catch (error) {
      console.error("Failed to create note:", error);
      res.status(500).json({ error: "Failed to create note" });
    }
  });
  app.get("/api/notes", requireAuth, async (req, res) => {
    try {
      if (isDbConfigured && db) {
        try {
          const notesWithAuthors = await db.select({
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
            userAvatar: users.avatar
          }).from(hush_notes).innerJoin(users, (0, import_drizzle_orm2.eq)(hush_notes.userId, users.id)).orderBy((0, import_drizzle_orm2.desc)(hush_notes.createdAt)).limit(50);
          if (notesWithAuthors.length > 0) {
            res.json(notesWithAuthors);
            return;
          }
        } catch (dbErr) {
          console.warn("DB notes select failed, using memory store:", dbErr);
        }
      }
      res.json(getMemoryNotesWithAuthors());
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      res.status(500).json({ error: "Failed to fetch notes" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
