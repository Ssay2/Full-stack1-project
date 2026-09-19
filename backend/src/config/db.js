const { Pool } = require('pg');
require('dotenv').config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing. Copy .env.example to .env and configure PostgreSQL.');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;