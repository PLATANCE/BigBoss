import React from 'react';
import {Component} from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class OrderTable extends Component {
  products = [{
    orderNum: 1,
    userNum: "1234",
    userName: "aa",
    address: "강남구 논현동 122-8",
    menu: "a,b,c",
    time: "16:00 - 16:30"
  },{
    id: 2,
    name: "1235",
    UserName: "a",
    address: "강남구 논현동 122-8",
    menu: "a,b",
    time: "17:00 - 17:30"
  }];
  setProduct(data) {
    this.products = data;
  }
  getProduct() {
    return this.products
  }

  render() {
    return (
      <div>
        <BootstrapTable data={this.getProduct()} search={true}>
          <TableHeaderColumn dataField="orderNum" isKey={true} dataSort={true} width="120">주문 No.</TableHeaderColumn>
          <TableHeaderColumn dataField="userNum" dataSort={true} width="120">회원번호</TableHeaderColumn>
          <TableHeaderColumn dataField="userName" dataSort={true}>회원이름</TableHeaderColumn>
          <TableHeaderColumn dataField="address">주소</TableHeaderColumn>
          <TableHeaderColumn dataField="menu">메뉴</TableHeaderColumn>
          <TableHeaderColumn dataField="time" dataSort={true} width="150">시간대</TableHeaderColumn>
          <TableHeaderColumn>관리</TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}

export default OrderTable