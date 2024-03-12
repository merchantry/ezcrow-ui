import { ethers } from 'ethers';
import chains from 'web3/chains.json';
import { ChainName } from 'web3/types';

export const getSigner = (network: string) => {
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('ACCOUNT_PRIVATE_KEY env variable is not set');
  }

  const rpcUrl = chains[network as ChainName].rpcUrls[0];
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  return new ethers.Wallet(privateKey, provider);
};
