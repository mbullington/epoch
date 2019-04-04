import { State } from "../structs";

const SMART_OBJECT: symbol = Symbol.for("smart_object");
const SMART_OBJECT_CHANGED: symbol = Symbol.for("smart_object_changed");
const SMART_OBJECT_CACHE: symbol = Symbol.for("smart_object_cache");

const SMALLEST_NUM = -9007199254740991;

export interface SmartObject {
  (obj: any): SmartObject;
}

export const SmartObject = {
  generateKey(): number {
    return Math.random() * 100;
  },
  changed(sObj: SmartObject, key: number) {
    const newValue = sObj[SMART_OBJECT];
    if (!sObj[SMART_OBJECT_CACHE]) {
      sObj[SMART_OBJECT_CACHE] = {};
    }

    if (sObj[SMART_OBJECT_CACHE][key] === undefined) {
      sObj[key] = newValue;
      return true;
    }

    return sObj[SMART_OBJECT_CACHE][key] < (sObj[SMART_OBJECT_CACHE][key] = newValue);
  },
  assign(sObj: SmartObject, objDiff: object) {
    Object.assign(sObj, objDiff);
    sObj[SMART_OBJECT] = sObj[SMART_OBJECT] + 1;
  }
};

function _createSmartObject(obj: object): SmartObject {
  const sObj = (objDiff: object): SmartObject => {
    SmartObject.assign(sObj, objDiff);
    return sObj;
  };

  Object.assign(sObj, obj);
  // smallest integer possible in JavaScript
  sObj[SMART_OBJECT] = SMALLEST_NUM;

  return sObj;
}

export function createSmartObjects(rootObj: object): State {
  const root: State = <State>rootObj;

  Object.keys(root).forEach(key => {
    root[key] = _createSmartObject(root[key]);
  });

  return root;
}