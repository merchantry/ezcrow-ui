import api from './api';

type GetListingsParams = {
  tokenSymbol: string;
  currencySymbol: string;
  sortBy: string;
  listingActionFilter?: number;
  sortOrder: string;
  offset: number;
  count: number;
  maxListings: number;
  network: string;
  showDeleted?: boolean;
};

type GetUserListingsParams = GetListingsParams & { user: string };

export async function getListings({
  offset,
  count,
  listingActionFilter,
  maxListings,
  showDeleted,
  ...rest
}: GetListingsParams) {
  return api.get('getListings', {
    ...rest,
    offset: offset.toString(),
    count: count.toString(),
    maxListings: maxListings.toString(),
    listingActionFilter: listingActionFilter?.toString(),
    showDeleted: showDeleted ? 'true' : 'false',
  });
}

export async function getUserListings({
  offset,
  count,
  listingActionFilter,
  maxListings,
  showDeleted,
  ...rest
}: GetUserListingsParams) {
  return api.get('getUserListings', {
    ...rest,
    offset: offset.toString(),
    count: count.toString(),
    maxListings: maxListings.toString(),
    listingActionFilter: listingActionFilter?.toString(),
    showDeleted: showDeleted ? 'true' : 'false',
  });
}
