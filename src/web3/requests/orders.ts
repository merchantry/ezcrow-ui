import api from 'web3/api';

export async function getAllOrders(
  currency: string,
  token: string,
  sortBy: string,
  sortOrder: string,
  page: number,
) {
  return api.get('0x123', 'getAllOrders', [currency, token, sortBy, sortOrder, page]);
}

export async function createOrder(listingId: number, amount: number) {
  return api.sendTransaction('0x123', 'createOrder', [listingId, amount]);
}

export async function rejectOrder(orderId: number) {
  return api.sendTransaction('0x123', 'rejectOrder', [orderId]);
}

export async function acceptOrder(orderId: number) {
  return api.sendTransaction('0x123', 'acceptOrder', [orderId]);
}

export async function acceptDispute(orderId: number) {
  return api.sendTransaction('0x123', 'acceptDispute', [orderId]);
}

export async function rejectDispute(orderId: number) {
  return api.sendTransaction('0x123', 'rejectDispute', [orderId]);
}
