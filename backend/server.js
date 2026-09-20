require('dotenv').config();

const app = require('./src/app');
const pool = require('./src/config/db');

const port = process.env.PORT || 5000;

async function start() {
  try {
    await pool.initializeDatabase();
    app.listen(port, () => {
      console.log(`Finance API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exitCode = 1;
  }
}

start();