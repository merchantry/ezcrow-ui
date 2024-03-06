import route from '../utils/route';
import { OrderActionParams } from 'api/types';
import { getEzcrowRampContract } from 'web3/utils/contracts';
import { getSigner } from 'api/utils/web3/provider';

export const handler = route.post(
  async ({ owner, tokenSymbol, currencySymbol, orderId, v, r, s, network }: OrderActionParams) => {
    const signer = getSigner(network);
    const ezcrowRamp = getEzcrowRampContract(network, signer);

    const tx = await ezcrowRamp.acceptOrder(owner, tokenSymbol, currencySymbol, orderId, v, r, s);

    return {
      txHash: tx.hash,
    };
  },
);
