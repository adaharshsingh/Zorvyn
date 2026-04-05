/**
 * Generate chart data for balance trend
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Chart data formatted for recharts LineChart
 */
export const generateBalanceTrendData = (transactions) => {
  const monthlyData = {};

  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenses: 0 };
    }

    const amount = Number(t.amount);
    if (t.type === 'income') {
      monthlyData[month].income += amount;
    } else if (t.type === 'expense') {
      monthlyData[month].expenses += amount;
    }
  });

  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { income, expenses }]) => ({
      month,
      balance: income - expenses,
      income,
      expenses,
    }));
};

/**
 * Generate chart data for spending breakdown (pie chart)
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Chart data formatted for recharts PieChart
 */
export const generateSpendingBreakdownData = (transactions) => {
  const categorySpending = {};

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const category = t.category || 'Other';
      categorySpending[category] = (categorySpending[category] || 0) + Number(t.amount);
    });

  return Object.entries(categorySpending)
    .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
    .sort((a, b) => b.value - a.value);
};

/**
 * Generate chart data for monthly income vs expenses
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Chart data formatted for recharts BarChart
 */
export const generateIncomeVsExpensesData = (transactions) => {
  const monthlyData = {};

  transactions.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = { income: 0, expenses: 0, month };
    }

    const amount = Number(t.amount);
    if (t.type === 'income') {
      monthlyData[month].income += amount;
    } else if (t.type === 'expense') {
      monthlyData[month].expenses += amount;
    }
  });

  return Object.values(monthlyData)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map((data) => ({
      ...data,
      income: parseFloat(data.income.toFixed(2)),
      expenses: parseFloat(data.expenses.toFixed(2)),
    }));
};

/**
 * Generate category-wise expense data for radar chart
 * @param {Array} transactions - Array of transaction objects
 * @returns {Array} Chart data formatted for recharts RadarChart
 */
export const generateCategoryRadarData = (transactions) => {
  const categoryData = {};
  const allCategories = new Set();

  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const category = t.category || 'Other';
      allCategories.add(category);
      categoryData[category] = (categoryData[category] || 0) + Number(t.amount);
    });

  return Array.from(allCategories)
    .map((category) => ({
      category,
      amount: parseFloat((categoryData[category] || 0).toFixed(2)),
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 8); // Limit to 8 categories for readability
};
