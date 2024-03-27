import { useNetwork, useWeb3Data, useWeb3Signer } from 'components/ContextData/hooks';
import chains from './chains.json';
import {
  connectUserWallet,
  getEthereumProvider,
  getSigner,
  isWalletConnected,
  updateChain,
} from 'utils/ethereumProvider';
import { useCallback, useEffect, useState } from 'react';
import { useAlert } from 'components/AlertContainer/hooks';
import { useOnAccountsChanged } from 'utils/ethereumProviderHooks';
import { Chain } from './types';
import { Contract } from 'ethers';
import { getFiatTokenPairHandlerContract, getOrdersHandlerContract } from './contracts';
import { run } from 'utils/helpers';
import { useTableSearchParams } from 'utils/hooks';

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

export const useOnContractEvent = (
  contract: Contract | undefined,
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (...args: any[]) => void,
) => {
  useEffect(() => {
    if (!contract) return;
    contract.on(eventName, handler);
    return () => {
      contract.off(eventName, handler);
    };
  }, [contract, eventName, handler]);
};

export const useOnOrderHandlerEvent = (eventName: string, handler: (id: bigint) => void) => {
  const network = useNetwork();
  const signer = useWeb3Signer();
  const { token, currency } = useTableSearchParams();

  const [ordersHandler, setOrdersHandler] = useState<Contract | undefined>();

  useEffect(() => {
    if (!signer) return;

    run(async () => {
      const ftph = getFiatTokenPairHandlerContract(network, signer);
      const ordersHandlerAddress = await ftph.getOrdersHandler(token, currency);

      setOrdersHandler(getOrdersHandlerContract(ordersHandlerAddress, signer));
    });
  }, [currency, network, signer, token]);

  useOnContractEvent(ordersHandler, eventName, handler);
};

export const useOnOrderAccepted = (handler: (id: bigint) => void) => {
  useOnOrderHandlerEvent('OrderAccepted', handler);
};

export const useOnOrderRejected = (handler: (id: bigint) => void) => {
  useOnOrderHandlerEvent('OrderRejected', handler);
};
