import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {getOrderList} from "./actions";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

import TimeChangePopup from "./TimeChangePopup";
import AddressChangePopup from "./AddressChangePopup";
import MenuChangePopup from "./MenuChangePopup";

class OrderTable extends Component {

  constructor(props) {
    super(props)
    this.state = {
      addressChangePopup: false,
      menuChangePopup: false,
      timeChangePopup: false
    }
    this.openPopup = this.openPopup.bind(this)
    this.menuFormatter = this.menuFormatter.bind(this)
    this.addressButton = this.addressButton.bind(this)
    this.timeButton = this.timeButton.bind(this)
  }

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch(getOrderList());
  }

  openPopup(title) {
    return (e) => {
      this.setState({[`${title}ChangePopup`]: true})
    }
  }

  menuFormatter(cell, row) {
    return <span>
      {cell.split(",").map(w => <span style={{display: "block"}}>{w}</span>)}
      <button onClick={this.openPopup('menu')}>변경</button>
    </span>
  }

  addressButton(cell, row) {
    return <span>
      <span>{cell}</span>
      <button onClick={this.openPopup('address')}>변경</button>
    </span>
  }

  timeButton(cell, row) {
    return <span>
      <span>{cell}</span>
      <button onClick={this.openPopup('time')}>변경</button>
    </span>
  }


  render() {
    if (!this.props.orders) {
      return null
    }

    return (

      <div>
        <BootstrapTable data={this.props.orders[0]} search={true}>
          <TableHeaderColumn dataField="idx" isKey={true} dataSort={true} width="120">주문 No.</TableHeaderColumn>
          <TableHeaderColumn dataField="nickname" dataSort={true} width="120">회원이름</TableHeaderColumn>
          <TableHeaderColumn dataField="addr_no" dataFormat={this.addressButton}>주소</TableHeaderColumn>
          <TableHeaderColumn dataField="MENU_NAME" dataFormat={this.menuFormatter}>메뉴</TableHeaderColumn>
          <TableHeaderColumn dataField="time_slot" dataSort={true} width="150" dataFormat={this.timeButton}>시간대</TableHeaderColumn>
          <TableHeaderColumn width="100">관리</TableHeaderColumn>
        </BootstrapTable>
        <AddressChangePopup show={this.state.addressChangePopup} />
        <MenuChangePopup show={this.state.menuChangePopup} />
        <TimeChangePopup show={this.state.timeChangePopup} />
      </div>
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
