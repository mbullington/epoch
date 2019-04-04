import { createActionCreators } from "./actionCreators";
import { createSmartObjects } from "./util/smartObjects";

import createReducer from "./util/_createReducer";
import { hydrate, createStorageContainers } from "./util/hydrate";

import { Action, ActionType, State } from "./structs";

import { hhmmFromDate } from "./util/time";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

const reducerMap = {
  // time
  [ActionType.TICK_EVERY_SECOND](state, action) {
    state.time({
      isEveryOtherTick: !state.time.isEveryOtherTick
    });

    return state;
  },
  [ActionType.TICK_EVERY_MINUTE](state, action) {
    const date = new Date(Date.now());
    const [ hours, minutes ] = hhmmFromDate(date);

    state.time({
      hours,
      minutes
    });

    return state;
  },
  // background
  [ActionType.UPDATE_BACKGROUND](state, action) {
    state.background({
      dataUrl: action.dataUrl,
      gradient: action.gradient,
      shadows: action.shadows,
      textColor: action.textColor,
      preload: action.preload
    });

    return state;
  },
  // initial
  [ActionType.INITIAL](state, action) {
    return hydrate(
      createSmartObjects({
        time: {
          hours: "00",
          minutes: "00"
        },
        background: {
        }
      }),
      {
        background(obj: any) { }
      }
    );
  }
};

export const store = createStore(
  createReducer(reducerMap),
  applyMiddleware(thunk)
);

store.subscribe(
  createStorageContainers(store, {
    background(obj: any): boolean {
      if (!obj.preload) {
        return false;
      }

      // make sure we can load the next image
      obj.preload = false;

      return true;
    }
  })
);

export const actions = createActionCreators(store);