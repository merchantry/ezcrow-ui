import { ListingEditData } from 'utils/types';
import api from 'web3/api';

export async function getAllListings(
  filter: string,
  currency: string,
  token: string,
  sortBy: string,
  sortOrder: string,
  page: number,
) {
  return api.get('0x123', 'getAllListings', [filter, currency, token, sortBy, sortOrder, page]);
}

export async function createListing(listingEditData: ListingEditData) {
  return api.sendTransaction('0x123', 'createListing', Object.values(listingEditData));
}

export async function removeListing(listingId: number) {
  return api.sendTransaction('0x123', 'removeListing', [listingId]);
}

export async function editListing(listingId: number, listingEditData: ListingEditData) {
  return api.sendTransaction('0x123', 'editListing', [
    listingId,
    ...Object.values(listingEditData),
  ]);
}
