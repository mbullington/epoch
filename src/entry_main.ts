// @ts-ignore
import "../styles/main.scss";

import createStore from "./store";
import State from "./store/state";
import VersionedState from "./store/util/VersionedState";

import onDocumentReady from "./util/onDocumentReady";

const globalKey = VersionedState.createGlobalKey();

let extras: typeof import("./entry_extras") | undefined;

onDocumentReady()
.then(async () => {
  const nodes = {
    background: <HTMLElement>document.querySelector(".background")!,
    container: <HTMLElement>document.querySelector(".container")!,
    hours: <HTMLElement>document.querySelector(".hours")!,
    minutes: <HTMLElement>document.querySelector(".minutes")!
  };

  const dividerChildList = document.querySelectorAll(".divider-child")!;
  const timeList = document.querySelectorAll(".time")!;

  const [store, actions] = await createStore();

  store.subscribe(() => {
    const state: State = store.getState();

    if (state.time.hasChanged(globalKey)) {
      const { isEveryOtherTick, hours, minutes } = state.time;

      // Enable/disable divider.
      dividerChildList.forEach(el => {
        if (isEveryOtherTick && !el.classList.contains("dim")) {
          el.classList.add("dim");
        } else if (!isEveryOtherTick && el.classList.contains("dim")) {
          el.classList.remove("dim");
        }
      });

      // Update clock.
      nodes.hours.innerHTML = hours;
      nodes.minutes.innerHTML = minutes;
    }

    if (state.background.hasChanged(globalKey) && !state.background.preload) {
      const {
        dataUrl = "",
        gradient = ["transparent", "transparent"],
        shadows = ["transparent", "transparent"],
        textColor = "transparent"
      } = state.background;

      // Set background image.
      nodes.background.style.backgroundImage = `url(${dataUrl})`;
      document.body.style.opacity = "1";

      // Set container style.
      nodes.container.style.setProperty("--gradient-main", gradient[0]);
      nodes.container.style.setProperty("--gradient-secondary", gradient[1]);
      nodes.container.style.boxShadow = `0 4px 32px ${shadows[0]}, 0 32px 128px ${shadows[1]}`;

      // Set text style.
      timeList.forEach(el => (<HTMLElement>el).style.color = textColor);
      dividerChildList.forEach(el => (<HTMLElement>el).style.backgroundColor = textColor);  

      if (extras != null) {
        extras.updateColors(textColor);
      }
    }
  });

  actions.tickEveryMinute();
  actions.tickEverySecond();

  if ("registerProperty" in CSS) {
    // @ts-ignore
    CSS.registerProperty({
      name: "--gradient-main",
      syntax: "<color>",
      inherits: false,
      initialValue: "transparent"
    });

    // @ts-ignore
    CSS.registerProperty({
      name: "--gradient-secondary",
      syntax: "<color>",
      inherits: false,
      initialValue: "transparent"
    });
  }

  try {
    if (!store.getState().background.dataUrl) {
      // Didn't get it from previous session, fetch
      // it now.
      await actions.fetchBackground();
    }

    // Prefetch next background.
    actions.fetchBackground(true);
  } catch (e) {
    console.log(e);
  }

  // Load extras bundle (things like settings).
  extras = await import("./entry_extras");
  extras.extras(store.getState().background.dataUrl || '');
  extras.updateColors(store.getState().background.textColor || "transparent");
});