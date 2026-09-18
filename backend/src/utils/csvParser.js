const csv = require('csv-parser');
const { Readable } = require('stream');

const CATEGORY_RULES = [
  { keyword: 'starbucks', category: 'Food & Drink' },
  { keyword: 'uber', category: 'Transport' },
  { keyword: 'amazon', category: 'Shopping' },
  { keyword: 'netflix', category: 'Subscriptions' },
  { keyword: 'rent', category: 'Housing' },
];

function guessCategory(description) {
  const match = CATEGORY_RULES.find((rule) => description.toLowerCase().includes(rule.keyword));
  return match ? match.category : 'Uncategorized';
}

function parseCsvBuffer(buffer) {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString());

    stream
      .pipe(csv())
      .on('data', (row) => {
        const description = row.Description || row.description;
        const amount = parseFloat(row.Amount || row.amount);
        const date = row.Date || row.date;

        if (description && !Number.isNaN(amount) && date) {
          results.push({
            description: description.trim(),
            amount,
            transaction_date: date,
            suggestedCategory: guessCategory(description),
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = { parseCsvBuffer };