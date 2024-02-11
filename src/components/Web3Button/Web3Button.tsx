import React, { useEffect, useMemo, useState } from 'react';

import styles from './Web3Button.module.scss';
import { useChain, useNetwork } from 'utils/web3Hooks';
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
import ButtonWithTooltip from 'components/ButtonWithTooltip';
import { getMultiOwnableContract } from 'web3/utils/contracts';

function Web3Button() {
  const chain = useChain();
  const network = useNetwork();
  const triggerAlert = useAlert();

  const { signer, setSigner, setAccountData } = useWeb3Data();

  const [isFetching, setIsFetching] = useState(false);
  const [isChainSupported, setIsChainSupported] = useState(true);

  const buttonText = useMemo(() => {
    if (!isChainSupported) return 'Unsupported Network';
    if (isFetching) return 'Connecting...';
    if (!signer) return 'Connect Wallet';
    return shortenAddress(signer.address);
  }, [isChainSupported, isFetching, signer]);

  const buttonColor = useMemo(() => {
    if (!isChainSupported) return 'error';
    return undefined;
  }, [isChainSupported]);

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
    if (!signer) return;

    const multiOwnable = getMultiOwnableContract(network, signer);
    multiOwnable.isOwner(signer.address).then(isOwner => {
      setAccountData(account => ({ ...account, isOwner }));
    });
  }, [network, setAccountData, signer]);

  useEffect(() => {
    updateWallet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useWeb3Event('accountsChanged', (accounts: string[]) => {
    if (accounts.length > 0) {
      updateWallet();
      return;
    }

    setSigner(undefined);
  });

  useWeb3Event('chainChanged', async () => {
    const ethereum = await getEthereumProvider();
    const chainId = await getChainId(ethereum);

    setIsChainSupported(chainId === chain.chainId);
  });

  return (
    <ButtonWithTooltip
      className={styles.button}
      color={buttonColor}
      onClick={connectWallet}
      tooltip={signer?.address}
      disabled={isFetching}
    >
      {buttonText}
    </ButtonWithTooltip>
  );
}

export default Web3Button;
