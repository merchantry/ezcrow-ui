import { ContractMethod, ContractTransactionResponse } from 'ethers';
import chains from 'web3/chains.json';

export type ChainName = keyof typeof chains;

export type Chain = (typeof chains)[ChainName];

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
