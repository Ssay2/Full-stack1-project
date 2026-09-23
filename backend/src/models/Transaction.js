import { pool } from '../config/db.js';

export const Transaction = {
  async listByUser(userId) {
    const { rows } = await pool.query(`
      SELECT t.id, t.description, t.amount, t.transaction_date, t.type,
             COALESCE(c.name, 'Uncategorized') AS category, COALESCE(c.color, '#9b9b9b') AS color
      FROM transactions t LEFT JOIN categories c ON c.id = t.category_id
      WHERE t.user_id = $1 ORDER BY t.transaction_date DESC, t.id DESC
    `, [userId]);
    return rows;
  },
  async create(userId, transaction) {
    const { rows } = await pool.query(`
      INSERT INTO transactions (user_id, description, amount, transaction_date, type)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [userId, transaction.description, transaction.amount, transaction.date, transaction.type]);
    return rows[0];
  }
};