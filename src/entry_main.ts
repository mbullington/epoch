// @ts-ignore
import "../styles/main.scss";

import createStore from "./store";
import State from "./store/state";
import VersionedState from "./store/util/VersionedState";

import onDocumentReady from "./util/onDocumentReady";

const globalKey = VersionedState.createGlobalKey();

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
        shadowBase = "black",
        shadows = ["transparent", "transparent"],
        textColor = "transparent"
      } = state.background;

      // Set background image.
      nodes.background.style.backgroundImage = `url(${dataUrl})`;
      document.body.style.opacity = "1";

      // Set body style.
      const body = document.body;
  
      body.style.setProperty("--gradient-main", gradient[0]);
      body.style.setProperty("--gradient-secondary", gradient[1]);

      body.style.setProperty("--shadow-base", shadowBase);
      body.style.setProperty("--shadow-main", shadows[0]);
      body.style.setProperty("--shadow-secondary", shadows[1]);

      // Set text style.
      timeList.forEach(el => (<HTMLElement>el).style.color = textColor);
      dividerChildList.forEach(el => (<HTMLElement>el).style.backgroundColor = textColor);  
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

    // @ts-ignore
    CSS.registerProperty({
      name: "--shadow-base",
      syntax: "<color>",
      inherits: false,
      initialValue: "black"
    });

    // @ts-ignore
    CSS.registerProperty({
      name: "--shadow-main",
      syntax: "<color>",
      inherits: false,
      initialValue: "transparent"
    });

    // @ts-ignore
    CSS.registerProperty({
      name: "--shadow-secondary",
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
  const extras = await import("./entry_extras");
  extras.extras(store);
});