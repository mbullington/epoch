// @ts-ignore
import "../styles/extras.scss";

import {h, render} from "preact";

import Root from "./components/Root";
import {StoreType} from "./store";

export function extras(store: StoreType)  {
  // Show buttons, override style in main.scss
  const root = document.querySelector(".root")! as HTMLElement;
  root.style.display = "block";

  // Initialize Preact.
  render(<Root store={store} />, root);

  // Done.
  console.log("Extras loaded.");
};
