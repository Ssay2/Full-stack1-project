import 'dotenv/config';
import app from './src/app.js';
import { initializeDatabase } from './src/config/db.js';

const port = process.env.PORT || 5000;
initializeDatabase()
  .then(() => app.listen(port, () => console.log(`Finance API listening on http://localhost:${port}`)))
  .catch((error) => { console.error('Database initialization failed:', error); process.exit(1); });