import {
  getCurrencySettingsContract,
  getERC20Contract,
  getEzcrowRampContract,
} from 'web3/contracts';
import route from '../utils/route';
import { getSigner } from 'api/utils/web3/provider';

type Params = {
  network: string;
};

export const handler = route.get(async ({ network }: Params) => {
  const signer = getSigner(network);
  const ezcrowRamp = getEzcrowRampContract(network, signer);

  const tokenAddresses = await ezcrowRamp.getAllTokenAddresses();
  const currencySettingsAddresses = await ezcrowRamp.getAllCurrencySettingsAdrresses();

  const tokenDecimals: Record<string, number> = {};

  for (const tokenAddress of tokenAddresses) {
    const tokenContract = getERC20Contract(tokenAddress, signer);
    const symbol = await tokenContract.symbol();
    const decimals = await tokenContract.decimals();

    tokenDecimals[symbol] = Number(decimals);
  }

  const currencyDecimals: Record<string, number> = {};

  for (const cSettingsAddress of currencySettingsAddresses) {
    const cSettingsContract = getCurrencySettingsContract(cSettingsAddress, signer);
    const symbol = await cSettingsContract.symbol();
    const decimals = await cSettingsContract.decimals();

    currencyDecimals[symbol] = Number(decimals);
  }

  return {
    tokenDecimals,
    currencyDecimals,
  };
});
