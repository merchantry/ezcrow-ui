export type Response = bigint | string | boolean | Array<unknown> | object | undefined | void;

export type OrderActionParams = {
  owner: string;
  tokenSymbol: string;
  currencySymbol: string;
  orderId: string;
  v: string;
  r: string;
  s: string;
  network: string;
};
