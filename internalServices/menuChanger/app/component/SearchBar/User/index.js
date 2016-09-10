import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { Row, Col } from 'react-flexbox-grid/lib/index';

export default class UserSearchBar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleClick() {
    const input = this.refs.userIdxInput.input.value;
    this.props.onUserInput(input);
  }

  handleFocus() {
    this.refs.userIdxInput.input.value = '';
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      const input = this.refs.userIdxInput.input.value;
      this.props.onUserInput(input);
    }
  }
  render() {
    return (
        <Row center="xs" bottom="xs">
          <Col xs={6}>
          <TextField
            id="userIdxInput"
            ref="userIdxInput"
            floatingLabelText="고객번호 또는 전화번호"
            hintText="고객번호 또는 전화번호를 입력해주세요."
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
UserSearchBar.propTypes = {
  onUserInput: PropTypes.func.isRequired,
};
