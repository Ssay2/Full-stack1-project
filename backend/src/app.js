import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes from './routes/budgets.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use(errorHandler);
export default app;