import { State } from "../structs";
import { SmartObject } from "./smartObjects";
import StorageContainer from "./StorageContainer";

import { Store } from "redux";

const IS_HYDRATED = Symbol.for("is_hydrated");
const INVALIDATE_KEY = '@@invalidate';

const randomKey = SmartObject.generateKey();

export function wasHydrated(obj: SmartObject): boolean {
  return !!obj[IS_HYDRATED];
}

const storageContainers: { [key: string]: StorageContainer } = {};
export function hydrate(state: State, smartObjects: { [key: string]: (a: any) => void }): State {
  const keys = Object.keys(smartObjects);
  let i = 0, length = keys.length;
  for (; i < length; i++) {
    const name: string = keys[i];
    storageContainers[name] = new StorageContainer(name);

    const obj: SmartObject = state[name];
    const storage = storageContainers[name].obj;

    // it's invalidated, don't try to hydrate
    if (!!storage[INVALIDATE_KEY]) {
      continue;
    }

    let hydrated = false;
    Object.keys(storage).forEach(prop => {
      if (!!storage[prop]) {
        hydrated = true;
        obj[prop] = storage[prop];
      }
    });

    if (hydrated) {
      console.log("hydrated @" + name);
      obj[IS_HYDRATED] = true;
    }

    smartObjects[name](obj);
    // make sure to update smart object
    obj({});
  }

  return state;
}

export function createStorageContainers(store: Store<State>, smartObjects: { [key: string]: (a: any) => void|boolean }): () => void {
  const func = async () => {
    const state = store.getState();

    const keys = Object.keys(smartObjects);
    let i = 0, length = keys.length;
    for (; i < length; i++) {
      const name: string = keys[i];
      const obj: SmartObject = state[name];

      if (!SmartObject.changed(obj, randomKey)) {
        continue;
      }

      const container = storageContainers[name];
      const storage = container.obj;

      const serialized = { ...state[name] };
      if (smartObjects[name](serialized) === false) {
        continue;
      }

      storage[INVALIDATE_KEY] = true;

      await container.saveLater();

      Object.keys(serialized).forEach(prop => {
        storage[prop] = serialized[prop];
      });

      await container.saveLater();

      storage[INVALIDATE_KEY] = false;
    }
  };

  func();

  return func;
}