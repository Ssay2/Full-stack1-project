import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import SpendingChart from '../Charts/SpendingChart';
import TransactionList from '../TransactionList/TransactionList';
import CsvUpload from '../CsvUpload/CsvUpload';

const sampleTransactions = [
  { id: 'sample-1', description: 'Salary deposit', category: 'Income', amount: 5200, type: 'income', transaction_date: '2026-09-01' },
  { id: 'sample-2', description: 'Apartment rent', category: 'Home', amount: 1800, type: 'expense', transaction_date: '2026-09-02' },
  { id: 'sample-3', description: 'Market groceries', category: 'Food', amount: 86.4, type: 'expense', transaction_date: '2026-09-05' },
  { id: 'sample-4', description: 'Train pass', category: 'Transport', amount: 72, type: 'expense', transaction_date: '2026-09-07' }
];

export default function Dashboard() {
  const { token, name, logout } = useAuth(); const [transactions, setTransactions] = useState([]); const [loading, setLoading] = useState(true); const [error, setError] = useState('');
  async function loadTransactions() { try { setError(''); setTransactions(await api.transactions(token)); } catch (requestError) { setError('API is offline, so you are viewing sample data.'); setTransactions(sampleTransactions); } finally { setLoading(false); } }
  useEffect(() => { loadTransactions(); }, []);
  const income = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
  const balance = income - expenses;
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">L</span><span>ledgerly</span></div><nav><span className="nav-item active"><b>01</b> Overview</span><span className="nav-item"><b>02</b> Transactions</span><span className="nav-item"><b>03</b> Budgets</span></nav><div className="side-note"><span>Monthly focus</span><strong>Build a quieter money life.</strong><div className="side-line"><i style={{ width: '68%' }} /></div><small>68% of your savings goal</small></div><button className="logout" onClick={logout}>Sign out</button></aside>
    <main className="main-content"><header className="topbar"><div><span className="eyebrow">Thursday, September 17, 2026</span><h1>Good morning, {name?.split(' ')[0] || 'there'}.</h1></div><div className="profile-chip"><span>{(name || 'A').slice(0, 1).toUpperCase()}</span><strong>{name || 'Account'}</strong></div></header>
      {error && <div className="notice">{error}</div>}<section className="balance-grid"><div className="balance-card"><span className="eyebrow">Available balance</span><strong>${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong><span className="balance-change">+12.8% <em>vs last month</em></span><div className="balance-spark"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="metric-card"><span className="eyebrow">Income this month</span><strong>${income.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong><span className="metric-foot income">↑ Money in</span></div><div className="metric-card"><span className="eyebrow">Spent this month</span><strong>${expenses.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong><span className="metric-foot expense">↓ Money out</span></div></section>
      <section className="content-grid"><div className="panel chart-panel"><div className="panel-heading"><div><span className="eyebrow">Where it goes</span><h2>Spending by category</h2></div><span className="period">This month</span></div><SpendingChart transactions={transactions} /></div><div className="panel"><div className="panel-heading"><div><span className="eyebrow">Activity</span><h2>Recent transactions</h2></div><button className="text-button">View all</button></div>{loading ? <p className="muted">Loading activity...</p> : <TransactionList transactions={transactions} />}</div></section>
      <CsvUpload onImported={loadTransactions} /><footer>Ledgerly <span>Personal finances, made legible.</span><span className="footer-right">Data stays yours.</span></footer>
    </main></div>;
}