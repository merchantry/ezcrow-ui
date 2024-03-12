import React, { createContext, useEffect, useState } from 'react';
import { getTokenAndCurrenciesData } from 'requests/meta';
import { run } from 'utils/helpers';
import { ContextData } from './types';
import LoadingScreen from 'components/LoadingScreen';
import { useNetwork } from './hooks';

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
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    run(async () => {
      const { tokenDecimals, currencyDecimals } = await getTokenAndCurrenciesData(network);

      setTokenDecimals(tokenDecimals);
      setCurrencyDecimals(currencyDecimals);
      setIsFetching(false);
    });
  }, [network]);

  return (
    <TokenAndCurrenciesDataContext.Provider value={{ tokenDecimals, currencyDecimals }}>
      {isFetching ? <LoadingScreen /> : children}
    </TokenAndCurrenciesDataContext.Provider>
  );
}

export default TokenAndCurrenciesData;
