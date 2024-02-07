import route from '../utils/route';
import { formatOrdersArray } from 'api/utils/orders';
import { getSigner } from 'api/utils/web3/provider';
import { OrdersSortByOption } from 'utils/types';
import { getEzcrowRampQueryContract } from 'web3/utils/contracts';

type Params = {
  tokenSymbol: string;
  currencySymbol: string;
  user: string;
  orderActionFilter: string;
  statusFilter: string;
  sortBy: OrdersSortByOption;
  sortOrder: string;
  offset: string;
  count: string;
  maxOrders: string;
  network: string;
};

export const handler = route.get(
  async ({
    tokenSymbol,
    currencySymbol,
    user,
    orderActionFilter,
    statusFilter,
    sortBy,
    sortOrder,
    offset,
    count,
    maxOrders,
    network,
  }: Params) => {
    const ezcrowRampQuery = getEzcrowRampQueryContract(network, getSigner(network));

    const orders = await ezcrowRampQuery.getUserOrders(
      tokenSymbol,
      currencySymbol,
      user,
      maxOrders,
    );

    return formatOrdersArray(orders, {
      tokenSymbol,
      currencySymbol,
      orderActionFilter,
      statusFilter,
      sortOrder,
      sortBy,
      offset,
      count,
      user,
    });
  },
);
