import { State, Action, ActionType } from "../structs";

import { Func2 } from "redux";

export default function createReducer(map: any): Func2<State,Action,State> {
  return function(state: State, action: Action) {
    if (map[action.type]) {
      let actionType = action.type;
      while (parseInt(map[actionType]) === map[actionType]) {
        actionType = map[actionType];
      }

      return map[actionType](state, action);
    }

    if (map[ActionType.INITIAL]) {
      return map[ActionType.INITIAL](state, action);
    }

    return { ...state };
  }
}