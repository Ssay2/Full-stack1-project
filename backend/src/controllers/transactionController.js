import { Transaction } from '../models/Transaction.js';

export async function getTransactions(req, res) {
  res.json(await Transaction.listByUser(req.user.id));
}

export async function createTransaction(req, res) {
  const { description, amount, date, type } = req.body;
  if (!description || !amount || !date || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'Description, amount, date, and type are required' });
  }
  res.status(201).json(await Transaction.create(req.user.id, { description, amount, date, type }));
}