export const FILTER_OPTIONS = ['all', 'buy', 'sell'] as const;

export const CURRENCY_OPTIONS = ['USD', 'EUR', 'GBP', 'INR'];

export const SORT_BY_OPTIONS = {
  price: 'Listed Price',
  availableAmount: 'Available Amount',
  minPerOrder: 'Minimum Limit',
};

export const TOKEN_OPTIONS = ['USDT', 'USDC', 'BTC'];

export const ROUND_TO_TOKEN = 2;

export const ROUND_TO_FIAT = 3;

export const MIN_TOKEN_AMOUNT = 0.01;

export const MIN_FIAT_AMOUNT = 0.001;

export const BASE_TITLE = 'Ezcrow - P2P Trading';
