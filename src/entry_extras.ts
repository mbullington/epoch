// @ts-ignore
import "../styles/extras.scss";

import {MDCRipple} from "@material/ripple";

import loadImage from "./graphics/loadImage";
import {toDataUrl} from "./graphics/CanvasImage";

import saveDataUrl from "./util/saveDataUrl";

export function extras(dataUrl: string)  {
  console.log("Extras loaded.");

  // Show buttons, override style in main.scss
  const buttonList = document.querySelector(".buttons");

  if (buttonList instanceof HTMLElement) {
    buttonList.style.display = "block";
  }

  const heart = document.querySelector("#heart");
  if (heart instanceof HTMLElement) {
    const heartRipple = new MDCRipple(heart);
    heartRipple.unbounded = true;
  }

  const download = document.querySelector("#download");
  if (download instanceof HTMLElement) {
    const downloadRipple = new MDCRipple(download);
    downloadRipple.unbounded = true;

    download.addEventListener("mousedown", async () => {
      // Currently this is a terrible use of resources
      // but it's not a critical op so whatever.
      const pngUrl = toDataUrl(await loadImage(dataUrl), "png");
      saveDataUrl(pngUrl, "Epoch_Image.png");
    });
  }

  const settings = document.querySelector("#settings");
  if (settings instanceof HTMLElement) {
    const settingsRipple = new MDCRipple(settings);
    settingsRipple.unbounded = true;
  }
};

export function updateColors(textColor: string) {
  const buttonList = document.querySelector(".buttons");
  if (buttonList instanceof HTMLElement) {
    let bgColor;
    switch (textColor) {
      case "transparent":
        bgColor = "transparent";
        break;
      case "#fff":
        bgColor = "rgba(0,0,0,0.3)";
        break;
      case "#000":
      default:
        bgColor = rgba(255,255,255,0.2);
        break;
    }

    buttonList.style.backgroundColor = bgColor;
    buttonList.style.color = textColor;
  }
}