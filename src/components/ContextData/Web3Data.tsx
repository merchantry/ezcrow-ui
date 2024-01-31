import { JsonRpcSigner } from 'ethers';
import React, { Dispatch, SetStateAction, createContext, useState } from 'react';

interface Web3DataProps {
  children: React.ReactNode;
}

type StateContextData<T, ValueKey extends string, SetValueKey extends string> =
  | ({
      [key in ValueKey]: T | undefined;
    } & {
      [key in SetValueKey]: Dispatch<SetStateAction<T | undefined>>;
    })
  | null;

type Web3Data = StateContextData<JsonRpcSigner, 'signer', 'setSigner'>;

export const Web3DataContext = createContext<Web3Data>(null);

function Web3Data({ children }: Web3DataProps) {
  const [signer, setSigner] = useState<JsonRpcSigner>();

  return (
    <Web3DataContext.Provider value={{ signer, setSigner }}>{children}</Web3DataContext.Provider>
  );
}

export default Web3Data;
