import { Store, bindActionCreators } from "redux";

import BackgroundImage from "../graphics/BackgroundImage";
import { everySecond, everyMinute } from "./timing";

export interface Action {
  type: ActionType
}

export interface BackgroundAction extends Action {
  dataUrl: string;
  gradient: [string, string];
  shadowBase: string;
  shadows: [string, string];
  textColor: string;
  preload: boolean;
}

export enum ActionType {
  // Time based.
  TICK_EVERY_SECOND,
  TICK_EVERY_MINUTE,
  RESET_EVERY_SECOND,
  RESET_EVERY_MINUTE,
  // Background.
  UPDATE_BACKGROUND
}

let resetSecondTick = false;
let resetMinuteTick = false;

export const actions = {
  // Thunks for time tracking.
  tickEverySecond() {
    return (dispatch: Function) => {
      const cancel = everySecond(() => {
        if (resetSecondTick) {
          resetSecondTick = false;
          cancel();
          return;
        }

        dispatch(<Action>{ type: ActionType.TICK_EVERY_SECOND });
      });

      dispatch(<Action>{ type: ActionType.TICK_EVERY_SECOND });
    };
  },
  tickEveryMinute() {
    return (dispatch: Function) => {
      const cancel = everyMinute(() => {
        if (resetMinuteTick) {
          resetMinuteTick = false;
          cancel();
          return;
        }

        dispatch(<Action>{ type: ActionType.TICK_EVERY_MINUTE });
      });

      dispatch(<Action>{ type: ActionType.TICK_EVERY_MINUTE });
    };
  },
  endTickEverySecond() {
    resetSecondTick = true;
    return <Action>{
      type: ActionType.RESET_EVERY_SECOND
    };
  },
  endTickEveryMinute() {
    resetMinuteTick = true;
    return <Action>{
      type: ActionType.RESET_EVERY_MINUTE
    };
  },
  // Thunk for fetching the background.
  fetchBackground(preload?: boolean) {
    return async (dispatch: Function) => {
      const bg: BackgroundImage = await BackgroundImage.fetch();

      await dispatch(<BackgroundAction>{
        type: ActionType.UPDATE_BACKGROUND,
        dataUrl: bg.dataUrl,
        gradient: bg.getGradientColors(),
        shadowBase: bg.getShadowBaseColor(),
        shadows: bg.getShadowColors(),
        textColor: bg.getTextColor(),
        preload
      });
    };
  }
};

export default function createActions(store: Store<any>) {
  return bindActionCreators(actions, store.dispatch.bind(store));
};