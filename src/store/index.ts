import { createStore, applyMiddleware, Store } from "redux";
import thunk from "redux-thunk";
import localForage from "localforage";

import createActions, { Action, BackgroundAction, ActionType } from "./actions";
import State, {TimeState, BackgroundState} from "./state";

import VersionedState from "./util/VersionedState";
import createReducer, {ReducerObject} from "./util/createReducer";
import { hhmmFromDate } from "./util";

const reducerObj: ReducerObject = {
  // time
  [ActionType.TICK_EVERY_SECOND](state): State {
    state.time.setState({
      isEveryOtherTick: !state.time.isEveryOtherTick
    });

    return state;
  },
  [ActionType.TICK_EVERY_MINUTE](state): State {
    const date = new Date(Date.now());
    const [ hours, minutes ] = hhmmFromDate(date);

    state.time.setState({
      hours,
      minutes
    });

    return state;
  },
  // background
  [ActionType.UPDATE_BACKGROUND](state, action: BackgroundAction): State {
    state.background.setState({
      dataUrl: action.dataUrl,
      gradient: action.gradient,
      shadowBase: action.shadowBase,
      shadows: action.shadows,
      textColor: action.textColor,
      preload: action.preload
    });

    return state;
  }
};

export type StoreType = Store<State, Action>;
export type Store2 = [StoreType, ReturnType<typeof createActions>];

export default async function(): Promise<Store2> {
  localForage.config({
    driver: localForage.INDEXEDDB,
    name: "Epoch",
    version: 1.0,
    storeName: "background",
    description: "Holds the current background of the app"
  });

  const initial: State = {
    time: new TimeState({
      hours: "00",
      minutes: "00"
    }),
    background: new BackgroundState(
      (await localForage.getItem("background")) || {}
    )
  };

  if (initial.background.preload) {
    initial.background.setState({preload: false});
  }
  
  const store = createStore(
    createReducer(reducerObj),
    initial,
    applyMiddleware(thunk)
  );

  // Save background on update.
  const globalKey = VersionedState.createGlobalKey();
  store.subscribe(async () => {
    const state = store.getState();

    if (state.background.hasChanged(globalKey)) {
      await localForage.setItem("background", state.background);
    }
  });
  
  const actions = createActions(store);

  return [store, actions];
}