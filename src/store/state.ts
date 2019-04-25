import VersionedState from "./util/VersionedState";

export class TimeState extends VersionedState {
  hours: string = "00";
  minutes: string = "00";
  isEveryOtherTick: boolean = false;
}

export class BackgroundState extends VersionedState {
  dataUrl?: string;
  gradient?: [string, string];
  shadowBase?: string;
  shadows?: [string, string];
  textColor?: string;
  preload?: boolean;
}

export default interface State {
  time: TimeState,
  background: BackgroundState
}