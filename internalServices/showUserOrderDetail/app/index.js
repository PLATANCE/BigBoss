import React, { Component } from 'react';

export default class showUserOrderDetail extends Component {
  constructor() {
    super();
    this.state = {
      requestResult: '',
    };
  }

  concatResult(result) {
    this.setState({ requestResult: `${this.state.requestResult}\n${JSON.stringify(result)}` });
  }

  requestUserOrderDetail(userIdx) {
    return fetch('/showUserOrderDetail/user/' + userIdx, {
      method: 'GET',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => this.concatResult(json))
      .catch(err => this.concatResult(err));
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <input
            ref="userIdxInput"
            className="col-xs-7"
            type="text"
            placeholder="사용자 번호 (User Index를 넣어주시면 됩니다.)"
            />
          <div className="col-xs-1"></div>
          <button className="col-xs-2" onClick={() => {
            const userIdx = parseInt(this.refs.userIdxInput.value, 10);
            return this.requestUserOrderDetail(userIdx);
          }}
            >사용자의 주문 정보 조회</button>
        </div>
        <div className="row white-space-pre">
          {this.state.requestResult}
        </div>
      </div>
    );
  }
}
