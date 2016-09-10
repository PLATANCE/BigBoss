import React, { Component } from 'react';

class thirdPartyOrderService extends Component {
  constructor() {
    super();
    this.state = {
      requestResult: '',
    };
  }

  concatResult(result) {
    console.log(result);
    this.setState({ requestResult: `${this.state.requestResult}\n${JSON.stringify(result.message)}` });
  }

  requestFoodflyOrder(orderIdx) {
    return fetch(`/thirdPartyOrderService/order/${orderIdx}/foodfly`, {
      method: 'POST',
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

  requestVroongOrder(orderIdx) {
    return fetch(`/thirdPartyOrderService/order/${orderIdx}/vroong`, {
      method: 'POST',
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
            ref="orderIdxInput"
            className="col-xs-7"
            type="text"
            placeholder="주문 번호"
          />
          <div className="col-xs-1"></div>
          <button className="col-xs-2" onClick={() => {
            const orderIdx = parseInt(this.refs.orderIdxInput.value, 10);
            return this.requestFoodflyOrder(orderIdx);
          }}
          >푸플 접수</button>
          <button className="col-xs-2" onClick={() => {
            const orderIdx = parseInt(this.refs.orderIdxInput.value, 10);
            return this.requestVroongOrder(orderIdx);
          }}
          >부릉 접수</button>
        </div>
        <div className="row white-space-pre" style={{padding: 30 + 'px'}}>
          {this.state.requestResult}
        </div>
      </div>
    );
  }
}

// Wrap the component to inject dispatch and state into it
export default thirdPartyOrderService;
