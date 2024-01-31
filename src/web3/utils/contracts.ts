import { ethers } from 'ethers';
import _addresses from 'web3/addresses.json';

import EzcrowRampQueryAbi from 'abi/EzcrowRampQuery.json';
import EzcrowRampAbi from 'abi/EzcrowRamp.json';
import IERC20MetaDataAbi from 'abi/IERC20MetaData.json';
import CurrencySettingsAbi from 'abi/CurrencySettings.json';
import FiatTokenPairHandlerAbi from 'abi/FiatTokenPairHandler.json';
import {
  CurrencySettingsMethods,
  ERC20Methods,
  EzcrowRampMethods,
  EzcrowRampQueryMethods,
  FiatTokenPairHandlerMethods,
} from 'web3/types';

type Address = string;

const addresses = _addresses as { [contractName: string]: { [network: string]: Address } };

export const getContractAddress = (contractName: string, network: string) => {
  return addresses[contractName][network];
};

export const getContract = <T>(address: string, abi: ethers.InterfaceAbi, signer: ethers.Signer) =>
  new ethers.Contract(address, abi, signer) as ethers.Contract & T;

const getStoredContract = <T>(
  contractName: string,
  network: string,
  abi: ethers.InterfaceAbi,
  signer: ethers.Signer,
) => getContract<T>(getContractAddress(contractName, network), abi, signer);

export const getFiatTokenPairHandlerContract = (network: string, signer: ethers.Signer) =>
  getStoredContract<FiatTokenPairHandlerMethods>(
    'FiatTokenPairHandler',
    network,
    FiatTokenPairHandlerAbi,
    signer,
  );

export const getEzcrowRampQueryContract = (network: string, signer: ethers.Signer) =>
  getStoredContract<EzcrowRampQueryMethods>('EzcrowRampQuery', network, EzcrowRampQueryAbi, signer);

export const getEzcrowRampContract = (network: string, signer: ethers.Signer) =>
  getStoredContract<EzcrowRampMethods>('EzcrowRamp', network, EzcrowRampAbi, signer);

export const getERC20Contract = (address: string, signer: ethers.Signer) =>
  getContract<ERC20Methods>(address, IERC20MetaDataAbi, signer);

export const getCurrencySettingsContract = (address: string, signer: ethers.Signer) =>
  getContract<CurrencySettingsMethods>(address, CurrencySettingsAbi, signer);
