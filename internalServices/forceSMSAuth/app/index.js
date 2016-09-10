import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import {
  setPhoneNumber,
  fetchAuthInfo,
  requestPhoneNumberAuth,
  setAuthUserIdx,
  setAddressDetail,
  queryAddressWithAddressDetail,
} from './actions';

class ForceSMSAuth extends Component {
  render() {
    const {
      dispatch,
      phoneNumber,
      authInfos,
      users,
      authUserIdx,
      addressInfos,
      addressDetail,
    } = this.props;
    const authInfoRows = [];
    authInfos.forEach((authInfo) => {
      authInfoRows.push(
        <div className="row">
          <div>유저번호: {authInfo.user_idx}</div>
          <div>인증번호: {authInfo.auth_number}</div>
        </div>
      );
    });
    const usersRows = [];
    users.forEach((user) => {
      usersRows.push(
        <div className="row">
          <div>유저번호: {user.idx}</div>
          <div>로그인 종류: {user.login_type}</div>
          <div>이름: {`${user.nicnname | ''}${user.firstName | ''}${user.lastName | ''}`}</div>
          <div>친구초대 코드: {user.user_code}</div>
          <div>OS: {user.os_type}</div>
        </div>
      );
    });
    const addressInfoRows = [];
    addressInfos.forEach((addressInfo) => {
      addressInfoRows.push(
        <div className="row">
          <div>유저번호: {addressInfo.user_idx}</div>
          <div>주소: {`${addressInfo.address} ${addressInfo.address_detail}`}</div>
        </div>
      );
    });


    return (
      <div className="container-fluid">
        <div className="row">
          <input
            className="col-xs-7"
            type="text"
            placeholder="고객 전화번호"
            value={phoneNumber}
            onChange={(event) => dispatch(setPhoneNumber(event.target.value))}
          />
          <div className="col-xs-1"></div>
          <button
            className="col-xs-4"
            onClick={() => dispatch(fetchAuthInfo())}
          >정보 가져오기</button>
        </div>
        <div className="row">위 휴대폰 번호로 인증 시도하려는 유저({authInfos.length})</div>
        <div className="col-xs-12">{authInfoRows}</div>
        <div className="row">위 휴대폰 번호로 이미 인증된 유저({users.length})</div>
        <div className="col-xs-12">{usersRows}</div>

        <div className="row">
          <input
            className="col-xs-7"
            type="text"
            placeholder="상세 주소 검색"
            value={addressDetail}
            onChange={(event) => dispatch(setAddressDetail(event.target.value))}
          />
          <div className="col-xs-1"></div>
          <button
            className="col-xs-4"
            onClick={() => dispatch(queryAddressWithAddressDetail())}
          >주소 검색하기</button>
        </div>
        <div className="row">상세 주소 검색 결과({addressInfos.length})</div>
        <div className="col-xs-12">{addressInfoRows}</div>

        <div className="row">
          <input
            className="col-xs-7"
            type="text"
            placeholder="인증시킬 유저 번호"
            value={authUserIdx | ''}
            onChange={(event) => dispatch(setAuthUserIdx(parseInt(event.target.value | 0, 10)))}
          />
          <div className="col-xs-1"></div>
          <button
            className="col-xs-4"
            onClick={() => dispatch(requestPhoneNumberAuth())}
          >강제 인증 시키기</button>
        </div>
      </div>
    );
  }
}

ForceSMSAuth.propTypes = {
  dispatch: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string.isRequired,
  authInfos: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  authUserIdx: PropTypes.number.isRequired,
  addressDetail: PropTypes.string.isRequired,
  addressInfos: PropTypes.array.isRequired,
};

function select(state) {
  const {
    forceSMSAuth,
  } = state;
  return forceSMSAuth;
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(ForceSMSAuth);
