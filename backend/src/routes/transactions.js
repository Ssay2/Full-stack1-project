import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { createTransaction, getTransactions } from '../controllers/transactionController.js';
import { parseTransactionsCsv } from '../utils/csvParser.js';
import { Transaction } from '../models/Transaction.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 2 * 1024 * 1024 } });
router.use(requireAuth);
router.get('/', getTransactions);
router.post('/', createTransaction);
router.post('/import', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'CSV file is required' });
  const transactions = parseTransactionsCsv(req.file.buffer.toString('utf8'));
  for (const transaction of transactions) await Transaction.create(req.user.id, transaction);
  res.status(201).json({ imported: transactions.length });
});
export default router;