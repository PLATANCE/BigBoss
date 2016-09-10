import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import {
  givePointToUser,
  searchUserInfo,
} from '../../actions';

export default class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      open: false,
      reason: 1,
      message: '',
    };
  }

  handleClick() {
    const userPoint = parseInt(this.refs.userPoint.input.value, 10);
    const query = {
      userIdx: this.props.user.idx,
      point: userPoint,
      reason: this.state.reason,
    };
    this.props.dispatch(givePointToUser(query))
    .then(() => (
        this.props.dispatch(searchUserInfo(this.props.user.idx))
    ))
    .then(this.setState({
      open: true,
      message: `${userPoint} 포인트가 지급되었습니다.`,
    }));
  }

  handleChange(event, index, value) {
    this.setState({ reason: value });
  }

  handleRequestClose() {
    this.setState({
      open: false,
    });
  }

  handleFocus() {
    this.refs.userPoint.input.value = '';
  }

  render() {
    if (!this.props.user) {
      return null;
    }
    const user = this.props.user;
    return (
      <div>
        <h3>고객 정보</h3>
        <h4>고객 번호 : { user.idx }</h4>
        <h4>고객 닉네임 : { user.nickname }</h4>
        <h4>고객 포인트 : { user.point }</h4>
        <TextField
          id="userPoint"
          ref="userPoint"
          floatingLabelText="포인트 지급"
          hintText="지급할 포인트 양을 입력해주세요."
          onFocus={this.handleFocus}
          errorText={this.errorText}
        />
        <DropDownMenu value={this.state.reason} onChange={this.handleChange}>
         <MenuItem value={1} primaryText="메뉴 누락 및 오배송" />
         <MenuItem value={2} primaryText="배송 지연" />
         <MenuItem value={3} primaryText="대외 협찬" />
         <MenuItem value={4} primaryText="공식 이벤트" />
         <MenuItem value={5} primaryText="진상고객 퇴치" />
         <MenuItem value={6} primaryText="시스템 오류" />
         <MenuItem value={7} primaryText="입사 지원" />
         <MenuItem value={99} primaryText="기타" />
       </DropDownMenu>
        <RaisedButton
          className="pointButton"
          onTouchTap={this.handleClick}
          label="지급하기" primary
        />
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <h4>고객 전화번호 : { user.mobile }</h4>
      </div>
    );
  }
}

UserInfo.propTypes = {
  user: PropTypes.object,
  userIdx: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
};
