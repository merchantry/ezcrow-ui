import chains from './chains.json';
import { ChainName } from './types';

export const DEFAULT_CHAIN = Object.keys(chains)[0] as ChainName;

export const NETWORK_OPTIONS: Record<ChainName, string> = {
  telostest: 'Telos Testnet',
  arbitrumsepolia: 'Arbitrum Sepolia',
};
