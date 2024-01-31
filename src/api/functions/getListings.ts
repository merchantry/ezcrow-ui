import route from '../utils/route';
import { formatListingsArray } from 'api/utils/listings';
import { getEzcrowRampQueryContract } from 'web3/utils/contracts';
import { getSigner } from 'api/utils/web3/provider';
import { SortByOption } from 'utils/types';

interface Params {
  tokenSymbol: string;
  currencySymbol: string;
  listingActionFilter: string;
  sortBy: SortByOption;
  sortOrder: string;
  offset: string;
  count: string;
  maxListings: string;
  showDeleted?: string;
  network: string;
}

export const handler = route.get(
  async ({
    tokenSymbol,
    currencySymbol,
    listingActionFilter,
    sortBy,
    sortOrder,
    offset,
    count,
    maxListings,
    showDeleted,
    network,
  }: Params) => {
    const ezcrowRampQuery = getEzcrowRampQueryContract(network, getSigner(network));

    const listings = await ezcrowRampQuery.getListings(tokenSymbol, currencySymbol, maxListings);

    return formatListingsArray(listings, {
      tokenSymbol,
      currencySymbol,
      listingActionFilter,
      sortBy,
      sortOrder,
      offset,
      count,
      showDeleted: showDeleted === 'true',
    });
  },
);
