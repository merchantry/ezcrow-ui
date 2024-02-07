export const WEB3_REQUEST_SENT_EVENT = 'WEB3_REQUEST_SENT';
export const WEB3_REQUEST_COMPLETED_EVENT = 'WEB3_REQUEST_COMPLETED';

const emitRequestSentEvent = (message: string) => {
  window.dispatchEvent(new CustomEvent(WEB3_REQUEST_SENT_EVENT, { detail: message }));
};

const emitRequestComletedEvent = (message: string) => {
  window.dispatchEvent(new CustomEvent(WEB3_REQUEST_COMPLETED_EVENT, { detail: message }));
};

export const runTransaction = async <T>(callback: () => Promise<T>) => {
  emitRequestSentEvent('Sending transaction...');
  await callback();
  emitRequestComletedEvent('Transaction sent');
};
