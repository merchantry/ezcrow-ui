import api from './api';

type TokenAndCurrencyData = {
  tokenDecimals: Record<string, number>;
  currencyDecimals: Record<string, number>;
};

export async function getTokenAndCurrenciesData(network: string): Promise<TokenAndCurrencyData> {
  return api.get('tokensCurrenciesData', { network });
}
