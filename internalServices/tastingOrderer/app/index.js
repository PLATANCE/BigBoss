import React, { Component } from 'react';

export default class tastingOrderer extends Component {
  constructor() {
    super();
    this.state = {
      requestResult: '',
    };
  }

  concatResult(result) {
    this.setState({ requestResult: `${this.state.requestResult}\n${JSON.stringify(result)}` });
  }

  requestTastingOrder(
    address,
    addressDetail,
    mobile,
    menuDailyIndex,
    orderAmount,
    timeSlot
  ) {

    const body = JSON.stringify({
      'address': address,
      'addressDetail': addressDetail,
      'mobile': mobile,
      'menuDailyIndex': menuDailyIndex,
      'orderAmount': orderAmount,
      "timeSlot": timeSlot,
    });

    return fetch('/tastingOrderer', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body
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
            ref="address"
            className="col-xs-7"
            type="text"
            placeholder="예 : 신사동 120"
            />

          <input
            ref="addressDetail"
            className="col-xs-7"
            type="text"
            placeholder="상세 주소 (105동 105호)"
            />

          <input
            ref="mobile"
            className="col-xs-7"
            type="text"
            placeholder="000-0000-0000 (형식에 맞게 쓰시오.)"
            />

          <input
            ref="menuDailyIndex"
            className="col-xs-7"
            type="text"
            placeholder="Menu Daily Index"
            />

          <input
            ref="orderAmount"
            className="col-xs-7"
            type="text"
            placeholder="Order Amount"
            />

          <input
            ref="timeSlot"
            className="col-xs-7"
            type="text"
            placeholder="Time Slot"
            />
          <div className="col-xs-1"></div>
          <button className="col-xs-2" onClick={() => {
            const address = this.refs.address.value;
            const addressDetail = this.refs.addressDetail.value;
            const mobile = this.refs.mobile.value;
            const menuDailyIndex = this.refs.menuDailyIndex.value;
            const orderAmount = this.refs.orderAmount.value;
            const timeSlot = this.refs.timeSlot.value;

            return this.requestTastingOrder(
              address,
              addressDetail,
              mobile,
              menuDailyIndex,
              orderAmount,
              timeSlot
            );
          }}
            >테이스팅 하기~!</button>
        </div>
        <div className="row white-space-pre">
          {this.state.requestResult}
        </div>
      </div>
    );
  }
}
