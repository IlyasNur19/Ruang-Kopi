/// <reference types="node" />
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Use session pooler (port 5432) for Drizzle Studio — supports prepared statements & persistent connections.
// Falls back to DATABASE_URL (transaction pooler, port 6543) if DATABASE_URL_STUDIO is not set.
const dbUrl = process.env.DATABASE_URL_STUDIO || process.env.DATABASE_URL!;

export default defineConfig({
    schema: './src/db/schema.ts',
    out: './drizzle',
    dialect: 'postgresql',
    dbCredentials: {
        url: dbUrl,
    },
});
