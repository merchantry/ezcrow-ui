import { ethers } from 'ethers';

import EzcrowRampQueryAbi from 'abi/EzcrowRampQuery.json';
import EzcrowRampAbi from 'abi/EzcrowRamp.json';
import IERC20MetaDataAbi from 'abi/IERC20MetaData.json';
import CurrencySettingsAbi from 'abi/CurrencySettings.json';
import FiatTokenPairHandlerAbi from 'abi/FiatTokenPairHandler.json';
import MultiOwnableAbi from 'abi/MultiOwnable.json';
import WhitelistedUsersDatabaseHandlerAbi from 'abi/WhitelistedUsersDatabaseHandler.json';
import OrdersHandlerAbi from 'abi/OrdersHandler.json';
import {
  CurrencySettingsMethods,
  ERC20Methods,
  EzcrowRampMethods,
  EzcrowRampQueryMethods,
  FiatTokenPairHandlerMethods,
  MultiOwnableMethods,
  WhitelistedUsersDatabaseHandlerMethods,
} from 'web3/interfaces';
import { getContract, getStoredContract } from './utils/contracts';

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

export const getWudbHandlerContract = (network: string, signer: ethers.Signer) =>
  getStoredContract<WhitelistedUsersDatabaseHandlerMethods>(
    'WhitelistedUsersDatabaseHandler',
    network,
    WhitelistedUsersDatabaseHandlerAbi,
    signer,
  );

export const getMultiOwnableContract = (network: string, signer: ethers.Signer) =>
  getStoredContract<MultiOwnableMethods>('MultiOwnable', network, MultiOwnableAbi, signer);

export const getERC20Contract = (address: string, signer: ethers.Signer) =>
  getContract<ERC20Methods>(address, IERC20MetaDataAbi, signer);

export const getCurrencySettingsContract = (address: string, signer: ethers.Signer) =>
  getContract<CurrencySettingsMethods>(address, CurrencySettingsAbi, signer);

export const getOrdersHandlerContract = (address: string, signer: ethers.Signer) =>
  getContract(address, OrdersHandlerAbi, signer);
