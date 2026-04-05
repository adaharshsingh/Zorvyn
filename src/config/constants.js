// Pagination
export const ITEMS_PER_PAGE = 8;

// Layout
export const COLLAPSE_BREAKPOINT = 1024;
export const MOBILE_BREAKPOINT = 768;

// Currency
export const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR'];
export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
};

// API Endpoints
export const API_ENDPOINTS = {
  CRYPTO: 'https://api.coingecko.com/api/v3/simple/price',
};

// Crypto Data
export const CRYPTO_IDS = ['bitcoin', 'ethereum', 'solana'];
export const CRYPTO_DISPLAY_NAMES = {
  bitcoin: 'BTC',
  ethereum: 'ETH',
  solana: 'SOL',
};

// Chart defaults
export const CHART_COLORS = {
  primary: '#6366f1',
  success: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
};

// Default values
export const DEFAULTS = {
  MONTHLY_BUDGET: 8000,
  ROLE: 'viewer',
  THEME: 'light',
  CURRENCY: 'USD',
  CARD_NUMBER: '**** **** 6541',
  CARD_EXPIRY: '12/26',
  CARDHOLDER_NAME: 'Adarsh Kumar Singh',
};

// Cache duration (in ms)
export const CACHE_DURATION = {
  CRYPTO: 60000, // 1 minute
  CHARTS: 300000, // 5 minutes
};
