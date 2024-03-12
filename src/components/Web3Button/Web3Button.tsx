import React, { useEffect, useMemo } from 'react';

import styles from './Web3Button.module.scss';
import { useNetwork } from 'components/ContextData/hooks';
import { useWeb3Data } from 'components/ContextData/hooks';
import { shortenAddress } from 'utils/helpers';
import ButtonWithTooltip from 'components/ButtonWithTooltip';
import { getMultiOwnableContract } from 'web3/utils/contracts';
import { useWallet } from 'web3/hooks';

function Web3Button() {
  const network = useNetwork();
  const { connectWallet, isFetching } = useWallet();
  const { signer, setAccountData } = useWeb3Data();

  const buttonText = useMemo(() => {
    if (isFetching) return 'Connecting...';
    if (!signer) return 'Connect Wallet';
    return shortenAddress(signer.address);
  }, [isFetching, signer]);

  useEffect(() => {
    if (!signer) return;

    const multiOwnable = getMultiOwnableContract(network, signer);
    multiOwnable.isOwner(signer.address).then(isOwner => {
      setAccountData(account => ({ ...account, isOwner }));
    });
  }, [network, setAccountData, signer]);

  return (
    <ButtonWithTooltip
      className={styles.button}
      onClick={connectWallet}
      tooltip={signer?.address}
      disabled={isFetching}
    >
      {buttonText}
    </ButtonWithTooltip>
  );
}

export default Web3Button;
