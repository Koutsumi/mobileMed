import { Pool } from 'pg';

// O Pool gerencia várias conexões para você não ter que abrir/fechar toda hora
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const query = (text: string, params?: any[]) => pool.query(text, params);