import {useState, useEffect} from "preact/hooks";

import {StoreType} from "../store";
import State from "../store/state";
import VersionedState from "../store/util/VersionedState";

// My first attempt at using React Hooks.
export default function useVersionedState<T extends VersionedState>(store: StoreType, func: (state: State) => T): T {
  const [globalKey] = useState(VersionedState.createGlobalKey());

  const state = store.getState();
  const [versionedState, setVersionedState] = useState(func(state));

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      const newVState = func(state);

      if (newVState.hasChanged(globalKey)) {
        setVersionedState(newVState);
      }
    });

    return () => unsubscribe();
  });

  return versionedState;
}