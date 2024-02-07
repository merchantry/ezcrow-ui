import { OrdersSortByOption } from 'utils/types';
import { Order } from 'web3/types';

export const serializeOrder = (order: Order, token: string, currency: string) => ({
  id: order.id,
  token,
  currency,
  fiatAmount: order.fiatAmount,
  tokenAmount: order.tokenAmount,
  listingId: order.listingId,
  listingAction: order.listingAction,
  statusHistory: order.statusHistory,
  creator: order.creator,
  listingCreator: order.listingCreator,
});

export const getCurrentStatus = (order: Order) =>
  order.statusHistory[order.statusHistory.length - 1];

export const formatOrdersArray = (
  orders: Order[],
  {
    tokenSymbol,
    currencySymbol,
    orderActionFilter: _orderActionFilter,
    statusFilter: _statusFilter,
    sortBy,
    sortOrder,
    offset: _offset,
    count: _count,
    user,
  }: {
    tokenSymbol: string;
    currencySymbol: string;
    orderActionFilter?: string;
    statusFilter?: string;
    sortBy: OrdersSortByOption;
    sortOrder: string;
    offset: string;
    count: string;
    user?: string;
  },
) => {
  const orderActionFilter =
    _orderActionFilter === undefined ? undefined : BigInt(_orderActionFilter);
  const statusFilter = _statusFilter === undefined ? undefined : BigInt(_statusFilter);
  const offset = Number(_offset);
  const count = Number(_count);

  return orders
    .map(o => serializeOrder(o, tokenSymbol, currencySymbol))
    .filter(order => {
      if (user === undefined || orderActionFilter === undefined) {
        return true;
      }

      if (order.creator === user) {
        return order.listingAction !== orderActionFilter;
      }

      return order.listingAction === orderActionFilter;
    })
    .filter(order => {
      if (statusFilter === undefined) {
        return true;
      }

      return getCurrentStatus(order) === statusFilter;
    })
    .sort((a, b) => {
      const amountA = a[sortBy];
      const amountB = b[sortBy];

      if (sortOrder === 'asc') {
        return Number(amountA - amountB);
      }

      return Number(amountB - amountA);
    })
    .slice(offset, offset + count);
};
