import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

class MenuChangePopup extends Component {
  render() {
    return (
      <div className={cx("change-popup", {show: this.props.show})}>
        <h3>메뉴 변경</h3>
      </div>
    )
  }
}

export default MenuChangePopup