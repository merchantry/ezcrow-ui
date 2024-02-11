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

export const PER_PAGE = 30;
