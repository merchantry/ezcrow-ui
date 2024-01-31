import { OrderActionParams } from 'api/types';
import api from './api';

type GetOrdersParams = {
  tokenSymbol: string;
  currencySymbol: string;
  sortBy: string;
  orderActionFilter?: number;
  statusFilter?: number;
  sortOrder: string;
  offset: number;
  count: number;
  maxOrders: number;
  network: string;
};

type GetUserOrdersParams = GetOrdersParams & { user: string };

export async function getOrders({
  offset,
  count,
  orderActionFilter,
  maxOrders,
  statusFilter,
  ...rest
}: GetOrdersParams) {
  return api.get('getOrders', {
    ...rest,
    offset: offset.toString(),
    count: count.toString(),
    maxOrders: maxOrders.toString(),
    orderActionFilter: orderActionFilter?.toString(),
    statusFilter: statusFilter?.toString(),
  });
}

export async function getUserOrders({
  offset,
  count,
  orderActionFilter,
  maxOrders,
  statusFilter,
  user,
  ...rest
}: GetUserOrdersParams) {
  return api.get('getUserOrders', {
    ...rest,
    offset: offset.toString(),
    count: count.toString(),
    maxOrders: maxOrders.toString(),
    orderActionFilter: orderActionFilter?.toString(),
    statusFilter: statusFilter?.toString(),
    user,
  });
}

export async function acceptOrder(params: OrderActionParams) {
  return api.post('acceptOrder', params);
}

export async function rejectOrder(params: OrderActionParams) {
  return api.post('rejectOrder', params);
}
