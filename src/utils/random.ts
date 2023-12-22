import { CURRENCY_OPTIONS, TOKEN_OPTIONS } from './config';
import { ListingAction, OrderAction, OrderStatus } from './enums';
import { fiatToToken, roundTo } from './helpers';
import { Listing, Order } from './types';

export const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomElement = <T>(array: T[]) => array[randomInt(0, array.length - 1)];

export const randomListing = (i: number): Listing => {
  const totalAmount = randomInt(100, 200);
  const availableAmount = Math.min(totalAmount, randomInt(80, 200));
  const price = roundTo(0.85 + randomInt(1, 100) / 100, 2);

  return {
    id: 14600 + i,
    token: randomElement(TOKEN_OPTIONS),
    action: randomElement([ListingAction.Buy, ListingAction.Sell]),
    fiatCurrency: randomElement(CURRENCY_OPTIONS),
    price,
    totalAmount,
    availableAmount,
    minPerOrder: randomInt(10, 20),
    maxPerOrder: Math.min(totalAmount * price, randomInt(100, 200)),
    userAddress: '0x1234567890',
    hasOrders: totalAmount !== availableAmount,
  };
};

export const randomOrder = (i: number): Order => {
  const listing = randomListing(i);
  const { minPerOrder, maxPerOrder } = listing;
  const fiatAmount = randomInt(minPerOrder, maxPerOrder);

  return {
    id: 42000 + i,
    fiatAmount,
    tokenAmount: fiatToToken(fiatAmount, listing),
    status: randomElement([
      OrderStatus.RequestSent,
      OrderStatus.AssetsConfirmed,
      OrderStatus.PaymentSent,
      OrderStatus.Completed,
      OrderStatus.InDispute,
      OrderStatus.Cancelled,
    ]),
    listing,
    action: randomElement([OrderAction.Buy, OrderAction.Sell]),
  };
};
