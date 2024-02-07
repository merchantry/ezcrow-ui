import { ListingsSortByOption } from 'utils/types';
import { Listing } from 'web3/types';

const serializeListing = (
  listing: Listing,
  token: string,
  currency: string,
): Listing & { token: string; currency: string } => ({
  id: listing.id,
  token,
  currency,
  action: BigInt(listing.action),
  price: listing.price,
  totalTokenAmount: listing.totalTokenAmount,
  availableTokenAmount: listing.availableTokenAmount,
  minPricePerOrder: listing.minPricePerOrder,
  maxPricePerOrder: listing.maxPricePerOrder,
  creator: listing.creator,
  isDeleted: listing.isDeleted,
});

export const formatListingsArray = (
  listings: Listing[],
  {
    tokenSymbol,
    currencySymbol,
    listingActionFilter: _listingActionFilter,
    sortBy,
    sortOrder,
    offset: _offset,
    count: _count,
    showDeleted = false,
  }: {
    tokenSymbol: string;
    currencySymbol: string;
    listingActionFilter?: string;
    sortBy: ListingsSortByOption;
    sortOrder: string;
    offset: string;
    count: string;
    showDeleted?: boolean;
  },
) => {
  const listingActionFilter =
    _listingActionFilter === undefined ? undefined : BigInt(_listingActionFilter);
  const offset = Number(_offset);
  const count = Number(_count);

  return listings
    .map(l => serializeListing(l, tokenSymbol, currencySymbol))
    .filter(listing => {
      if (listingActionFilter === undefined) {
        return true;
      }

      return listing.action === listingActionFilter;
    })
    .filter(l => {
      if (showDeleted) {
        return true;
      }

      return !l.isDeleted && l.availableTokenAmount > 0;
    })
    .sort((a, b) => {
      const amountA = a[sortBy];
      const amountB = b[sortBy];

      if (sortOrder === 'asc') {
        return Number(amountA - amountB);
      }

      return Number(amountB - amountA);
    })
    .slice(offset, offset + count);
};
