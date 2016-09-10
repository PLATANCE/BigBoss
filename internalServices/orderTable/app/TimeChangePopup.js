import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

class TimeChangePopup extends Component {
  render() {
    return (
      <div className={cx("change-popup", {show: this.props.show})}>
        <h3>예약 시간 수정</h3>
        <b onClick={this.props.onClose}>닫기</b>
        <div dangerouslySetInnerHTML={{__html: "<iframe src='/timeChanger' ></iframe>"}} />
      </div>
    )
  }
}

export default TimeChangePopup