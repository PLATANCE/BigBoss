import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import {
  submitOrderMenu,
  searchOrderMenu,
} from '../../actions';
export default class OrderSubMitButton extends Component {

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.state = {
      open: false,
    };
  }


  handleClick() {
    this.props.dispatch(submitOrderMenu())
    .then(() => (
        this.props.dispatch(searchOrderMenu(this.props.orderIdx))
    ))
    .then(this.setState({
      open: true,
    }));
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  render() {
    return (
      <div>
        <RaisedButton
          className="submitButton"
          onTouchTap={this.handleClick}
          label="주문 변경하기" primary
        />
        <Snackbar
          open={this.state.open}
          message="주문이 성공적으로 변경되었습니다."
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

OrderSubMitButton.propTypes = {
  dispatch: PropTypes.func.isRequired,
  orderIdx: PropTypes.number,
};
