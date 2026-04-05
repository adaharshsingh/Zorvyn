/**
 * Calculate transaction statistics
 * @param {Array} transactions - Array of transaction objects
 * @returns {Object} { income, expenses, balance }
 */
export const calculateTransactionStats = (transactions) => {
  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    if (t.type === 'income') {
      income += Number(t.amount);
    } else if (t.type === 'expense') {
      expenses += Number(t.amount);
    }
  });

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};

/**
 * Get transactions for a specific month
 * @param {Array} transactions - Array of transaction objects
 * @param {String} month - Month in YYYY-MM format
 * @returns {Array} Filtered transactions
 */
export const getTransactionsByMonth = (transactions, month) => {
  if (month === 'All Time') {
    return transactions;
  }
  return transactions.filter((t) => t.date.substring(0, 7) === month);
};

/**
 * Get transactions by category
 * @param {Array} transactions - Array of transaction objects
 * @param {String} category - Category name
 * @returns {Array} Filtered transactions
 */
export const getTransactionsByCategory = (transactions, category) => {
  if (category === 'All Categories') {
    return transactions;
  }
  return transactions.filter((t) => t.category === category);
};

/**
 * Get unique months from transactions
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Sorted unique months in YYYY-MM format
 */
export const getAvailableMonths = (transactions) => {
  const months = new Set();
  transactions.forEach((t) => {
    months.add(t.date.substring(0, 7));
  });
  return Array.from(months).sort((a, b) => b.localeCompare(a));
};

/**
 * Export transactions as CSV
 * @param {Array} transactions - Array of transaction objects
 * @param {String} filename - Output filename
 */
export const exportTransactionsCSV = (transactions, filename = 'transactions.csv') => {
  if (!transactions || transactions.length === 0) {
    console.warn('No transactions to export');
    return;
  }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...transactions.map((t) =>
      [t.date, t.description, t.category, t.type, t.amount].map((v) =>
        typeof v === 'string' && v.includes(',') ? `"${v}"` : v
      ).join(',')
    ),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};
