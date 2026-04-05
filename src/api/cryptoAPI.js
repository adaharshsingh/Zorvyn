// Fallback data when API is unavailable
const FALLBACK_CRYPTO_DATA = [
  { name: 'BTC', price: 66230, change: 2.45 },
  { name: 'ETH', price: 3520, change: 1.82 },
  { name: 'SOL', price: 185, change: 3.12 },
];

import { API_ENDPOINTS } from '../config/constants';

export const fetchCryptoData = async () => {
  try {
    // Using CoinGecko API with CORS proxy
    const response = await fetch(
      `${API_ENDPOINTS.CRYPTO}?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to our format
    const cryptoData = [
      {
        name: 'BTC',
        price: data.bitcoin?.usd || FALLBACK_CRYPTO_DATA[0].price,
        change: data.bitcoin?.usd_24h_change || FALLBACK_CRYPTO_DATA[0].change,
      },
      {
        name: 'ETH',
        price: data.ethereum?.usd || FALLBACK_CRYPTO_DATA[1].price,
        change: data.ethereum?.usd_24h_change || FALLBACK_CRYPTO_DATA[1].change,
      },
      {
        name: 'SOL',
        price: data.solana?.usd || FALLBACK_CRYPTO_DATA[2].price,
        change: data.solana?.usd_24h_change || FALLBACK_CRYPTO_DATA[2].change,
      },
    ];

    try {
      localStorage.setItem('cached_crypto_data', JSON.stringify(cryptoData));
    } catch (e) {
      console.warn('Storage failed:', e);
    }

    return cryptoData;
  } catch (error) {
    console.warn('Unable to fetch live crypto data, using fallback:', error.message);
    
    try {
      const cached = localStorage.getItem('cached_crypto_data');
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (e) {
      console.warn('Failed to parse cached crypto data:', e);
    }

    return FALLBACK_CRYPTO_DATA;
  }
};
