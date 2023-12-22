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

export async function cancelOrder(orderId: number) {
  return api.sendTransaction('0x123', 'cancelOrder', [orderId]);
}

export async function executeOrder(orderId: number) {
  return api.sendTransaction('0x123', 'executeOrder', [orderId]);
}
