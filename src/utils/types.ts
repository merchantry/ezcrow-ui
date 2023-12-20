import { FILTER_OPTIONS, SORT_BY_OPTIONS, TOKEN_OPTIONS } from './config';
import { ListingAction, OrderAction, OrderStatus, UserType } from './enums';

export type FilterOption = (typeof FILTER_OPTIONS)[number];

export type Listing = {
  id: number;
  token: string;
  action: ListingAction;
  fiatCurrency: string;
  price: number;
  totalAmount: number;
  availableAmount: number;
  minPerOrder: number;
  maxPerOrder: number;
  userAddress: string;
  hasOrders: boolean;
};

export type Order = {
  id: number;
  fiatAmount: number;
  tokenAmount: number;
  status: OrderStatus;
  listing: Listing;
  action: OrderAction;
};

export type ColumnData<T> = {
  colStyle?: React.CSSProperties;
  colClassName?: string;
  className?: string;
  label?: string;
  render: (row: T) => React.ReactNode;
}[];

export type SortByOption = keyof typeof SORT_BY_OPTIONS;

export type PerUserOption<T> = Record<UserType, T>;
export type PerListingActionAndUserOption<T> = Record<ListingAction, PerUserOption<T>>;
export type OrderOption<T> = T | PerUserOption<T> | PerListingActionAndUserOption<T>;
export type PerOrderData<T> = Record<OrderStatus, { [K in keyof T]: OrderOption<T[K]> }>;
