const pool = require('../config/db');
const { parseCsvBuffer } = require('../utils/csvParser');

async function getTransactions(req, res) {
  try {
    const result = await pool.query(
      `SELECT t.*, c.name AS category_name
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC`,
      [req.userId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Get transactions error:', err);
    return res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}

async function createTransaction(req, res) {
  try {
    const { description, amount, transaction_date, category_id } = req.body;

    if (!description || amount === undefined || !transaction_date) {
      return res.status(400).json({ error: 'description, amount, and transaction_date are required' });
    }

    const result = await pool.query(
      `INSERT INTO transactions (user_id, description, amount, transaction_date, category_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [req.userId, description, amount, transaction_date, category_id || null]
    );

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create transaction error:', err);
    return res.status(500).json({ error: 'Failed to create transaction' });
  }
}

async function updateTransactionCategory(req, res) {
  try {
    const { id } = req.params;
    const { category_id } = req.body;
    const result = await pool.query(
      `UPDATE transactions SET category_id = $1
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [category_id || null, id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Update transaction error:', err);
    return res.status(500).json({ error: 'Failed to update transaction' });
  }
}

async function deleteTransaction(req, res) {
  try {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    return res.json({ deleted: true });
  } catch (err) {
    console.error('Delete transaction error:', err);
    return res.status(500).json({ error: 'Failed to delete transaction' });
  }
}

async function uploadCsv(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const parsed = await parseCsvBuffer(req.file.buffer);
    if (parsed.length === 0) {
      return res.status(400).json({ error: 'No valid transactions found in file' });
    }

    const inserted = [];
    for (const row of parsed) {
      const result = await pool.query(
        `INSERT INTO transactions (user_id, description, amount, transaction_date)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.userId, row.description, row.amount, row.transaction_date]
      );
      inserted.push({ ...result.rows[0], suggestedCategory: row.suggestedCategory });
    }

    return res.status(201).json({ count: inserted.length, transactions: inserted });
  } catch (err) {
    console.error('CSV upload error:', err);
    return res.status(500).json({ error: 'Failed to process CSV file' });
  }
}

module.exports = {
  getTransactions,
  createTransaction,
  updateTransactionCategory,
  deleteTransaction,
  uploadCsv,
};