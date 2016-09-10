import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import {
  setInputMapStock,
  changeInputMapEnable,
} from '../../actions';



class MenuTableCell extends Component {

  constructor() {
    super();

    this.handleCheck = (event) => {
      this.props.dispatch(changeInputMapEnable(
        this.props.inputMap,
        this.props.rowIdx,
        this.props.area,
        this.props.day))
      .then(() => this.props.dispatch(setInputMapStock(
        this.props.inputMap,
        this.props.rowIdx,
        this.props.day,
        this.props.area,
        this.props.defaultStock)))
      .then(() => this.setState({}));
      // 액션이 일어난 props가 참조형일 때는 자동으로 다시 그리지 않는듯 함
    };

    this.handleChange = (event) => {
      this.props.dispatch(setInputMapStock(
        this.props.inputMap,
        this.props.rowIdx,
        this.props.day,
        this.props.area,
        event.target.value))
      .then(()=>this.setState({}));

    };

    this.tooltip = (
      <Tooltip id="tooltip"></Tooltip>
    );
  }

  render() {
    let rowData, dayData, cellData;
    let style = {};
    rowData = this.props.inputMap[this.props.rowIdx];
    if(typeof(rowData) === 'undefined') return (<td></td>);
    dayData = rowData[this.props.day];
    if(typeof(dayData) === 'undefined') return (<td></td>);
    cellData = dayData[this.props.area];
    if(typeof(cellData) === 'undefined') return (<td></td>);

    this.tooltip = (
      <Tooltip id="tooltip">{this.props.data[this.props.rowIdx].foodfly_name}</Tooltip>
    );

    if(this.props.areaList.length !== 1) { // 지역이 여러 개 일 때 패딩 주기
      if(this.props.colIdx === 0){
        style.paddingLeft = '20px';
      }
      if(this.props.colIdx === this.props.areaList.length - 1) {
        style.borderRightStyle = 'solid';
        style.paddingRight = '20px';
      }
    }

    return (
      <OverlayTrigger placement="left" overlay={this.tooltip}>

      <td style={style}>
          <input
            type="checkbox"
            checked={cellData.checked}
            onClick={this.handleCheck}
          />

          <input
            type="number"
            disabled={!cellData.checked}
            value={cellData.checked ? cellData.value : ''}
            onChange={this.handleChange}
            style={{ width: 36, textAlign: 'center', height: 18, background: 'transparent' }}
          />
      </td>

      </OverlayTrigger>
    );
  }
}

function select(state) {
  const {
    dailyMenuAdder,
  } = state;
  return dailyMenuAdder;
}

export default connect(select)(MenuTableCell);
