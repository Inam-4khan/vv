import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.ts';

declare global {
  var _postgresPool: pg.Pool | undefined;
}

export const isDbConfigured = Boolean(
  process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_DB_NAME
);

export const createPool = (): pg.Pool | null => {
  if (!isDbConfigured) {
    return null;
  }
  if (!global._postgresPool) {
    global._postgresPool = new pg.Pool({
      host: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASSWORD,
      database: process.env.SQL_DB_NAME,
      max: 10,
      connectionTimeoutMillis: 5000,
    });

    global._postgresPool.on('error', (err) => {
      console.warn('Postgres client error:', err.message);
    });
  }
  return global._postgresPool;
};

let dbInstance: any = null;
try {
  const pool = createPool();
  if (pool) {
    dbInstance = drizzle(pool, { schema });
  }
} catch (error) {
  console.warn('[AI Studio] Database init warning, using fallback store:', error);
}

export const db = dbInstance;
