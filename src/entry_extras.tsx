// @ts-ignore
import "../styles/extras.scss";

import {h, render} from "preact";

import Root from "./components/Root";
import {StoreType} from "./store";

export function extras(store: StoreType)  {
  // Show buttons, override style in main.scss
  const root = document.querySelector(".root")! as HTMLElement;
  root.style.display = "block";

  // We can assume by this point the state
  // has the image/colors we want.
  const state = store.getState();

  // Initialize Preact.
  render(<Root background={state.background.clone()} />, root);

  // Done.
  console.log("Extras loaded.");
};
