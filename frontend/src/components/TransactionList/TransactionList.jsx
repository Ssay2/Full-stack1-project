function formatDate(date) { return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }); }

export default function TransactionList({ transactions }) {
  return <div className="transaction-list">{transactions.slice(0, 8).map((transaction) => <div className="transaction-row" key={transaction.id || `${transaction.description}-${transaction.date}`}>
    <div className="transaction-mark">{transaction.description.slice(0, 1).toUpperCase()}</div>
    <div className="transaction-description"><strong>{transaction.description}</strong><span>{transaction.category || 'Uncategorized'} · {formatDate(transaction.transaction_date || transaction.date)}</span></div>
    <strong className={transaction.type === 'income' ? 'income' : 'expense'}>{transaction.type === 'income' ? '+' : '-'}${Number(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
  </div>)}</div>;
}