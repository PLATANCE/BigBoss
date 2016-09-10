import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import MenuTableRow from './MenuTableRow';

export const TABLE_IDX_WIDTH = 60;
export const TABLE_NAME_WIDTH = 220;

class MenuTable extends Component {

  render() {
    let rowsTag = [];
    let areasTag = [];
    let widthEachDay = this.props.areaList.length * 85;
    let tableWidth = widthEachDay * 7 + TABLE_NAME_WIDTH + TABLE_IDX_WIDTH;

    this.props.data.forEach((row, index) => {
      rowsTag.push(<MenuTableRow
        rowIdx={index}
      />)
    })

    this.props.week.map(() => {
      this.props.areaList.forEach((area) => {
        areasTag.push (<td>
          {area}
        </td>);
      })
    });

    return (
      <div style={{ overflow: 'auto', marginLeft: TABLE_IDX_WIDTH + TABLE_NAME_WIDTH }}>
        <table style={{width: tableWidth, textAlign: 'center'}}>
          <thead>
          <tr>
            <td rowSpan="2" style={{width: 0}}> </td>
            {this.props.week.map((iter) => {
              return (<td colSpan={this.props.areaList.length}>
                {iter}
              </td>);
            })}
          </tr>
          <tr>
            {this.props.week.map((iter) => {
              let day = moment(iter).format('ddd');
              return (<td style={{fontSize: 20, color: 'red'}}
                colSpan={this.props.areaList.length}>
                {day}
              </td>);
            })}
          </tr>

          <tr>
            <td style={{width: TABLE_IDX_WIDTH,
              position: 'absolute',
              left: 0,
              zIndex: 2,
              backgroundColor: 'white'}}> Idx </td>
            <td style={{width: TABLE_NAME_WIDTH,
              position: 'absolute',
              zIndex: 2,
              left: TABLE_IDX_WIDTH,
              backgroundColor: 'white',
              borderRightStyle: 'solid',
              borderColor: 'red'}}> Name </td>
            {areasTag}
          </tr>

          </thead>

          {rowsTag}

        </table>
      </div>
    );
  }
}

function select(state) {
  const {
    dailyMenuAdder,
  } = state;
  return dailyMenuAdder;
}

export default connect(select)(MenuTable);
