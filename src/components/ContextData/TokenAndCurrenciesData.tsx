import React, { createContext, useEffect, useState } from 'react';
import { getTokenAndCurrenciesData } from 'requests/meta';
import { run } from 'utils/helpers';
import { ContextData } from './types';
import { useNetwork } from 'utils/web3Hooks';

interface TokenAndCurrenciesDataProps {
  children: React.ReactNode;
}

type DecimalsData = Record<string, number>;

type TokenAndCurrenciesData = ContextData<DecimalsData, 'tokenDecimals'> &
  ContextData<DecimalsData, 'currencyDecimals'>;

export const TokenAndCurrenciesDataContext = createContext<TokenAndCurrenciesData>(null);

function TokenAndCurrenciesData({ children }: TokenAndCurrenciesDataProps) {
  const network = useNetwork();

  const [tokenDecimals, setTokenDecimals] = useState<DecimalsData>({});
  const [currencyDecimals, setCurrencyDecimals] = useState<DecimalsData>({});

  useEffect(() => {
    run(async () => {
      const { tokenDecimals, currencyDecimals } = await getTokenAndCurrenciesData(network);

      setTokenDecimals(tokenDecimals);
      setCurrencyDecimals(currencyDecimals);
    });
  }, [network]);

  return (
    <TokenAndCurrenciesDataContext.Provider value={{ tokenDecimals, currencyDecimals }}>
      {children}
    </TokenAndCurrenciesDataContext.Provider>
  );
}

export default TokenAndCurrenciesData;
