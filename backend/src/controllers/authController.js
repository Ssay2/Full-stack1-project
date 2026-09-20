const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const SALT_ROUNDS = 12;

function createToken(user) {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }

  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [normalizedEmail]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with that email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name.trim(), normalizedEmail, passwordHash]
    );
    const user = result.rows[0];

    return res.status(201).json({ user, token: createToken(user) });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Something went wrong during signup' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const result = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email.trim().toLowerCase()]
    );
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    return res.json({
      user: { id: user.id, email: user.email },
      token: createToken(user),
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Something went wrong during login' });
  }
}

async function demo(req, res) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const passwordHash = await bcrypt.hash(`ledgerly-demo-${process.env.JWT_SECRET}`, SALT_ROUNDS);
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, email`,
      ['Demo User', 'demo@ledgerly.local', passwordHash]
    );
    const user = userResult.rows[0];
    const categoryIds = {};
    for (const [name, budget] of [['Housing', 1800], ['Food & Drink', 500], ['Transport', 250], ['Subscriptions', 100]]) {
      const categoryResult = await client.query(
        `INSERT INTO categories (user_id, name, monthly_budget)
         SELECT $1, $2::varchar, $3
         WHERE NOT EXISTS (SELECT 1 FROM categories WHERE user_id = $1 AND name = $2::varchar)
         RETURNING id`,
        [user.id, name, budget]
      );
      if (categoryResult.rows[0]) categoryIds[name] = categoryResult.rows[0].id;
      else categoryIds[name] = (await client.query('SELECT id FROM categories WHERE user_id = $1 AND name = $2', [user.id, name])).rows[0].id;
    }
    const existingTransactions = await client.query('SELECT 1 FROM transactions WHERE user_id = $1 LIMIT 1', [user.id]);
    if (existingTransactions.rows.length === 0) {
      const transactions = [
        ['Apartment rent', 1800, 'Housing'],
        ['Grocery market', 86.40, 'Food & Drink'],
        ['Train pass', 72, 'Transport'],
        ['Streaming subscription', 18.99, 'Subscriptions'],
        ['Coffee shop', 5.75, 'Food & Drink'],
      ];
      for (const [description, amount, category] of transactions) {
        await client.query(
          `INSERT INTO transactions (user_id, description, amount, transaction_date, category_id, type)
           VALUES ($1, $2, $3, CURRENT_DATE, $4, $5)`,
          [user.id, description, amount, categoryIds[category], 'expense']
        );
      }
    }
    await client.query('COMMIT');
    return res.json({ user, token: createToken(user), demo: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Demo account error:', err);
    return res.status(500).json({ error: 'Could not start demo account' });
  } finally {
    client.release();
  }
}

module.exports = { signup, login, demo };
