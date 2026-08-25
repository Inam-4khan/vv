import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name: string, avatar: string = '') {
  try {
    const result = await db.insert(users)
      .values({ uid, email, name, avatar })
      .onConflictDoUpdate({
        target: users.uid,
        set: { email, name, avatar },
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Failed to get or create user.", { cause: error });
  }
}
