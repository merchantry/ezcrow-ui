import { ListingAction, OrderStatus, UserType } from './enums';
import { convertDecimals } from './helpers';
import {
  Order,
  OrderOption,
  PerListingActionAndUserOption,
  PerOrderData,
  PerUserOption,
} from './types';

export type OrderResponse = {
  id: string;
  token: string;
  currency: string;
  listingId: string;
  listingAction: string;
  statusHistory: string[];
  tokenAmount: string;
  fiatAmount: string;
  creator: string;
  listingCreator: string;
};

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

export const getCurrentOrderStatus = (order: Order) =>
  order.statusHistory[order.statusHistory.length - 1];

export const getUserType = (user: string, order: Order) => {
  switch (user) {
    case order.creator:
      return UserType.OrderCreator;
    case order.listingCreator:
      return UserType.ListingCreator;
    default:
      throw new Error('User is not related to the order');
  }
};

export const isUserBuying = (userType: UserType, order: Order) =>
  userType === UserType.ListingCreator
    ? order.listingAction === ListingAction.Buy
    : order.listingAction === ListingAction.Sell;

export const getOrderData = <T>(order: Order, user: UserType, perOrderData: PerOrderData<T>) => {
  const result: Partial<T> = {};
  const status = getCurrentOrderStatus(order);

  Object.entries(perOrderData[status]).forEach(
    ([key, value]) =>
      (result[key as keyof T] = getOrderOption(value, order.listingAction, user) as T[keyof T]),
  );

  return result as T;
};

export const serializeOrder = (
  order: OrderResponse,
  tokenDecimalsFrom: number,
  tokenDecimalsTo: number,
  currencyDecimalsFrom: number,
  currencyDecimalsTo: number,
): Order => ({
  id: Number(order.id),
  token: order.token,
  currency: order.currency,
  listingId: Number(order.listingId),
  listingAction: Number(order.listingAction) === 0 ? ListingAction.Buy : ListingAction.Sell,
  tokenAmount: convertDecimals(order.tokenAmount, tokenDecimalsFrom, tokenDecimalsTo),
  fiatAmount: convertDecimals(order.fiatAmount, currencyDecimalsFrom, currencyDecimalsTo),
  statusHistory: order.statusHistory.map(status => Number(status) as OrderStatus),
  creator: order.creator,
  listingCreator: order.listingCreator,
});
