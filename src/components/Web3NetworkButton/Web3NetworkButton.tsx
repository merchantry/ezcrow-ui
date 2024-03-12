import React, { useMemo, useState } from 'react';

import styles from './Web3NetworkButton.module.scss';
import { useIsNetworkSupported, useNetworkState } from 'components/ContextData/hooks';
import SwitchNetworkOptions from 'components/SwitchNetworkOptions';
import { ChainName } from 'web3/types';
import BaseButton from 'components/BaseButton';
import { useWallet } from 'web3/hooks';
import { NETWORK_OPTIONS } from 'web3/config';
import chains from 'web3/chains.json';
import { useOnChainChanged } from 'utils/ethereumProviderHooks';
import { getNetworkByChainId } from 'web3/utils/network';

function Web3NetworkButton() {
  const { network, setNetwork } = useNetworkState();
  const { isNetworkSupported, setIsNetworkSupported } = useIsNetworkSupported();
  const { updateWallet } = useWallet();

  const [isHovered, setIsHovered] = useState(false);
  const [isSwitchingNetwork, setIsSwitchingNetwork] = useState(false);

  const buttonText = useMemo(() => {
    if (isHovered) return 'Switch Network';
    if (!isNetworkSupported) return 'Unsupported Network';
    return NETWORK_OPTIONS[network];
  }, [network, isNetworkSupported, isHovered]);

  const buttonColor = useMemo(() => {
    if (isHovered || isNetworkSupported) return undefined;
    return 'error';
  }, [isHovered, isNetworkSupported]);

  const onMouseOver = () => {
    setIsHovered(true);
  };

  const onMouseLeave = () => {
    setIsHovered(false);
  };

  const startSwitchNetwork = () => {
    setIsSwitchingNetwork(true);
  };

  const endSwitchNetwork = () => {
    setIsSwitchingNetwork(false);
    setIsHovered(false);
  };

  const onSwitchNetwork = async (network: ChainName) => {
    endSwitchNetwork();
    await switchNetwork(network);
  };

  const switchNetwork = async (network: ChainName) => {
    await updateWallet(chains[network]);
    setNetwork(network);
    setIsNetworkSupported(true);
  };

  useOnChainChanged(async chainId => {
    const network = getNetworkByChainId(chainId);
    if (!network) {
      setIsNetworkSupported(false);
      return;
    }
    switchNetwork(network);
  });

  if (isSwitchingNetwork) {
    return (
      <SwitchNetworkOptions onMouseLeave={endSwitchNetwork} onSwitchNetwork={onSwitchNetwork} />
    );
  }

  return (
    <BaseButton
      className={styles.button}
      color={buttonColor}
      onClick={startSwitchNetwork}
      onMouseOver={onMouseOver}
      onMouseLeave={onMouseLeave}
    >
      {buttonText}
    </BaseButton>
  );
}

export default Web3NetworkButton;
