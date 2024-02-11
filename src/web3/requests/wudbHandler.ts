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

export async function getUserPreparedData(
  currency: string,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const wudbHandler = getWudbHandlerContract(network, signer);
  const userData = await wudbHandler.getUserPreparedData(signer.address, currency);
  return serializeUserData(userData);
}

export async function getUserDataWithOrder(
  address: string,
  currency: string,
  token: string,
  orderId: number,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const wudbHandler = getWudbHandlerContract(network, signer);
  const userData = await wudbHandler.getUserDataWithOrder(address, currency, token, orderId);
  return serializeUserData(userData);
}

export async function updateUser(
  currency: string,
  telegramHandle: string,
  paymentMethod: string,
  paymentData: string,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const wudbHandler = getWudbHandlerContract(network, signer);

  await runTransaction(() =>
    wudbHandler.updateUser(currency, telegramHandle, paymentMethod, paymentData),
  );
}

export async function getAllValidPaymentMethods(network: string, signer: ethers.JsonRpcSigner) {
  const wudbHandler = getWudbHandlerContract(network, signer);
  return wudbHandler.getAllValidPaymentMethods();
}
