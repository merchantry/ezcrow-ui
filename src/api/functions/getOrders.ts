import { getEzcrowRampQueryContract } from 'web3/utils/contracts';
import route from '../utils/route';
import { formatOrdersArray } from 'api/utils/orders';
import { getSigner } from 'api/utils/web3/provider';

type Params = {
  tokenSymbol: string;
  currencySymbol: string;
  orderActionFilter?: string;
  statusFilter?: string;
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
    orderActionFilter,
    statusFilter,
    sortOrder,
    offset,
    count,
    maxOrders,
    network,
  }: Params) => {
    const ezcrowRampQuery = getEzcrowRampQueryContract(network, getSigner(network));

    const orders = await ezcrowRampQuery.getOrders(tokenSymbol, currencySymbol, maxOrders);

    return formatOrdersArray(orders, {
      tokenSymbol,
      currencySymbol,
      orderActionFilter,
      statusFilter,
      sortOrder,
      offset,
      count,
    });
  },
);