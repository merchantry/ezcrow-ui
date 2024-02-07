export const FILTER_OPTIONS = ['all', 'buy', 'sell'] as const;

export const LISTINGS_SORT_BY_OPTIONS = {
  id: 'ID',
  price: 'Listed Price',
  availableTokenAmount: 'Available Amount',
  minPricePerOrder: 'Minimum Limit',
  maxPricePerOrder: 'Maximum Limit',
};

export const ORDERS_SORT_BY_OPTIONS = {
  id: 'ID',
  listingId: 'Listing ID',
  fiatAmount: 'Fiat Amount',
  tokenAmount: 'Order Amount',
};

export const ROUND_TO_TOKEN = 2;

export const ROUND_TO_FIAT = 3;

export const MIN_TOKEN_AMOUNT = 0.01;

export const MIN_FIAT_AMOUNT = 0.001;

export const BASE_TITLE = 'Ezcrow - P2P Trading';

export const PER_PAGE = 30;
