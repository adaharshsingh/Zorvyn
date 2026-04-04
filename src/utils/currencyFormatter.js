export const formatCurrency = (amount, currencyCode = 'USD') => {
  const rates = {
    USD: { rate: 1, symbol: '$' },
    EUR: { rate: 0.92, symbol: '€' },
    GBP: { rate: 0.79, symbol: '£' },
    INR: { rate: 83.12, symbol: '₹' }
  };
  
  const currency = rates[currencyCode] || rates['USD'];
  const converted = amount * currency.rate;
  
  if (isNaN(converted) || converted === null) {
    return `${currency.symbol}0.00`;
  }
  
  return `${currency.symbol}${converted.toLocaleString(undefined, { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};
