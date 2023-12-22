import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';
import { CURRENCY_OPTIONS, TOKEN_OPTIONS } from 'utils/config';
import { currencyToSymbol } from 'utils/helpers';

interface ContextDataProps {
  children: React.ReactNode;
}

type ContextData<T, ValueKey extends string, SetValueKey extends string> =
  | ({
      [key in ValueKey]: T;
    } & {
      [key in SetValueKey]: Dispatch<SetStateAction<T>>;
    })
  | null;

type DropdownData = ContextData<string[], 'availableTokens', 'setAvailableTokens'> &
  ContextData<string[], 'availableCurrencies', 'setAvailableCurrencies'>;

const DropdownDataContext = createContext<DropdownData>(null);

export const useDropdownData = () => {
  const context = useContext(DropdownDataContext);

  if (!context) {
    throw new Error('useDropdownData must be used within a DropdownDataProvider');
  }

  return context;
};

export const useFormattedDropdownData = () => {
  const { availableTokens, availableCurrencies } = useDropdownData();

  const tokenOptionsMap = useMemo(
    () => Object.fromEntries(availableTokens.map(token => [token, token])),
    [availableTokens],
  );

  const currencyOptionsMap = useMemo(
    () =>
      Object.fromEntries(
        availableCurrencies.map(currency => [
          currency,
          `${currency} ${currencyToSymbol(currency)}`,
        ]),
      ),
    [availableCurrencies],
  );

  return { tokenOptionsMap, currencyOptionsMap };
};

function ContextData({ children }: ContextDataProps) {
  const [availableTokens, setAvailableTokens] = useState<string[]>(TOKEN_OPTIONS);
  const [availableCurrencies, setAvailableCurrencies] = useState<string[]>(CURRENCY_OPTIONS);

  return (
    <DropdownDataContext.Provider
      value={{ availableTokens, setAvailableTokens, availableCurrencies, setAvailableCurrencies }}
    >
      {children}
    </DropdownDataContext.Provider>
  );
}

export default ContextData;
