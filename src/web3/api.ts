import { ContractTransactionResponse } from 'ethers';

export const WEB3_REQUEST_SENT_EVENT = 'WEB3_REQUEST_SENT';
export const WEB3_REQUEST_COMPLETED_EVENT = 'WEB3_REQUEST_COMPLETED';
export const WEB3_REQUEST_MINED_EVENT = 'WEB3_REQUEST_MINED';
export const WEB3_REQUEST_FAILED_EVENT = 'WEB3_REQUEST_FAILED';

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

export const runTransaction = async (callback: () => Promise<ContractTransactionResponse>) => {
  emitRequestSentEvent('Sending transaction...');
  try {
    const tx = await callback();
    emitRequestComletedEvent('Transaction sent');
    await tx.wait();
    emitRequestMinedEvent('Transaction mined');
  } catch (error) {
    emitRequestFailedEvent('Transaction failed');
  }
};

export const sendRequest = async <T>(callback: () => Promise<T>) => {
  emitRequestSentEvent('Sending transaction...');
  try {
    await callback();
    emitRequestComletedEvent('Transaction sent');
  } catch (error) {
    emitRequestFailedEvent('Transaction failed');
  }
};
