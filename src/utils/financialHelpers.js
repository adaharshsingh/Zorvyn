/**
 * Calculate savings rate percentage
 * @param {Number} income - Total income
 * @param {Number} expenses - Total expenses
 * @returns {Number} Savings rate as percentage
 */
export const calculateSavingsRate = (income, expenses) => {
  if (income === 0) return 0;
  return ((income - expenses) / income) * 100;
};

/**
 * Calculate budget usage percentage
 * @param {Number} expenses - Current expenses
 * @param {Number} budget - Monthly budget
 * @returns {Number} Budget usage as percentage
 */
export const calculateBudgetUsage = (expenses, budget) => {
  if (budget === 0) return 0;
  return (expenses / budget) * 100;
};

/**
 * Determine budget status
 * @param {Number} percentage - Budget usage percentage
 * @returns {String} Status: 'safe', 'warning', or 'danger'
 */
export const getBudgetStatus = (percentage) => {
  if (percentage <= 70) return 'safe';
  if (percentage <= 90) return 'warning';
  return 'danger';
};

/**
 * Calculate monthly average
 * @param {Array} months - Array of month strings in YYYY-MM format
 * @param {Number} total - Total amount
 * @returns {Number} Average per month
 */
export const calculateMonthlyAverage = (months, total) => {
  if (!months || months.length === 0) return 0;
  return total / months.length;
};

/**
 * Calculate trend (increase or decrease)
 * @param {Number} current - Current period amount
 * @param {Number} previous - Previous period amount
 * @returns {Object} { trend: 'up'|'down'|'flat', percentage: Number }
 */
export const calculateTrend = (current, previous) => {
  if (previous === 0) {
    return { trend: current > 0 ? 'up' : 'flat', percentage: 0 };
  }

  const percentageChange = ((current - previous) / previous) * 100;

  if (percentageChange > 0) {
    return { trend: 'up', percentage: percentageChange };
  } else if (percentageChange < 0) {
    return { trend: 'down', percentage: Math.abs(percentageChange) };
  }
  return { trend: 'flat', percentage: 0 };
};

/**
 * Categorize spending
 * @param {Number} amount - Expense amount
 * @param {String} category - Expense category
 * @returns {Object} { category, severity: 'low'|'medium'|'high' }
 */
export const categorizeSprending = (amount, category) => {
  const highSpendCategories = ['entertainment', 'shopping', 'dining'];
  const severity = highSpendCategories.includes(category?.toLowerCase())
    ? 'high'
    : amount > 500
    ? 'medium'
    : 'low';

  return { category, severity };
};
