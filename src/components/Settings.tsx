import {h, Fragment} from "preact";
import classnames from "classnames";

import MDCIconButton from "./MDCIconButton";

interface Props {
  visible: boolean;
  bgClass: string;
  onClick: () => void;
}

export default function Settings({visible, bgClass, onClick}: Props) {
  const displayTransform = visible ? `translate(0, 0)` : `translate(0, -5000px)`;

  const innerClass = classnames("settings-inner", bgClass, {
    visible: visible
  });

  return (
    <Fragment>
      <div class="settings-shade" style={{transform: displayTransform}} onClick={onClick}>
      </div>
      <div class="settings" style={{transform: displayTransform}}>
        <div class={innerClass}>
          <MDCIconButton
            title="Close"
            icon="close"
            onClick={onClick}
          />
          <h1>Settings</h1>
        </div>
      </div>
    </Fragment>
  );
}
