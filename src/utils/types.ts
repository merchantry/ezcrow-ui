import { FILTER_OPTIONS, SORT_BY_OPTIONS } from './config';
import { ListingAction, OrderStatus, UserType } from './enums';
import { ModalProps } from './interfaces';

export type FilterOption = (typeof FILTER_OPTIONS)[number];

export type Listing = {
  id: number;
  token: string;
  currency: string;
  action: ListingAction;
  price: number;
  totalTokenAmount: number;
  availableTokenAmount: number;
  minPricePerOrder: number;
  maxPricePerOrder: number;
  creator: string;
  isDeleted: boolean;
};

export type ListingEditData = Omit<
  Listing,
  'id' | 'creator' | 'availableTokenAmount' | 'isDeleted'
>;

export type Order = {
  id: number;
  fiatAmount: number;
  tokenAmount: number;
  token: string;
  currency: string;
  statusHistory: OrderStatus[];
  listingId: number;
  listingAction: ListingAction;
  creator: string;
  listingCreator: string;
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
