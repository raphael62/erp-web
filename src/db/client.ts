// src/db/client.ts
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Use a single client for the whole app (Node runtime)
const queryClient = postgres(process.env.DATABASE_URL!, {
  // Neon uses SSL via the query string (?sslmode=require)
  prepare: false, // important for serverless compatibility
});

export const db = drizzle(queryClient);
