export default class Resolver<T> {
  _isResolved: boolean;
  _promise: Promise<T>;

  get isResolved(): boolean {
    return this._isResolved;
  }

  get promise(): Promise<T> {
    return this._promise;
  }

  _resolve: (value?: T) => void;
  _reject: (err?: any) => void;

  constructor() {
    this._promise = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  resolve(value?: T) {
    this._isResolved = true;
    if (this._resolve) {
      this._resolve(value);
    }
  }

  reject(err?: any) {
    this._isResolved = true;
    if (this._reject) {
      this._reject(err);
    }
  }
}
