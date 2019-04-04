
import { SmartObject } from "./util/smartObjects";

export interface Action {
  type: ActionType
}

export enum ActionType {
  INITIAL,
  // time
  TICK_EVERY_SECOND,
  TICK_EVERY_MINUTE,
  END_TICK_EVERY_SECOND,
  END_TICK_EVERY_MINUTE,
  // background
  UPDATE_BACKGROUND
}

export interface _Time {
  hours?: string;
  minutes?: string;
  isEveryOtherTick?: boolean;
}

export interface _Background {
  dataUrl?: string;
  gradient?: [string, string];
  shadows?: [string, string];
  textColor?: string;
  preload?: boolean;
}

export interface State {
  time: SmartObject & _Time,
  background: SmartObject & _Background
}