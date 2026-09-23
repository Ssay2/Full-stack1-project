export function parseTransactionsCsv(csv) {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((value) => value.trim());
    const row = Object.fromEntries(headers.map((header, index) => [header, values[index]]));
    return {
      description: row.description || row.name || 'Imported transaction',
      amount: Math.abs(Number(row.amount)),
      date: row.date || row.transaction_date,
      type: row.type === 'income' || Number(row.amount) < 0 ? 'income' : 'expense'
    };
  }).filter((transaction) => transaction.amount > 0 && transaction.date);
}