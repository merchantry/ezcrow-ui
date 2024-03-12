export const emitCustomEvent = (eventName: string, message?: string) => {
  window.dispatchEvent(new CustomEvent(eventName, message ? { detail: message } : undefined));
};
