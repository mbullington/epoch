import {h, Component} from "preact";
import {MDCRipple} from "@material/ripple";

type OnClickHandler = () => any;

interface Props {
  title: string;
  icon: string;
  onClick?: OnClickHandler;
};

/**
 * Simple Preact wrapper for Material Design Components icon buttons.
 * https://material.io/develop/web/components/buttons/icon-buttons/
 */
export default class MDCIconButton extends Component<Props> {
  ref?: HTMLButtonElement;
  ripple?: MDCRipple;

  refHandler = (node: HTMLButtonElement) => {
    if (this.ref != null) {
      this.ref = node;
      this.ripple = new MDCRipple(this.ref);
      this.ripple.unbounded = true;
    }
  };

  componentWillUnmount() {
    if (this.ripple != null) {
      this.ripple.destroy();
    }
  }

  render() {
    const {title, icon, onClick} = this.props;

    return (
      <button
          ref={this.refHandler}
          class="mdc-icon-button material-icons"
          title={title}
          onClick={onClick}>
        {icon}
      </button>
    );
  }
}