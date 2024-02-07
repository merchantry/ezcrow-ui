import { BigNumberish, ContractMethod, ContractTransactionResponse } from 'ethers';

export type TransactionMethod<T extends unknown[]> = ContractMethod<
  T,
  ContractTransactionResponse,
  ContractTransactionResponse
>;

export type StaticMethod<T extends unknown[], R> = ContractMethod<T, R, R>;

export type Order = {
  id: bigint;
  fiatAmount: bigint;
  tokenAmount: bigint;
  listingId: bigint;
  listingAction: bigint;
  statusHistory: bigint[];
  creator: string;
  listingCreator: string;
};

export type Listing = {
  id: bigint;
  action: bigint;
  price: bigint;
  totalTokenAmount: bigint;
  availableTokenAmount: bigint;
  minPricePerOrder: bigint;
  maxPricePerOrder: bigint;
  creator: string;
  isDeleted: boolean;
  canBeEdited?: boolean;
  canBeRemoved?: boolean;
};

export type ListingStatus = { canBeEdited: boolean; canBeRemoved: boolean };

export type FiatTokenPairHandlerMethods = {
  getFiatTokenPairAddress: StaticMethod<[string, string], string>;
};

export type EzcrowRampQueryMethods = {
  getOrder: StaticMethod<[string, string, BigNumberish], Order>;
  getOrders: StaticMethod<[string, string, BigNumberish], Order[]>;
  getUserOrders: StaticMethod<[string, string, string, BigNumberish], Order[]>;
  getListingOrders: StaticMethod<[string, string, BigNumberish, BigNumberish], Order[]>;
  getListings: StaticMethod<[string, string, BigNumberish], Listing[]>;
  getUserListings: StaticMethod<[string, string, string, BigNumberish], Listing[]>;
};

type OrderActionsParams = [string, string, string, BigNumberish, BigNumberish, string, string];

export type EzcrowRampMethods = {
  getTokenAddress: StaticMethod<[string], string>;
  acceptOrder: TransactionMethod<OrderActionsParams>;
  rejectOrder: TransactionMethod<OrderActionsParams>;
  createListing: TransactionMethod<
    [string, string, BigNumberish, BigNumberish, BigNumberish, BigNumberish, BigNumberish]
  >;
  updateListing: TransactionMethod<
    [
      string,
      string,
      BigNumberish,
      string,
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
    ]
  >;
  deleteListing: TransactionMethod<[string, string, BigNumberish]>;
  createOrder: TransactionMethod<[string, string, BigNumberish, BigNumberish]>;
  nonces: StaticMethod<[string], bigint>;
  acceptDispute: TransactionMethod<[string, string, BigNumberish]>;
  rejectDispute: TransactionMethod<[string, string, BigNumberish]>;
};

export type ERC20Methods = {
  symbol: StaticMethod<[], string>;
  decimals: StaticMethod<[], bigint>;
  approve: TransactionMethod<[string, BigNumberish]>;
  balanceOf: StaticMethod<[string], bigint>;
};

export type CurrencySettingsMethods = {
  symbol: StaticMethod<[], string>;
  decimals: StaticMethod<[], bigint>;
};
