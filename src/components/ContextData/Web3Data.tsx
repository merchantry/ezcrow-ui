import { JsonRpcSigner } from 'ethers';
import React, { createContext, useEffect, useState } from 'react';
import { StateContextData, StateContextDataOrUndefined } from './types';
import { Web3ContractAccountData } from 'utils/types';
import { ChainName } from 'web3/types';
import { DEFAULT_CHAIN } from 'web3/config';
import { getCurrentNetwork } from 'web3/utils/network';
import LoadingScreen from 'components/LoadingScreen';
import { getEthereumProvider, getSigner, isWalletConnected } from 'utils/ethereumProvider';

interface Web3DataProps {
  children: React.ReactNode;
}

type Web3ProfileData = StateContextDataOrUndefined<
  Web3ContractAccountData,
  'accountData',
  'setAccountData'
>;
type Web3Signer = StateContextDataOrUndefined<JsonRpcSigner, 'signer', 'setSigner'>;
type Web3Network = StateContextData<ChainName, 'network', 'setNetwork'>;
type Web3NetworkSupported = StateContextData<
  boolean,
  'isNetworkSupported',
  'setIsNetworkSupported'
>;
type Web3Data = Web3ProfileData & Web3Signer & Web3Network & Web3NetworkSupported;

export const Web3DataContext = createContext<Web3Data>(null);

function Web3Data({ children }: Web3DataProps) {
  const [accountData, setAccountData] = useState<Web3ContractAccountData>();
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [network, setNetwork] = useState<ChainName>(DEFAULT_CHAIN);
  const [isNetworkSupported, setIsNetworkSupported] = useState(true);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    getCurrentNetwork().then(async network => {
      setIsFetching(false);

      if (!network) {
        setIsNetworkSupported(false);
        return;
      }
      setNetwork(network);

      const ethereum = await getEthereumProvider();
      const walletIsConnected = await isWalletConnected(ethereum);
      if (!walletIsConnected) return;
      setSigner(await getSigner(ethereum));
    });
  }, []);

  return (
    <Web3DataContext.Provider
      value={{
        signer,
        setSigner,
        accountData,
        setAccountData,
        network,
        setNetwork,
        isNetworkSupported,
        setIsNetworkSupported,
      }}
    >
      {isFetching ? <LoadingScreen /> : children}
    </Web3DataContext.Provider>
  );
}

export default Web3Data;
