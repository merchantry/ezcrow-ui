import React, { useEffect, useMemo, useState } from 'react';

import BaseButton from 'components/BaseButton';

import { useChain } from 'utils/web3Hooks';
import {
  connectUserWallet,
  getChainId,
  getEthereumProvider,
  getSigner,
  isWalletConnected,
  updateChain,
} from 'utils/ethereumProvider';
import { useWeb3Data } from 'components/ContextData/hooks';
import { useAlert } from 'components/AlertContainer/AlertContainer';
import { shortenAddress } from 'utils/helpers';
import { useWeb3Event } from 'utils/ethereumProviderHooks';

function Web3Button() {
  const chain = useChain();
  const triggerAlert = useAlert();
  const { signer, setSigner } = useWeb3Data();

  const [isFetching, setIsFetching] = useState(false);
  const [isChainSupported, setIsChainSupported] = useState(true);

  const buttonText = useMemo(() => {
    if (!isChainSupported) return 'Unsupported Network';
    if (isFetching) return 'Connecting...';
    if (signer) return shortenAddress(signer.address);
    return 'Connect Wallet';
  }, [isChainSupported, isFetching, signer]);

  const connectWallet = async () => {
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
  };

  const updateWallet = async () => {
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
  };

  useEffect(() => {
    updateWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useWeb3Event('accountsChanged', (accounts: string[]) => {
    if (accounts.length > 0) updateWallet();
    else setSigner(undefined);
  });

  useWeb3Event('chainChanged', async () => {
    const ethereum = await getEthereumProvider();
    const chainId = await getChainId(ethereum);

    setIsChainSupported(chainId === chain.chainId);
    updateWallet();
  });

  return (
    <BaseButton onClick={connectWallet} disabled={isFetching}>
      {buttonText}
    </BaseButton>
  );
}

export default Web3Button;