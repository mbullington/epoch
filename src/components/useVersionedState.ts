import {useState, useEffect} from "preact/hooks";

import {StoreType} from "../store";
import VersionedState from "../store/util/VersionedState";

// My first attempt at using React Hooks.
export default function useVersionedState<T extends VersionedState>(store: StoreType, vState: T, shouldUpdate?: (vState: T) => boolean): T {
  const [globalKey] = useState(VersionedState.createGlobalKey());
  const [versionedState, setVersionedState] = useState(vState);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      if (vState.hasChanged(globalKey) && (shouldUpdate == null || shouldUpdate(vState))) {
        setVersionedState(vState);
      }
    });

    return () => unsubscribe();
  });

  return versionedState;
}