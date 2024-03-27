import route from '../utils/route';
import { formatListingsArray } from 'api/utils/listings';
import { getEzcrowRampQueryContract } from 'web3/contracts';
import { getSigner } from 'api/utils/web3/provider';
import { ListingsSortByOption } from 'utils/types';
import { getCurrentStatus } from 'api/utils/orders';
import { OrderStatus } from 'utils/enums';

interface Params {
  tokenSymbol: string;
  currencySymbol: string;
  user: string;
  listingActionFilter: string;
  sortBy: ListingsSortByOption;
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
    user,
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

    const listings = await ezcrowRampQuery.getUserListings(
      tokenSymbol,
      currencySymbol,
      user,
      maxListings,
    );

    const orders = await ezcrowRampQuery.getUserOrders(tokenSymbol, currencySymbol, user, 2000);

    const formattedListings = formatListingsArray(listings, {
      tokenSymbol,
      currencySymbol,
      listingActionFilter,
      sortBy,
      sortOrder,
      offset,
      count,
      showDeleted: showDeleted === 'true',
    });

    for (const listing of formattedListings) {
      const listingOrders = orders.filter(order => order.listingId === listing.id);

      const canBeEdited = listingOrders.every(order => {
        const currentStatus = Number(getCurrentStatus(order)) as OrderStatus;
        return currentStatus === OrderStatus.Cancelled;
      });

      const canBeRemoved = listingOrders.every(order => {
        const currentStatus = Number(getCurrentStatus(order)) as OrderStatus;
        return currentStatus === OrderStatus.Cancelled || currentStatus === OrderStatus.Completed;
      });

      listing.canBeEdited = !listing.isDeleted && canBeEdited;
      listing.canBeRemoved = !listing.isDeleted && canBeRemoved;
    }

    return formattedListings;
  },
);
