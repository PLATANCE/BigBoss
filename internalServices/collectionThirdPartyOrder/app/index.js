import React, { Component } from 'react';

export default class collectionThirdPartyOrder extends Component {
  constructor() {
    super();
    this.state = {
      requestResult: '',
    };
  }

  concatResult(result) {
    console.log(result);
    this.setState({ requestResult: `${this.state.requestResult}\n${JSON.stringify(result)}` });
  }

  requestCollectionFoodflyOrder(orderIdxs) {
    const collection = orderIdxs.split(',');

    const body = JSON.stringify({
      'orderIdxs': collection,
    });

    return fetch('/collectionThirdPartyOrder/test', {
      method: 'POST',
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

  requestCollectionVroongOrder(orderIdxs) {
    const collection = orderIdxs.split(',');

    const body = JSON.stringify({
      'orderIdxs': collection,
    });

    return fetch('/collectionThirdPartyOrder/vroong', {
      method: 'POST',
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
            ref="orderIdxs"
            className="col-xs-7"
            type="text"
            placeholder="주문 번호 (OrderIdx)들을 입력하세요 (입력예시 : 123,145,521,...)"
          />
          <div className="col-xs-1"></div>
          <button className="col-xs-2" onClick={() => {
            const orderIdxs = this.refs.orderIdxs.value;
            return this.requestCollectionFoodflyOrder(orderIdxs);
          }}
          >풋플 묶음 접수</button>

          <button className="col-xs-2" onClick={() => {
            const orderIdxs = this.refs.orderIdxs.value;
            return this.requestCollectionVroongOrder(orderIdxs);
          }}
          >부릉 묶음 접수</button>
        </div>
        <div className="row white-space-pre">
          {this.state.requestResult}
        </div>
      </div>
    );
  }
}
