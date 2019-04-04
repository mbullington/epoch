import { resolveImmediate } from "../../util/okComputer";

export default class StorageContainer {
  prefix: string;

  obj: object;
  _obj: object;

  _saveLater: Promise<any>;

  constructor(prefix: string) {
    // just in case, doesn't hurt anything
    prefix = `$${prefix}`;
    this.prefix = prefix;

    // save empty object if there isn't a local storage entry
    this.load() || this.save((this._obj = {}));

    const self = this;
    const handler: ProxyHandler<any> = {
      set(target: any, prop: string, value: any) {
        target[prop] = value;
        self.saveLater();
        return true;
      }
    };

    // automatically queues save on property set
    this.obj = new Proxy(this._obj, handler);
  }

  load(): object {
    if (this._obj) {
      return { ...this._obj };
    }

    return localStorage[this.prefix] ? { ...(this._obj = JSON.parse(localStorage[this.prefix])) } : undefined;
  }

  save(exp?: any): object {
    localStorage[this.prefix] = JSON.stringify(this._obj);
    return { ...this._obj };
  }

  // coalesces save until later so we can call save multiple times
  // in succession, i.e. with proxies
  // also allows us to wait async until calls are made,
  // like ones for invalidation
  saveLater(): Promise<any> {
    if (!this._saveLater) {
      this._saveLater = resolveImmediate(() => {
        this.save();
        this._saveLater = null;
      });
    }

    return this._saveLater;
  }
}