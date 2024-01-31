import { BigNumberish, ethers } from 'ethers';
import { acceptOrder, rejectOrder } from 'requests/orders';
import { runTransaction } from 'web3/api';
import {
  getERC20Contract,
  getEzcrowRampContract,
  getFiatTokenPairHandlerContract,
} from 'web3/utils/contracts';
import { signData } from 'web3/utils/eip712';

export async function approveToken(
  token: string,
  currency: string,
  amount: BigNumberish,
  network: string,
  signer: ethers.Signer,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);

  const fiatTokenPairHandler = getFiatTokenPairHandlerContract(network, signer);
  const fiatTokenPairAddress = await fiatTokenPairHandler.getFiatTokenPairAddress(token, currency);
  const tokenAddress = await ezcrowRampContract.getTokenAddress(token);
  const tokenContract = getERC20Contract(tokenAddress, signer);

  await runTransaction(() => tokenContract.approve(fiatTokenPairAddress, amount));
}

export async function createListing(
  token: string,
  currency: string,
  action: BigNumberish,
  price: BigNumberish,
  totalTokenAmount: BigNumberish,
  minPricePerOrder: BigNumberish,
  maxPricePerOrder: BigNumberish,
  network: string,
  signer: ethers.Signer,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);

  await runTransaction(() =>
    ezcrowRampContract.createListing(
      token,
      currency,
      action,
      price,
      totalTokenAmount,
      minPricePerOrder,
      maxPricePerOrder,
    ),
  );
}

export async function updateListing(
  currentToken: string,
  currentCurrency: string,
  listingId: BigNumberish,
  token: string,
  currency: string,
  action: BigNumberish,
  price: BigNumberish,
  totalTokenAmount: BigNumberish,
  minPricePerOrder: BigNumberish,
  maxPricePerOrder: BigNumberish,
  network: string,
  signer: ethers.Signer,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);

  await runTransaction(() =>
    ezcrowRampContract.updateListing(
      currentToken,
      currentCurrency,
      listingId,
      token,
      currency,
      action,
      price,
      totalTokenAmount,
      minPricePerOrder,
      maxPricePerOrder,
    ),
  );
}

export async function deleteListing(
  token: string,
  currency: string,
  listingId: BigNumberish,
  network: string,
  signer: ethers.Signer,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);

  await runTransaction(() => ezcrowRampContract.deleteListing(token, currency, listingId));
}

export async function createOrder(
  token: string,
  currency: string,
  listingId: BigNumberish,
  amount: BigNumberish,
  network: string,
  signer: ethers.Signer,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);

  await runTransaction(() => ezcrowRampContract.createOrder(token, currency, listingId, amount));
}

async function acceptOrderSignature(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);
  const nonce = await ezcrowRampContract.nonces(signer.address);

  return signData(signer, ezcrowRampContract, {
    owner: signer.address,
    tokenSymbol: token,
    currencySymbol: currency,
    orderId,
    accept: true,
    nonce,
  });
}

export async function signAndAcceptOrder(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const { v, r, s } = await acceptOrderSignature(token, currency, orderId, network, signer);

  return acceptOrder({
    owner: signer.address,
    tokenSymbol: token,
    currencySymbol: currency,
    orderId: orderId.toString(),
    v: v.toString(),
    r,
    s,
    network,
  });
}

async function rejectOrderSignature(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);
  const nonce = await ezcrowRampContract.nonces(signer.address);

  return signData(signer, ezcrowRampContract, {
    owner: signer.address,
    tokenSymbol: token,
    currencySymbol: currency,
    orderId,
    accept: false,
    nonce,
  });
}

export async function signAndRejectOrder(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const { v, r, s } = await rejectOrderSignature(token, currency, orderId, network, signer);

  return rejectOrder({
    owner: signer.address,
    tokenSymbol: token,
    currencySymbol: currency,
    orderId: orderId.toString(),
    v: v.toString(),
    r,
    s,
    network,
  });
}

export async function acceptDispute(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);

  await runTransaction(() => ezcrowRampContract.acceptDispute(token, currency, orderId));
}

export async function rejectDispute(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);

  await runTransaction(() => ezcrowRampContract.rejectDispute(token, currency, orderId));
}
