import { Func2, Reducer } from "redux";

import { Action } from "../actions";
import State from "../state";

export interface ReducerObject {
  [key: string]: Func2<State, any, State>
}

export default function createReducer(object: ReducerObject): Reducer<State, Action> {
  return (state: State | undefined, action: Action): State => {
    if (state == null) {
      // @ts-ignore
      return {};
    }

    if (object[action.type]) {
      return object[action.type](state, action);
    }

    return { ...state };
  };
}