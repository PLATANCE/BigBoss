import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {
  getOrderList
} from "./actions"

class OrderTable extends Component {

  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch(getOrderList());
  }

  renderRow() {
    return (
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
      </tr>
    )
  }

  render() {
    if (!this.props.orders) {
      return null
    }

    return (
      <table>
        <thead />
        <tbody>
        {this.props.orders[0].map((order, idx) => {
          return <tr key={idx}><td>{order.nickname}</td><td>{order.MENU_NAME}</td><td>{order.addr_no}</td></tr>
        })}
        </tbody>
      </table>
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
