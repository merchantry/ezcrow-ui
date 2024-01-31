import { ethers } from 'ethers';
import chains from 'web3/chains.json';

export const getSigner = (network: string) => {
  const privateKey = process.env.ACCOUNT_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('ACCOUNT_PRIVATE_KEY env variable is not set');
  }

  const rpcUrl = chains[network as keyof typeof chains].rpcUrls[0];
  const provider = new ethers.JsonRpcProvider(rpcUrl);

  return new ethers.Wallet(privateKey, provider);
};
