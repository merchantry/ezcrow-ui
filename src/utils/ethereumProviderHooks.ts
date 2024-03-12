import { useEffect, useState } from 'react';
import { getEthereumProvider } from './ethereumProvider';

type EthereumProvider = Awaited<ReturnType<typeof getEthereumProvider>>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useWeb3Event = (eventName: string, callback: (...args: any[]) => void) => {
  const [ethereum, setEthereum] = useState<EthereumProvider | null>(null);

  useEffect(() => {
    getEthereumProvider().then(setEthereum);
  }, []);

  useEffect(() => {
    if (!ethereum) return () => {};

    ethereum.on(eventName, callback);
    return () => ethereum.off(eventName, callback);
  }, [eventName, callback, ethereum]);
};

export const useOnAccountsChanged = (callback: (accounts: string[]) => void) => {
  useWeb3Event('accountsChanged', callback);
};

export const useOnChainChanged = (callback: (chainId: string) => void) => {
  useWeb3Event('chainChanged', callback);
};
