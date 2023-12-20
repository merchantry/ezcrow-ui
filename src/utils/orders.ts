import { ListingAction, UserType } from './enums';
import {
  Listing,
  Order,
  OrderOption,
  PerListingActionAndUserOption,
  PerOrderData,
  PerUserOption,
} from './types';

export const getOrderOption = <T>(
  orderOption: OrderOption<T>,
  listingAction: ListingAction,
  user: UserType,
): T => {
  if (typeof orderOption === 'object' && orderOption !== null) {
    if (user in orderOption) return (orderOption as PerUserOption<T>)[user];
    if (listingAction in orderOption)
      return (orderOption as PerListingActionAndUserOption<T>)[listingAction][user];
  }

  return orderOption as T;
};

export const getOrderData = <T>(order: Order, user: UserType, perOrderData: PerOrderData<T>) => {
  const result: Partial<T> = {};

  Object.entries(perOrderData[order.status]).forEach(
    ([key, value]) =>
      (result[key as keyof T] = getOrderOption(value, order.listing.action, user) as T[keyof T]),
  );

  return result as T;
};

export const getUserType = (listing: Listing, userAddress: string) =>
  listing.userAddress === userAddress ? UserType.ListingCreator : UserType.OrderCreator;
