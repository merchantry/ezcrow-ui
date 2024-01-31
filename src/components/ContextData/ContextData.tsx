import React from 'react';
import TokenAndCurrenciesData from './TokenAndCurrenciesData';
import Web3Data from './Web3Data';

interface ContextDataProps {
  children: React.ReactNode;
}

function ContextData({ children }: ContextDataProps) {
  return (
    <Web3Data>
      <TokenAndCurrenciesData>{children}</TokenAndCurrenciesData>
    </Web3Data>
  );
}

export default ContextData;
