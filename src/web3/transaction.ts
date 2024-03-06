const runAllFunctions = (fns: Array<() => unknown>) => {
  fns.forEach(fn => fn());
};

class Transaction<T> {
  private _onCompleted: Array<() => void> = [];

  private _onMined: Array<() => void> = [];

  private _onFailed: Array<() => void> = [];

  private waitCallback?: () => void;

  public run: () => Promise<void>;

  constructor(callback: () => Promise<T>, wait: (result: T) => Promise<void>) {
    this.run = async () => {
      try {
        const result = await callback();
        runAllFunctions(this._onCompleted);
        await wait(result);
        runAllFunctions(this._onMined);
        if (this.waitCallback) this.waitCallback();
      } catch (error) {
        runAllFunctions(this._onFailed);
      }
    };
  }

  public onCompleted(cb: () => void): Transaction<T> {
    this._onCompleted.push(cb);
    return this;
  }

  public onMined(cb: () => void): Transaction<T> {
    this._onMined.push(cb);
    return this;
  }

  public onFailed(cb: () => void): Transaction<T> {
    this._onFailed.push(cb);
    return this;
  }

  public then(callback: () => void): Promise<void> {
    return new Promise<void>(resolve => {
      this.waitCallback = () => {
        resolve();
      };
    }).then(callback);
  }
}

export const transaction = <T>(callback: () => Promise<T>, wait: (v: T) => Promise<void>) => {
  const tx = new Transaction(callback, wait);
  tx.run();
  return tx;
};
