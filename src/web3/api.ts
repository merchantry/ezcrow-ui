import { randomInt } from 'utils/random';

const simulateDelay = <T>(v: T) =>
  new Promise(resolve => {
    setTimeout(
      () => {
        resolve(v);
      },
      randomInt(100, 1000),
    );
  }) as Promise<T>;

const emitRequestSentEvent = (message: string) => {
  window.dispatchEvent(new CustomEvent(api.WEB3_REQUEST_SENT_EVENT, { detail: message }));
};

const emitRequestComletedEvent = (message: string) => {
  window.dispatchEvent(new CustomEvent(api.WEB3_REQUEST_COMPLETED_EVENT, { detail: message }));
};

const api = {
  WEB3_REQUEST_SENT_EVENT: 'web3RequestSent',
  WEB3_REQUEST_COMPLETED_EVENT: 'web3RequestCompleted',

  async get(contractAddress: string, method: string, args: unknown[]) {
    return simulateDelay(
      `Pretending to get data from ${contractAddress} with method ${method} and args ${args}`,
    );
  },

  async sendTransaction(contractAddress: string, method: string, args: unknown[]) {
    emitRequestSentEvent(
      `Sending transaction to ${contractAddress} with method ${method} and args ${args}`,
    );
    const data = await simulateDelay(
      `Pretending to send transaction to ${contractAddress} with method ${method} and args ${args}`,
    );

    emitRequestComletedEvent(data);
    return data;
  },
};

export default api;
