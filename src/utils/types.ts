import { FILTER_OPTIONS, SORT_BY_OPTIONS } from './config';
import { ListingAction, OrderAction, OrderStatus, UserType } from './enums';
import { ModalProps } from './interfaces';

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
  creator: string;
  hasOrders: boolean;
};

export type ListingEditData = Omit<Listing, 'id' | 'hasOrders' | 'creator' | 'availableAmount'>;

export type Order = {
  id: number;
  fiatAmount: number;
  tokenAmount: number;
  status: OrderStatus;
  listing: Listing;
  action: OrderAction;
  creator: string;
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

export type GetModalSubmitDataType<T> = T extends ModalProps<infer R> ? R : never;
