import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
  getOrderList
} from "./actions"
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class OrderTable extends Component {

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch(getOrderList());
  }

  render() {
    if (!this.props.orders) {
      return null
    }

    return (
      <BootstrapTable data={this.props.orders[0]} search={true}>
        <TableHeaderColumn dataField="idx" isKey={true} dataSort={true} width="120">주문 No.</TableHeaderColumn>
        <TableHeaderColumn dataField="nickname" dataSort={true}>회원이름</TableHeaderColumn>
        <TableHeaderColumn dataField="addr_no">주소</TableHeaderColumn>
        <TableHeaderColumn dataField="MENU_NAME">메뉴</TableHeaderColumn>
        <TableHeaderColumn dataField="time_slot" dataSort={true} width="150">시간대</TableHeaderColumn>
        <TableHeaderColumn>관리</TableHeaderColumn>
      </BootstrapTable>
    )
  }
}

function select(state) {
  const {
    orderTable,
  } = state;
  return orderTable.orders;
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(OrderTable);
