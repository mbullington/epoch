import {h, Fragment} from "preact";

interface Props {
  visible: boolean;
}

export default function SettingsPane({visible}: Props) {
  const display = visible ? "block" : "none";

  return (
    <Fragment>
      <div class="settings-shade" style={{display}}>
      </div>
      <div class="settings" style={{display}}>
        <div class="settings-inner">
          Hello!
        </div>
      </div>
    </Fragment>
  );
}
