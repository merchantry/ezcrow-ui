import { getChainId, getEthereumProvider } from 'utils/ethereumProvider';
import chains from '../chains.json';
import { ChainName } from 'web3/types';

export function getNetworkByChainId(chainId: string) {
  const networks = Object.keys(chains) as ChainName[];
  return networks.find(network => chains[network].chainId === chainId);
}

export async function getCurrentNetwork() {
  const provider = await getEthereumProvider();
  const chainId = await getChainId(provider);
  return getNetworkByChainId(chainId);
}
