// @ts-ignore
import "../styles/main.scss";

import resolveImmediate from "util/resolveImmediate";

import { actions, store } from "./state";
import { State } from "./state/structs";
import { wasHydrated } from "./state/util/hydrate";
import { SmartObject } from "./state/util/smartObjects";

function onLoad() {
  const background = <HTMLElement>document.querySelector(".background")!;
  const container = <HTMLElement>document.querySelector(".container")!;
  
  const dividerChildList = document.querySelectorAll(".divider-child")!;
  const timeList = document.querySelectorAll(".time")!;

  const divHours = <HTMLElement>document.querySelector(".hours")!;
  const divMinutes = <HTMLElement>document.querySelector(".minutes")!;

  const randomKey = SmartObject.generateKey();

  store.subscribe(() => {
    const state: State = store.getState();

    if (SmartObject.changed(state.time, randomKey)) {
      const { isEveryOtherTick, hours, minutes } = state.time;

      // update divider

      dividerChildList.forEach(el => {
        // add dimming
        if (!!isEveryOtherTick && !el.classList.contains("dim")) {
          el.classList.add("dim");
        }
      
        // disable dimming
        if (!isEveryOtherTick && el.classList.contains("dim")) {
          el.classList.remove("dim");
        }
      });

      // update clock
  
      divHours.innerHTML = hours;
      divMinutes.innerHTML = minutes;
    }

    if (SmartObject.changed(state.background, randomKey) && !state.background.preload) {
      const { dataUrl, gradient, shadows, textColor } = state.background;

      // set background image
      background.style.backgroundImage = `url(${dataUrl})`;
      document.body.style.opacity = "1";

      // set container style

      container.style.setProperty("--gradient-main", gradient[0]);
      container.style.setProperty("--gradient-secondary", gradient[1]);

      container.style.boxShadow = `0 4px 32px ${shadows[0]}, 0 32px 128px ${shadows[1]}`;

      // set text style

      timeList.forEach(el => (<HTMLElement>el).style.color = textColor);
      dividerChildList.forEach(el => (<HTMLElement>el).style.backgroundColor = textColor);  
    }
  });

  resolveImmediate(async () => {
    try {
      if (!wasHydrated(store.getState().background)) {
        await actions.fetchBackground();
      }
  
      // prefetch for next time
      await actions.fetchBackground(true);
    } catch (e) {
      console.log(e);
    }
  });

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

  actions.tickEveryMinute();
  actions.tickEverySecond();

  // load extras
  import("./entry_extras").then(module => module.main());

  // @ts-ignore
  require.ensure(["./entry_extras"], function(require) { console.log("loaded extras!"); require("./entry_extras"); }, error => {}, "extras");
}

window.addEventListener("load", () => {
  resolveImmediate(onLoad);
});