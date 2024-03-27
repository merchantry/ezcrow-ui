import { ethers } from 'ethers';
import _addresses from 'web3/addresses.json';

type Address = string;

const addresses = _addresses as { [contractName: string]: { [network: string]: Address } };

export const getContractAddress = (contractName: string, network: string) => {
  return addresses[contractName][network];
};

export const getContract = <T>(address: string, abi: ethers.InterfaceAbi, signer: ethers.Signer) =>
  new ethers.Contract(address, abi, signer) as ethers.Contract & T;

export const getStoredContract = <T>(
  contractName: string,
  network: string,
  abi: ethers.InterfaceAbi,
  signer: ethers.Signer,
) => getContract<T>(getContractAddress(contractName, network), abi, signer);
