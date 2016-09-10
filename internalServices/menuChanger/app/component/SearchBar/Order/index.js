import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Row, Col } from 'react-flexbox-grid/lib/index';

export default class OrderSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleClick() {
    const orderIdx = parseInt(this.refs.orderIdxInput.input.value, 10);
    this.props.onUserInput(orderIdx);
  }

  handleFocus() {
    this.refs.orderIdxInput.input.value = '';
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      const orderIdx = parseInt(this.refs.orderIdxInput.input.value, 10);
      this.props.onUserInput(orderIdx);
    }
  }
  render() {
    return (
        <Row center="xs" bottom="xs">
          <Col xs={6}>
          <TextField
            id="orderIdxInput"
            ref="orderIdxInput"
            floatingLabelText="주문번호"
            hintText="주문번호를 입력해주세요."
            fullWidth
            onFocus={this.handleFocus}
            onKeyDown={this.handleEnter}
          />
          </Col>
          <Col xs={2}>
          <RaisedButton
            className="searchButton"
            onTouchTap={this.handleClick}
            label="검색" primary
          />
          </Col>
        </Row>
    );
  }
}
OrderSearchBar.propTypes = {
  onUserInput: PropTypes.func.isRequired,
};
