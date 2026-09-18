const pool = require('../config/db');

async function getCategories(req, res) {
  try {
    const result = await pool.query(
      'SELECT * FROM categories WHERE user_id = $1 ORDER BY name',
      [req.userId]
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Get categories error:', err);
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
}

async function createCategory(req, res) {
  try {
    const { name, monthly_budget } = req.body;
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const result = await pool.query(
      `INSERT INTO categories (user_id, name, monthly_budget)
       VALUES ($1, $2, $3) RETURNING *`,
      [req.userId, name.trim(), monthly_budget || null]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create category error:', err);
    return res.status(500).json({ error: 'Failed to create category' });
  }
}

async function updateBudget(req, res) {
  try {
    const result = await pool.query(
      `UPDATE categories SET monthly_budget = $1
       WHERE id = $2 AND user_id = $3 RETURNING *`,
      [req.body.monthly_budget, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Category not found' });
    return res.json(result.rows[0]);
  } catch (err) {
    console.error('Update budget error:', err);
    return res.status(500).json({ error: 'Failed to update budget' });
  }
}

async function getBudgetSummary(req, res) {
  try {
    const result = await pool.query(
      `SELECT c.id, c.name, c.monthly_budget,
              COALESCE(SUM(ABS(t.amount)), 0) AS actual_spent
       FROM categories c
       LEFT JOIN transactions t ON t.category_id = c.id
         AND t.user_id = c.user_id
         AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
       WHERE c.user_id = $1
       GROUP BY c.id, c.name, c.monthly_budget
       ORDER BY c.name`,
      [req.userId]
    );

    return res.json(result.rows.map((row) => {
      const actualSpent = Number(row.actual_spent);
      const monthlyBudget = row.monthly_budget === null ? null : Number(row.monthly_budget);
      return { ...row, actual_spent: actualSpent, monthly_budget: monthlyBudget, over_budget: monthlyBudget !== null && actualSpent > monthlyBudget };
    }));
  } catch (err) {
    console.error('Budget summary error:', err);
    return res.status(500).json({ error: 'Failed to fetch budget summary' });
  }
}

module.exports = { getCategories, createCategory, updateBudget, getBudgetSummary };