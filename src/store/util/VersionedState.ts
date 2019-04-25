type GlobalKey = number;

const SMALLEST_NUM = -9007199254740991;

const COUNT: unique symbol = Symbol.for("VersionedState.count");
const CACHE: unique symbol = Symbol.for("VersionedState.cache");

// VersionedState is a special object that allows each accessor
// to determine if it's been modified.
//
// It accomplishes this by using two special symbols:
// - COUNT is a count that increments on each change.
// - CACHE is a Map that will hold that key's last count
//
// Isn't perfect as far as encapsulation goes, assumes
// a level of good will not to change the other properties.
export default class VersionedState {
  static createGlobalKey(): GlobalKey {
    return Math.random() * 255;
  }

  [COUNT]: number = SMALLEST_NUM;
  [CACHE]: Map<GlobalKey, number> = new Map();

  constructor(wrappedObject: object) {
    Object.assign(this, wrappedObject);
  }

  hasChanged(globalKey: GlobalKey): boolean {
    const count = this[COUNT];
    const cache = this[CACHE];

    if (!cache.has(globalKey)) {
      cache.set(globalKey, count);
      return true;
    }

    if ((cache.get(globalKey) || 0) < count) {
      cache.set(globalKey, count);
      return true;
    }

    return false;
  }

  setState(newState: object) {
    Object.assign(this, newState);
    this[COUNT]++;
  }

  clone(): this {
    return {...this};
  }
}