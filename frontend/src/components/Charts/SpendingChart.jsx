export default function SpendingChart({ transactions }) {
  const expenses = transactions.filter((item) => item.type === 'expense');
  const grouped = expenses.reduce((result, item) => { const label = item.category || 'Other'; result[label] = (result[label] || 0) + Number(item.amount); return result; }, {});
  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const max = entries[0]?.[1] || 1;
  return <div className="chart-list">{entries.length ? entries.map(([label, value], index) => <div className="chart-row" key={label}>
    <div className="chart-label"><span className={`dot dot-${index}`} />{label}<strong>${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</strong></div>
    <div className="bar-track"><div className={`bar bar-${index}`} style={{ width: `${Math.max(8, value / max * 100)}%` }} /></div>
  </div>) : <p className="muted">Import transactions to see your spending pattern.</p>}</div>;
}