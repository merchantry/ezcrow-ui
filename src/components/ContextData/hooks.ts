import { useContext, useMemo } from 'react';
import { TokenAndCurrenciesDataContext } from './TokenAndCurrenciesData';
import { currencyToSymbol } from 'utils/helpers';
import { Web3DataContext } from './Web3Data';
import { useTableSearchParams } from 'utils/hooks';

export const useDropdownData = () => {
  const context = useContext(TokenAndCurrenciesDataContext);

  if (!context) {
    throw new Error('useDropdownData must be used within a DropdownDataProvider');
  }

  return context;
};

export const useFormattedDropdownData = () => {
  const { tokenDecimals, currencyDecimals } = useDropdownData();

  const tokenOptionsMap = useMemo(
    () => Object.fromEntries(Object.keys(tokenDecimals).map(token => [token, token])),
    [tokenDecimals],
  );

  const currencyOptionsMap = useMemo(
    () =>
      Object.fromEntries(
        Object.keys(currencyDecimals).map(currency => [
          currency,
          `${currency} ${currencyToSymbol(currency)}`,
        ]),
      ),
    [currencyDecimals],
  );

  return { tokenOptionsMap, currencyOptionsMap };
};

export const useWeb3Data = () => {
  const context = useContext(Web3DataContext);

  if (!context) {
    throw new Error('useWeb3Data must be used within a Web3DataProvider');
  }

  return context;
};

export const useWeb3Signer = () => {
  const { signer } = useWeb3Data();

  return signer;
};

export const useCurrencyDecimalsStandard = () => {
  const { currencyDecimals } = useDropdownData();
  const { currency } = useTableSearchParams();

  return (value: number) => BigInt(value * 10 ** currencyDecimals[currency]);
};

export const useTokenDecimalsStandard = () => {
  const { tokenDecimals } = useDropdownData();
  const { token } = useTableSearchParams();

  return (value: number) => BigInt(value * 10 ** tokenDecimals[token]);
};
