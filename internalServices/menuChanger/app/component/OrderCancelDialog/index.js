import React, { PropTypes, Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  cancelOrder,
} from '../../actions';

export default class OrderCancelDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  handleOpen() {
    this.setState({ open: true });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handleCancel() {
    this.setState({ open: false });
    this.props.dispatch(cancelOrder(this.props.orderIdx));
  }

  render() {
    if (!this.props.orderIdx) {
      return null;
    }
    const actions = [
      <FlatButton
        label="아니요."
        primary
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="네. 취소할게요."
        secondary
        onTouchTap={this.handleCancel}
      />,
    ];
    return (
      <div>
        <RaisedButton
          label="주문 취소하기"
          secondary
          onTouchTap={this.handleOpen}
        />
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
        정말로 이 주문을 취소하시겠습니까? 주문번호 : {this.props.orderIdx}
        </Dialog>
      </div>
    );
  }
}

OrderCancelDialog.propTypes = {
  orderIdx: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
};
