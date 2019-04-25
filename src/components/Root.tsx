import { h, Fragment } from "preact";
import { useState } from "preact/hooks";

import SettingsPane from "./SettingsPane";
import MDCIconButton from "./MDCIconButton";

import loadImage from "../graphics/loadImage";
import { toDataUrl } from "../graphics/CanvasImage";

import { BackgroundState } from "../store/state";

import saveDataUrl from "../util/saveDataUrl";

function getBackgroundColor(textColor: string): string {
  switch (textColor) {
    case "transparent":
      return "transparent";
    case "#fff":
      return "--color-translucent-black";
    case "#000":
    default:
      return "--color-translucent-white";
  }
};

interface Props {
  background: BackgroundState;
}

export default function Root({ background }: Props) {
  const { dataUrl = "", textColor = "transparent" } = background;

  const backgroundColor = getBackgroundColor(textColor);
  const [visible, setVisible] = useState(false);

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
      <div class="buttons" style={{ color: textColor, backgroundColor }}>
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
      <SettingsPane visible={visible} />
    </Fragment>
  );
}
