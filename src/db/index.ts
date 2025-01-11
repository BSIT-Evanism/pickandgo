import { DATABASE_URL } from 'astro:env/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import * as schema from './schema';

const { Pool } = pkg;

const sql = new Pool({
    connectionString: DATABASE_URL,
});
const db = drizzle({ client: sql, schema });

export { db };
