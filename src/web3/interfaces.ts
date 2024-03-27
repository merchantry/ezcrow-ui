import { BigNumberish } from 'ethers';
import { Listing, Order, StaticMethod, TransactionMethod } from './types';
import { UserData } from 'utils/types';

export interface FiatTokenPairHandlerMethods {
  getFiatTokenPairAddress: StaticMethod<[string, string], string>;
}

export interface EzcrowRampQueryMethods {
  getOrder: StaticMethod<[string, string, BigNumberish], Order>;
  getOrders: StaticMethod<[string, string, BigNumberish], Order[]>;
  getUserOrders: StaticMethod<[string, string, string, BigNumberish], Order[]>;
  getListingOrders: StaticMethod<[string, string, BigNumberish, BigNumberish], Order[]>;
  getListings: StaticMethod<[string, string, BigNumberish], Listing[]>;
  getUserListings: StaticMethod<[string, string, string, BigNumberish], Listing[]>;
}

type OrderActionsParams = [string, string, string, BigNumberish, BigNumberish, string, string];

export interface EzcrowRampMethods {
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
  createOrder: TransactionMethod<
    [string, string, string, BigNumberish, BigNumberish, BigNumberish, string, string]
  >;
  nonces: StaticMethod<[string], bigint>;
  acceptDispute: TransactionMethod<[string, string, BigNumberish]>;
  rejectDispute: TransactionMethod<[string, string, BigNumberish]>;
}

export interface ERC20Methods {
  symbol: StaticMethod<[], string>;
  decimals: StaticMethod<[], bigint>;
  approve: TransactionMethod<[string, BigNumberish]>;
  balanceOf: StaticMethod<[string], bigint>;
}

export interface CurrencySettingsMethods {
  symbol: StaticMethod<[], string>;
  decimals: StaticMethod<[], bigint>;
}

export interface WhitelistedUsersDatabaseHandlerMethods {
  getUserData: StaticMethod<[string, string], UserData>;
  updateUser: TransactionMethod<[string, string, string[]]>;
  isWhitelisted: StaticMethod<[string, string], boolean>;
  getAllValidPaymentMethods: StaticMethod<[], string[]>;
}

export interface MultiOwnableMethods {
  isOwner: StaticMethod<[string], boolean>;
}
