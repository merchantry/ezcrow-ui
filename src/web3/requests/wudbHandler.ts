import { ethers } from 'ethers';
import { serializeUserData } from 'utils/userData';
import { runTransaction } from 'web3/api';
import { getWudbHandlerContract } from 'web3/utils/contracts';

export async function getUserData(
  address: string,
  currency: string,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const wudbHandler = getWudbHandlerContract(network, signer);
  const userData = await wudbHandler.getUserData(address, currency);

  return serializeUserData(userData);
}

export async function isWhitelisted(
  address: string,
  currency: string,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const wudbHandler = getWudbHandlerContract(network, signer);
  return wudbHandler.isWhitelisted(address, currency);
}

export async function updateUser(
  currency: string,
  telegramHandle: string,
  paymentMethods: string[],
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const wudbHandler = getWudbHandlerContract(network, signer);

  await runTransaction(() => wudbHandler.updateUser(currency, telegramHandle, paymentMethods));
}

export async function getAllValidPaymentMethods(network: string, signer: ethers.JsonRpcSigner) {
  const wudbHandler = getWudbHandlerContract(network, signer);
  return wudbHandler.getAllValidPaymentMethods();
}
