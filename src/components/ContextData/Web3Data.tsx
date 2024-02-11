import { JsonRpcSigner } from 'ethers';
import React, { createContext, useState } from 'react';
import { StateContextData } from './types';
import { Web3ContractAccountData } from 'utils/types';

interface Web3DataProps {
  children: React.ReactNode;
}

type Web3ProfileData = StateContextData<Web3ContractAccountData, 'accountData', 'setAccountData'>;
type Web3Signer = StateContextData<JsonRpcSigner, 'signer', 'setSigner'>;
type Web3Data = Web3ProfileData & Web3Signer;

export const Web3DataContext = createContext<Web3Data>(null);

function Web3Data({ children }: Web3DataProps) {
  const [accountData, setAccountData] = useState<Web3ContractAccountData>();
  const [signer, setSigner] = useState<JsonRpcSigner>();

  return (
    <Web3DataContext.Provider value={{ signer, setSigner, accountData, setAccountData }}>
      {children}
    </Web3DataContext.Provider>
  );
}

export default Web3Data;
