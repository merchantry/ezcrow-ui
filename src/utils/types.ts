import { FILTER_OPTIONS, LISTINGS_SORT_BY_OPTIONS, ORDERS_SORT_BY_OPTIONS } from 'config/tables';
import { ListingAction, OrderStatus, UserType } from './enums';
import { ModalProps } from './interfaces';

export type FilterOption = (typeof FILTER_OPTIONS)[number];

export type UserData = {
  profileNonce: number;
  user: string;
  currency: string;
  telegramHandle: string;
  whitelisted: boolean;
  privateData: {
    paymentMethod: string;
    paymentData: string;
  };
};

export type UserEditData = Pick<UserData, 'currency' | 'telegramHandle'> & UserData['privateData'];

export type ListingEditData = {
  token: string;
  currency: string;
  action: ListingAction;
  price: number;
  totalTokenAmount: number;
  minPricePerOrder: number;
  maxPricePerOrder: number;
};

export type Listing = ListingEditData & {
  id: number;
  availableTokenAmount: number;
  creator: string;
  isDeleted: boolean;
  canBeEdited?: boolean;
  canBeRemoved?: boolean;
};

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

export type ListingsSortByOption = keyof typeof LISTINGS_SORT_BY_OPTIONS;

export type OrdersSortByOption = keyof typeof ORDERS_SORT_BY_OPTIONS;

export type PerUserOption<T> = Record<UserType, T>;
export type PerListingActionAndUserOption<T> = Record<ListingAction, PerUserOption<T>>;
export type OrderOption<T> = T | PerUserOption<T> | PerListingActionAndUserOption<T>;
export type PerOrderData<T> = Record<OrderStatus, { [K in keyof T]: OrderOption<T[K]> }>;

export type GetModalSubmitDataType<T> = T extends ModalProps<infer R> ? R : never;

export type Web3ContractAccountData = {
  isOwner: boolean;
};
