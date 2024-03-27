import route from '../utils/route';
import { OrderCreateParams } from 'api/types';
import { getEzcrowRampContract } from 'web3/contracts';
import { getSigner } from 'api/utils/web3/provider';

export const handler = route.post(
  async ({
    owner,
    tokenSymbol,
    currencySymbol,
    listingId,
    tokenAmount,
    v,
    r,
    s,
    network,
  }: OrderCreateParams) => {
    const signer = getSigner(network);
    const ezcrowRamp = getEzcrowRampContract(network, signer);

    const tx = await ezcrowRamp.createOrder(
      owner,
      tokenSymbol,
      currencySymbol,
      listingId,
      tokenAmount,
      v,
      r,
      s,
    );

    return {
      txHash: tx.hash,
    };
  },
);
