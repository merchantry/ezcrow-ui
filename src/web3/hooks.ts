import { useNetwork, useWeb3Data } from 'components/ContextData/hooks';
import chains from './chains.json';
import {
  connectUserWallet,
  getEthereumProvider,
  getSigner,
  isWalletConnected,
  updateChain,
} from 'utils/ethereumProvider';
import { useCallback, useState } from 'react';
import { useAlert } from 'components/AlertContainer/hooks';
import { useOnAccountsChanged } from 'utils/ethereumProviderHooks';
import { Chain } from './types';

export const useChain = () => {
  const network = useNetwork();

  return chains[network];
};

export const useWallet = () => {
  const chain = useChain();
  const triggerAlert = useAlert();
  const { setSigner } = useWeb3Data();

  const [isFetching, setIsFetching] = useState(false);

  const connectWallet = useCallback(async () => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const ethereum = await getEthereumProvider();
      await connectUserWallet(ethereum, chain);

      setSigner(await getSigner(ethereum));
      triggerAlert('Wallet connected successfully', 'success');
    } catch (error) {
      triggerAlert((error as Error).message, 'error');
    }

    setIsFetching(false);
  }, [chain, setSigner, triggerAlert, isFetching]);

  const updateWallet = useCallback(
    async (chain: Chain) => {
      if (isFetching) return;

      try {
        const ethereum = await getEthereumProvider();
        const walletIsConnected = await isWalletConnected(ethereum);
        if (!walletIsConnected) return;
        setIsFetching(true);

        await updateChain(ethereum, chain);

        setSigner(await getSigner(ethereum));
      } catch (error) {
        console.error(error);
      }

      setIsFetching(false);
    },
    [setSigner, isFetching],
  );

  useOnAccountsChanged(accounts => {
    if (accounts.length > 0) {
      updateWallet(chain);
      return;
    }

    setSigner(undefined);
  });

  return { connectWallet, updateWallet, isFetching };
};
