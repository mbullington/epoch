import BackgroundImage from "../graphics/BackgroundImage";
import { everySecond, everyMinute } from "./util/time";

import { Action, ActionType } from "./structs";

import { Store, bindActionCreators } from "redux";

let _everySecond = false;
let _everyMinute = false;

export const actionTypes = {
  // time/tick thunks
  tickEverySecond() {
    _everySecond = true;
    return dispatch => {
      const cancel = everySecond(() => {
        if (!_everySecond) {
          cancel();
          return;
        }

        dispatch(<Action>{ type: ActionType.TICK_EVERY_SECOND });
      });

      dispatch(<Action>{ type: ActionType.TICK_EVERY_SECOND });
    };
  },
  tickEveryMinute() {
    _everyMinute = true;
    return dispatch => {
      const cancel = everyMinute(() => {
        if (!_everyMinute) {
          cancel();
          return;
        }

        dispatch(<Action>{ type: ActionType.TICK_EVERY_MINUTE });
      });

      dispatch(<Action>{ type: ActionType.TICK_EVERY_MINUTE });
    };
  },
  endTickEverySecond() {
    _everySecond = false;
    return <Action>{
      type: ActionType.END_TICK_EVERY_SECOND
    };
  },
  endTickEveryMinute() {
    _everyMinute = false;
    return <Action>{
      type: ActionType.END_TICK_EVERY_MINUTE
    };
  },
  // background thunk
  fetchBackground(preload?: boolean) {
    return async dispatch => {
      const bg: BackgroundImage = await BackgroundImage.fetch();

      await dispatch(actionTypes.updateBackground(bg, preload));
    };
  },
  // background action creators
  updateBackground(bg: BackgroundImage, preload?: boolean) {
    return <Action>{
      type: ActionType.UPDATE_BACKGROUND,
      dataUrl: bg.dataUrl,
      gradient: bg.getGradientColors(),
      shadows: bg.getShadowColors(),
      textColor: bg.getTextColor(),
      preload: !!preload
    }
  }
};

export function createActionCreators(store: Store<any>) {
  return bindActionCreators(actionTypes, store.dispatch.bind(store));
};