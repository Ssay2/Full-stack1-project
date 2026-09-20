import { useEffect, useMemo, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import BudgetSummary from '../components/BudgetSummary';

const COLORS = ['#e7785e', '#657058', '#d7a24b', '#8f9c91', '#b8a9a0', '#6e8294'];

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { user, logout } = useAuth();

  async function fetchTransactions() {
    try {
      const { data } = await client.get('/transactions');
      setTransactions(data);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Could not load transactions');
    }
  }

  useEffect(() => { fetchTransactions(); }, []);

  async function handleUpload(event) {
    event.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    setError('');
    try {
      await client.post('/transactions/upload', formData);
      setFile(null);
      event.target.reset();
      await fetchTransactions();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  const totals = transactions.reduce((result, transaction) => {
    const category = transaction.category_name || 'Uncategorized';
    result[category] = (result[category] || 0) + Math.abs(Number(transaction.amount));
    return result;
  }, {});
  const chartData = Object.entries(totals).map(([name, value]) => ({ name, value }));
  const spent = transactions.reduce((sum, transaction) => sum + Math.abs(Number(transaction.amount)), 0);
  const categories = [...new Set(transactions.map((transaction) => transaction.category_name || 'Uncategorized'))].sort();
  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return transactions.filter((transaction) => {
      const category = transaction.category_name || 'Uncategorized';
      const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
      const matchesSearch = !normalizedSearch || `${transaction.description} ${category}`.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, search, transactions]);

  return <div className="dashboard">
    <aside className="dashboard-nav"><span className="brand"><span className="brand-mark">L</span> ledgerly</span><nav><span className="nav-active">01 <b>Overview</b></span><span>02 <b>Transactions</b></span><span>03 <b>Budgets</b></span></nav><div className="nav-footer"><span>Signed in as</span><strong>{user?.email || 'Account'}</strong><button onClick={logout}>Log out</button></div></aside>
    <main className="dashboard-main">
      <header className="dashboard-header"><div><span className="eyebrow">Your overview</span><h1>Good morning.</h1></div><span className="avatar">{(user?.email || 'A')[0].toUpperCase()}</span></header>
      <section className="metric-grid"><div className="balance-card"><span className="eyebrow">Tracked spending</span><strong>${spent.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong><small>Across all imported transactions</small></div><div className="metric-card"><span className="eyebrow">Transactions</span><strong>{transactions.length}</strong><small>Records in your ledger</small></div><div className="metric-card"><span className="eyebrow">Categories</span><strong>{chartData.length}</strong><small>Spending patterns found</small></div></section>
      {error && <p className="notice">{error}</p>}
      <section className="dashboard-grid"><div className="panel chart-panel"><div className="panel-title"><div><span className="eyebrow">Where it goes</span><h2>Spending by category</h2></div></div>{chartData.length ? <ResponsiveContainer width="100%" height={280}><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={98} paddingAngle={3}>{chartData.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip formatter={(value) => `$${Number(value).toFixed(2)}`} /><Legend /></PieChart></ResponsiveContainer> : <p className="empty-state">Upload a CSV to see your spending patterns.</p>}</div>
        <div className="panel"><div className="panel-title"><div><span className="eyebrow">Your ledger</span><h2>Transactions</h2></div><span className="budget-month">{filteredTransactions.length} shown</span></div><div className="transaction-tools"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transactions" aria-label="Search transactions" /><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} aria-label="Filter by category"><option value="all">All categories</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></div><div className="table-wrap"><table><thead><tr><th>Date</th><th>Description</th><th>Amount</th><th>Category</th></tr></thead><tbody>{filteredTransactions.map((transaction) => <tr key={transaction.id}><td>{new Date(transaction.transaction_date).toLocaleDateString()}</td><td><strong>{transaction.description}</strong></td><td>${Math.abs(Number(transaction.amount)).toFixed(2)}</td><td>{transaction.category_name || 'Uncategorized'}</td></tr>)}</tbody></table>{!filteredTransactions.length && <p className="empty-state">{transactions.length ? 'No transactions match your filters.' : 'No transactions yet.'}</p>}</div></div></section>
      <BudgetSummary />
      <form className="upload-panel" onSubmit={handleUpload}><div><span className="eyebrow">Bring in your history</span><h2>Import activity</h2><p>Upload a CSV with Description, Amount, and Date columns.</p></div><input type="file" accept=".csv,text/csv" onChange={(event) => setFile(event.target.files[0])} /><button className="primary-button" type="submit" disabled={uploading || !file}>{uploading ? 'Importing...' : 'Upload CSV'}</button></form>
    </main>
  </div>;
}
