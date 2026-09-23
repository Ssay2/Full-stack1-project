import { pool } from '../config/db.js';

export const Category = {
  async listByUser(userId) {
    const { rows } = await pool.query(
      'SELECT id, name, color FROM categories WHERE user_id = $1 ORDER BY name', [userId]
    );
    return rows;
  }
};