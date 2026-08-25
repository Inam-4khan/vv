import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, text, timestamp, real } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  bio: text('bio'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const hush_notes = pgTable('hush_notes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  text: text('text').notNull(),
  lat: real('lat').notNull(),
  lng: real('lng').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  selfDestructDuration: integer('self_destruct_duration').notNull(),
  musicTitle: text('music_title'),
  musicArtist: text('music_artist'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  notes: many(hush_notes),
}));

export const hushNotesRelations = relations(hush_notes, ({ one }) => ({
  author: one(users, {
    fields: [hush_notes.userId],
    references: [users.id],
  }),
}));
