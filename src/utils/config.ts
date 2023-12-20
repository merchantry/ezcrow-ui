export const FILTER_OPTIONS = ['all', 'buy', 'sell'] as const;

export const CURRENCY_OPTIONS = {
  USD: 'USD $',
  EUR: 'EUR €',
  GBP: 'GBP £',
  CAD: 'CAD $',
};

export const SORT_BY_OPTIONS = {
  price: 'Listed Price',
  availableAmount: 'Available Amount',
  minPerOrder: 'Minimum Limit',
};

export const TOKEN_OPTIONS = ['USDT', 'USDC', 'BTC'] as const;
