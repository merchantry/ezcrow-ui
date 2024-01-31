import { ContractTransactionResponse } from 'ethers';

const WEB3_REQUEST_SENT_EVENT = 'web3RequestSent';
const WEB3_REQUEST_COMPLETED_EVENT = 'web3RequestCompleted';

const emitRequestSentEvent = (message: string) => {
  window.dispatchEvent(new CustomEvent(WEB3_REQUEST_SENT_EVENT, { detail: message }));
};

const emitRequestComletedEvent = (message: string) => {
  window.dispatchEvent(new CustomEvent(WEB3_REQUEST_COMPLETED_EVENT, { detail: message }));
};

export const runTransaction = async (callback: () => Promise<ContractTransactionResponse>) => {
  emitRequestSentEvent('Sending transaction...');
  await callback();
  emitRequestComletedEvent('Transaction sent');
};
