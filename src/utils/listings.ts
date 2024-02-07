import { ListingAction } from './enums';
import { convertDecimals } from './helpers';
import { Listing } from './types';

export type ListingResponse = {
  id: string;
  token: string;
  currency: string;
  action: string;
  price: string;
  totalTokenAmount: string;
  availableTokenAmount: string;
  maxPricePerOrder: string;
  minPricePerOrder: string;
  creator: string;
  isDeleted: boolean;
  canBeEdited?: boolean;
  canBeRemoved?: boolean;
};

export const serializeListing = (
  listing: ListingResponse,
  tokenDecimalsFrom: number,
  tokenDecimalsTo: number,
  currencyDecimalsFrom: number,
  currencyDecimalsTo: number,
): Listing => ({
  id: Number(listing.id),
  token: listing.token,
  currency: listing.currency,
  action: Number(listing.action) === 0 ? ListingAction.Buy : ListingAction.Sell,
  price: convertDecimals(listing.price, currencyDecimalsFrom, currencyDecimalsTo),
  totalTokenAmount: convertDecimals(listing.totalTokenAmount, tokenDecimalsFrom, tokenDecimalsTo),
  availableTokenAmount: convertDecimals(
    listing.availableTokenAmount,
    tokenDecimalsFrom,
    tokenDecimalsTo,
  ),
  maxPricePerOrder: convertDecimals(
    listing.maxPricePerOrder,
    currencyDecimalsFrom,
    currencyDecimalsTo,
  ),
  minPricePerOrder: convertDecimals(
    listing.minPricePerOrder,
    currencyDecimalsFrom,
    currencyDecimalsTo,
  ),
  creator: listing.creator,
  isDeleted: listing.isDeleted,
  canBeEdited: listing.canBeEdited,
  canBeRemoved: listing.canBeRemoved,
});

export const listingActionToNumber = (action: ListingAction) => {
  switch (action) {
    case ListingAction.Buy:
      return 0;
    case ListingAction.Sell:
      return 1;
  }
};
