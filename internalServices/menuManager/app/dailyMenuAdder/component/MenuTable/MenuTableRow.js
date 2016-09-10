import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import MenuTableCell from './MenuTableCell'
import { blueGrey50 } from 'material-ui/styles/colors';
import {TABLE_IDX_WIDTH, TABLE_NAME_WIDTH} from './';

class MenuTableRow extends Component {

  render() {
    const menuData = this.props.data[this.props.rowIdx];
    let cellTag = [];
    let style = {};

    if(this.props.rowIdx % 2 === 0) {
      style.backgroundColor = blueGrey50;
    }
    else {
      style.backgroundColor = 'white';
    }

    for(let i = 0; i < 7; i++) {
      this.props.areaList.forEach((area, index) => {
        cellTag.push(
          <MenuTableCell
            rowIdx={this.props.rowIdx}
            colIdx={index}
            area={area}
            day={i}
          />);
      });
    }

    return (
      <tr style={style}>
        <td style={{position: 'absolute',
          left: 0, width: TABLE_IDX_WIDTH, zIndex: 2,
          backgroundColor: style.backgroundColor}}>
          {menuData.idx} </td>

        <td style={{position: 'absolute',
          left: TABLE_IDX_WIDTH, width: TABLE_NAME_WIDTH,  zIndex: 2,
          backgroundColor: style.backgroundColor,
          borderRightStyle: 'solid',
          borderColor: 'red'}}>
          {menuData.foodfly_name} </td>

        {cellTag}
      </tr>
    );
  }
}

function select(state) {
  const {
    dailyMenuAdder,
  } = state;
  return dailyMenuAdder;
}

export default connect(select)(MenuTableRow);
