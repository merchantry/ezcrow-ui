import { useContext, useMemo } from 'react';
import { TokenAndCurrenciesDataContext } from './TokenAndCurrenciesData';
import { currencyToSymbol } from 'utils/helpers';
import { Web3DataContext } from './Web3Data';
import { useTableSearchParams } from 'utils/hooks';
import { multiplyByTenPow } from 'utils/helpers';
import { multiplyByTenPow as bigIntMultiplyByTenPow } from 'utils/bigint';
import { ROUND_TO_FIAT, ROUND_TO_TOKEN } from 'config/number';

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

  const { signer: _signer, isNetworkSupported, ...rest } = context;
  const signer = isNetworkSupported ? _signer : undefined;

  return { signer, isNetworkSupported, ...rest };
};

export const useWeb3Signer = () => {
  const { signer } = useWeb3Data();

  return signer;
};

export const useNetworkState = () => {
  const { network, setNetwork } = useWeb3Data();

  return { network, setNetwork };
};

export const useNetwork = () => {
  const { network } = useWeb3Data();

  return network;
};

export const useIsNetworkSupported = () => {
  const { isNetworkSupported, setIsNetworkSupported } = useWeb3Data();

  return { isNetworkSupported, setIsNetworkSupported };
};

export const useCurrencyDecimalsStandard = () => {
  const { currencyDecimals } = useDropdownData();
  const { currency } = useTableSearchParams();

  return (value: number) =>
    bigIntMultiplyByTenPow(
      BigInt(Math.round(multiplyByTenPow(value, ROUND_TO_FIAT))),
      BigInt(Math.round(currencyDecimals[currency] - ROUND_TO_FIAT)),
    );
};

export const useTokenDecimalsStandard = () => {
  const { tokenDecimals } = useDropdownData();
  const { token } = useTableSearchParams();

  return (value: number) =>
    bigIntMultiplyByTenPow(
      BigInt(Math.round(multiplyByTenPow(value, ROUND_TO_TOKEN))),
      BigInt(Math.round(tokenDecimals[token] - ROUND_TO_TOKEN)),
    );
};
