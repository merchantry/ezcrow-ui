import { ContractTransactionResponse, Provider } from 'ethers';
import { TxRequest } from 'requests/types';
import { transaction } from './transaction';

export const WEB3_REQUEST_SENT_EVENT = 'WEB3_REQUEST_SENT';
export const WEB3_REQUEST_COMPLETED_EVENT = 'WEB3_REQUEST_COMPLETED';
export const WEB3_REQUEST_MINED_EVENT = 'WEB3_REQUEST_MINED';
export const WEB3_REQUEST_FAILED_EVENT = 'WEB3_REQUEST_FAILED';

const TIMEOUT = 1 * 60 * 1000;

const emitCustomEvent = (eventName: string, message: string) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail: message }));
};

const emitRequestSentEvent = (message: string) => emitCustomEvent(WEB3_REQUEST_SENT_EVENT, message);

const emitRequestComletedEvent = (message: string) =>
  emitCustomEvent(WEB3_REQUEST_COMPLETED_EVENT, message);

const emitRequestMinedEvent = (message: string) =>
  emitCustomEvent(WEB3_REQUEST_MINED_EVENT, message);

const emitRequestFailedEvent = (message: string) =>
  emitCustomEvent(WEB3_REQUEST_FAILED_EVENT, message);

const emitTransactionLifecycleEvents = <T>(
  callback: () => Promise<T>,
  wait: (v: T) => Promise<void>,
) => {
  emitRequestSentEvent('Sending transaction...');
  return transaction(callback, async v => {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject();
      }, TIMEOUT);

      wait(v)
        .then(() => {
          clearTimeout(timeout);
          resolve(undefined);
        })
        .catch(reject);
    });
  })
    .onCompleted(() => emitRequestComletedEvent('Transaction sent! Waiting for confirmation...'))
    .onMined(() => emitRequestMinedEvent('Transaction confirmed'))
    .onFailed(() => emitRequestFailedEvent('Transaction failed'));
};

export const runTransaction = (callback: () => Promise<ContractTransactionResponse>) =>
  emitTransactionLifecycleEvents(callback, async tx => {
    await tx.wait();
  });

export const sendTransactionRequest = (callback: () => Promise<TxRequest>, provider: Provider) =>
  emitTransactionLifecycleEvents(callback, async ({ txHash }) => {
    await provider.waitForTransaction(txHash);
  });
