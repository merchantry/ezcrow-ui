import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { Chain } from 'web3/types';

type EthereumProvider = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request: <R, T = any[]>(args: { method: string; params?: T }) => Promise<R>;
};

export async function getEthereumProvider() {
  const ethereum = await detectEthereumProvider();
  if (!ethereum) throw new Error('MetaMask is not installed');

  return ethereum as typeof ethereum & EthereumProvider;
}

export async function getChainId(ethereumProvider: EthereumProvider) {
  return ethereumProvider.request<string>({ method: 'eth_chainId' });
}

async function connectAccounts(ethereumProvider: EthereumProvider) {
  await ethereumProvider.request({ method: 'eth_requestAccounts' });
}

async function switchToChain(ethereumProvider: EthereumProvider, chainId: string) {
  await ethereumProvider.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
}

async function addChain(ethereumProvider: EthereumProvider, chain: Chain) {
  await ethereumProvider.request({
    method: 'wallet_addEthereumChain',
    params: [chain],
  });
}

export async function updateChain(ethereumProvider: EthereumProvider, chain: Chain) {
  const chainId = await getChainId(ethereumProvider);
  if (chainId === chain.chainId) return;

  try {
    await switchToChain(ethereumProvider, chain.chainId);
  } catch {
    await addChain(ethereumProvider, chain);
  }
}

export async function connectUserWallet(ethereumProvider: EthereumProvider, chain: Chain) {
  await connectAccounts(ethereumProvider);
  await updateChain(ethereumProvider, chain);
}

export async function isWalletConnected(ethereumProvider: EthereumProvider) {
  const accounts = await ethereumProvider.request<string[]>({ method: 'eth_accounts' });

  return accounts.length > 0;
}

export async function getSigner(ethereumProvider: EthereumProvider) {
  const provider = new ethers.BrowserProvider(ethereumProvider);

  return provider.getSigner();
}
