import { db, isDbConfigured } from './index.ts';
import { users } from './schema.ts';
import { getOrCreateMemoryUser } from './memoryStore.ts';

export async function getOrCreateUser(uid: string, email: string, name: string, avatar: string = '') {
  if (isDbConfigured && db) {
    try {
      const result = await db.insert(users)
        .values({ uid, email, name, avatar })
        .onConflictDoUpdate({
          target: users.uid,
          set: { email, name, avatar },
        })
        .returning();
      if (result && result.length > 0) {
        return result[0];
      }
    } catch (error) {
      console.warn("Database query failed, falling back to memory store:", error);
    }
  }
  return getOrCreateMemoryUser(uid, email, name, avatar);
}
