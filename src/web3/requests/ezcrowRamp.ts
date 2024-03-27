import { BigNumberish, ethers } from 'ethers';
import { acceptOrder, createOrder, rejectOrder } from 'requests/orders';
import { runTransaction, sendTransactionRequest } from 'web3/api';
import {
  getERC20Contract,
  getEzcrowRampContract,
  getFiatTokenPairHandlerContract,
} from 'web3/contracts';
import { signData } from 'web3/utils/eip712';
import types from 'web3/utils/eip712-types';

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

export function signAndCreateOrder(
  token: string,
  currency: string,
  listingId: BigNumberish,
  tokenAmount: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  return sendTransactionRequest(async () => {
    const ezcrowRampContract = getEzcrowRampContract(network, signer);
    const nonce = await ezcrowRampContract.nonces(signer.address);
    const { OrderCreatePermit } = types;

    const { v, r, s } = await signData(
      signer,
      ezcrowRampContract,
      { OrderCreatePermit },
      {
        owner: signer.address,
        tokenSymbol: token,
        currencySymbol: currency,
        listingId: listingId.toString(),
        tokenAmount: tokenAmount.toString(),
        nonce,
      },
    );

    return createOrder({
      owner: signer.address,
      tokenSymbol: token,
      currencySymbol: currency,
      listingId: listingId.toString(),
      tokenAmount: tokenAmount.toString(),
      v: v.toString(),
      r,
      s,
      network,
    });
  }, signer.provider);
}

export function signAndAcceptOrder(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  return sendTransactionRequest(async () => {
    const ezcrowRampContract = getEzcrowRampContract(network, signer);
    const nonce = await ezcrowRampContract.nonces(signer.address);
    const { OrderActionPermit } = types;
    const { v, r, s } = await signData(
      signer,
      ezcrowRampContract,
      { OrderActionPermit },
      {
        owner: signer.address,
        tokenSymbol: token,
        currencySymbol: currency,
        orderId,
        accept: true,
        nonce,
      },
    );

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
  }, signer.provider);
}

export function signAndRejectOrder(
  token: string,
  currency: string,
  orderId: BigNumberish,
  network: string,
  signer: ethers.JsonRpcSigner,
) {
  const ezcrowRampContract = getEzcrowRampContract(network, signer);
  return sendTransactionRequest(async () => {
    const nonce = await ezcrowRampContract.nonces(signer.address);
    const { OrderActionPermit } = types;

    const { v, r, s } = await signData(
      signer,
      ezcrowRampContract,
      { OrderActionPermit },
      {
        owner: signer.address,
        tokenSymbol: token,
        currencySymbol: currency,
        orderId,
        accept: false,
        nonce,
      },
    );

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
  }, signer.provider);
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
