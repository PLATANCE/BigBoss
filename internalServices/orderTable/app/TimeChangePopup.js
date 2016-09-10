import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

class TimeChangePopup extends Component {
  render() {
    return (
      <div className={cx("change-popup", {show: this.props.show})}>
        <h3>예약 시간 수정</h3>
      </div>
    )
  }
}

export default TimeChangePopup