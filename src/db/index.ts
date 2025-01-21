import { DATABASE_URL } from 'astro:env/server';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';


const sqlClient = postgres(DATABASE_URL);

const db = drizzle({ client: sqlClient, schema });

export { db, sqlClient };


