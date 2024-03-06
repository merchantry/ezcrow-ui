/**
 * The ListingAction represents how the creator of the listing
 * wants to interact with it.
 */
export enum ListingAction {
  Sell = 'Sell',
  Buy = 'Buy',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum OrderStatus {
  RequestSent,
  AssetsConfirmed,
  TokensDeposited,
  PaymentSent,
  Completed,
  InDispute,
  Cancelled,
}

export enum UserType {
  OrderCreator = 'orderCreator',
  ListingCreator = 'listingCreator',
}

export enum OrderCancelAction {
  Cancel = 'Cancel Order',
  Dispute = 'Raise A Dispute',
}

export enum ListingModalAction {
  CreateNew = 'createNew',
  Edit = 'edit',
}

export enum Round {
  Up = 'up',
  Down = 'down',
  ToNearest = 'toNearest',
}
