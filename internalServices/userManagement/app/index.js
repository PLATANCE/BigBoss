import React, { Component } from 'react';

export default class userManagement extends Component {
  constructor() {
    super();
    this.state = {
      requestResult: '',
    };
  }

  concatResult(result) {
    console.log(result);
    this.setState({ requestResult: `${this.state.requestResult}\n ${JSON.stringify(result)}` });
  }

  requestGoodByeUser(userIdx) {
    const body = JSON.stringify({
      'userIdx': userIdx,
    });

    return fetch('/userManagement', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })
    .then(response => response.json())
    .then(json => this.concatResult(json));
  }

  requestGetUserIdxByUserCode(userCode) {
    return fetch(`/userManagement/${userCode}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json => this.concatResult(json));
  }

  requestGetRecommendedList(userCode) {
    return fetch(`/userManagement/recommend/${userCode}`, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json => this.concatResult(json));
  }

  requestPutCurrentPoint(userIdx, point) {
    const body = JSON.stringify({
      userIdx,
      point,
    });

    return fetch('/userManagement/point', {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })
    .then(response => response.json())
    .then(json => this.concatResult(json));
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <input
            ref="userIdx"
            className="col-xs-7"
            type="text"
            placeholder="유저번호를 입력하세영"
          />
          <div className="col-xs-1"></div>
          <button className="col-xs-2" onClick={() => {
            const userIdx = this.refs.userIdx.value;
            return this.requestGoodByeUser(userIdx);
          }}
          >회원 탈퇴시키기</button>

          <input
            ref="point"
            className="col-xs-7"
            type="text"
            placeholder="수정할 포인트를 입력하세여 예시 : 15000"
          />
          <div className="col-xs-1"></div>
          <button className="col-xs-2" onClick={() => {
            const userIdx = this.refs.userIdx.value;
            const point = this.refs.point.value;

            return this.requestPutCurrentPoint(userIdx, point);
          }}
          >포인트 차감시켜버리기</button>

          <input
            ref="userCode"
            className="col-xs-7"
            type="text"
            placeholder="유저의 코드를 입력해주세영"
          />
          <button className="col-xs-2" onClick={() => {
            const userCode = this.refs.userCode.value;
            return this.requestGetUserIdxByUserCode(userCode);
          }}
          >코드로 유저 번호 찾기</button>

          <button className="col-xs-2" onClick={() => {
            const userCode = this.refs.userCode.value;
            return this.requestGetRecommendedList(userCode);
          }}
          >추천인 정보</button>

        </div>
        <div className="row white-space-pre">
          {this.state.requestResult}
        </div>
      </div>
    );
  }
}
