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

/**
 * The OrderAction represents the action the user
 * is taking on the order.
 *
 * - If a listing creator receives a request on a LisingAction.Buy listing
 * the OrderAction will be OrderAction.Buy
 *
 * - If a listing creator receives a request on a LisingAction.Sell listing
 * the OrderAction will be OrderAction.Sell
 *
 * - If an order creator sends a request to a ListingAction.Sell listing
 * the OrderAction will be OrderAction.Buy
 *
 * - If an order creator sends a request to a ListingAction.Buy listing
 * the OrderAction will be OrderAction.Sell
 *
 */
export enum OrderAction {
  Buy = 'Buy',
  Sell = 'Sell',
}

export enum OrderCancelAction {
  Cancel = 'Cancel Order',
  Dispute = 'Raise A Dispute',
}

export enum ListingModalAction {
  CreateNew = 'createNew',
  Edit = 'edit',
}
