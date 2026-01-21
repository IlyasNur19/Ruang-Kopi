import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

// Disable prefetch for Supabase Transaction pool mode
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

// Create Drizzle ORM instance
export const db = drizzle(client, { schema });

export default db;
