import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import Settings from "./Settings";
import MDCIconButton from "./MDCIconButton";
import useVersionedState from "./useVersionedState";

import { StoreType } from "../store";

import loadImage from "../graphics/loadImage";
import { toDataUrl } from "../graphics/CanvasImage";

import saveDataUrl from "../util/saveDataUrl";

function getButtonsClass(textColor: string): string {
  switch (textColor) {
    case "transparent":
      return "";
    case "#fff":
      return "black";
    case "#000":
    default:
      return "white";
  }
};

interface Props {
  store: StoreType;
}

export default function Root({ store }: Props) {
  const [visible, setVisible] = useState(false);
  const background = useVersionedState(
    store,
    store.getState().background,
    background => background.preload !== true
  );

  const {
    dataUrl = "",
    textColor = "transparent"
  } = background;

  const buttonsClass = ["buttons", getButtonsClass(textColor)].join(" ");

  async function onDownload() {
    // Currently this is a terrible use of resources
    // but it's not a critical op so whatever.
    const pngUrl = toDataUrl(await loadImage(dataUrl), "png");
    saveDataUrl(pngUrl, "Epoch_Image.png");
  }

  function onSettings() {
    setVisible(true);
  }

  return (
    <Fragment>
      <div class={buttonsClass} style={{ color: textColor }}>
        <MDCIconButton
          title="Favorite"
          icon="favorite_border"
        />
        <MDCIconButton
          title="Download"
          icon="save_alt"
          onClick={onDownload}
        />
        <MDCIconButton
          title="Settings"
          icon="more_vert"
          onClick={onSettings}
        />
      </div>
      <Settings visible={visible} />
    </Fragment>
  );
}
