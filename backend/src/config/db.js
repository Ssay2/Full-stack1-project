import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(80) NOT NULL,
      color VARCHAR(20) DEFAULT '#e07a5f',
      UNIQUE(user_id, name)
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE NOT NULL,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      description VARCHAR(255) NOT NULL,
      amount NUMERIC(12, 2) NOT NULL,
      transaction_date DATE NOT NULL,
      type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
}