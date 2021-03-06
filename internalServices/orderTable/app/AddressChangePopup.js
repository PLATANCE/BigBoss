import React, {Component, PropTypes} from 'react';
import cx from 'classnames';

class AddressChangePopup extends Component {
  render() {
    return (
      <div className={cx("change-popup", {show: this.props.show})}>
        <h3>주소 수정</h3>
        <b onClick={this.props.onClose}>닫기</b>
        <div dangerouslySetInnerHTML={{__html: "<iframe src='/addressBulldozer' ></iframe>"}} />
      </div>
    )
  }
}

export default AddressChangePopup