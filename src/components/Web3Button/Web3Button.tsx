import React, { useEffect, useState } from 'react';

import BaseButton from 'components/BaseButton';

import { useChain } from 'utils/web3Hooks';
import {
  connectUserWallet,
  getEthereumProvider,
  getSigner,
  isWalletConnected,
  updateChain,
} from 'utils/ethereumProvider';
import { useWeb3Data } from 'components/ContextData/hooks';
import { useAlert } from 'components/AlertContainer/AlertContainer';
import { run, shortenAddress } from 'utils/helpers';

function Web3Button() {
  const chain = useChain();
  const triggerAlert = useAlert();
  const { signer, setSigner } = useWeb3Data();

  const [isFetching, setIsFetching] = useState(false);

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

  useEffect(() => {
    run(async () => {
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
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BaseButton onClick={connectWallet} disabled={isFetching}>
      {signer ? shortenAddress(signer.address) : 'Connect Wallet'}
    </BaseButton>
  );
}

export default Web3Button;
