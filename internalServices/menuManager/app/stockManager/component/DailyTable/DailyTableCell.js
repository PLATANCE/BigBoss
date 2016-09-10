import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { blue900, redA700, amber200 } from 'material-ui/styles/colors';
import './DailyTableStyle.css';
import { changeStockBuffer } from '../../actions';
class DailyTableCell extends Component {
  constructor() {
    super();

    this.editValue = 0;

    this.changeStock = (event, value) => {
      const whatToChange = JSON.parse(event.target.id);
      this.props.dispatch(changeStockBuffer(this.props.stockTransaction, value, whatToChange));
    };

    this.handleChangValue = (event) => {
      this.editValue = event.target.value;
      this.changeStock(event, this.editValue);
      this.setState({});
    };

    this.handleClick = (event) => {
      if (event.target.name === 'leftArrow') {
        this.editValue --;
      }
      else if (event.target.name === 'rightArrow') {
        this.editValue ++;
      }
      this.changeStock(event, this.editValue);
      this.setState({});
    };
  }

  componentDidUpdate() {
    if (this.props.editMode === false) { // editValue 를 state로 쓰지 못 한 이유
      this.editValue = 0;
    }
  }

  render() {
    let editModeTag = [];
    const cellData = this.props.tableData[this.props.rowIdx][this.props.attrKey];

    let style = {
      textAlign: 'center',
    };
    let textStyle = {
      display: 'inline-block',
    };

    if (cellData.type === 'produced' || cellData.type === 'priority') {
      style.borderLeftStyle = 'solid';
    }

    if (this.props.editMode === false) {
      if (cellData.type === 'produced') {
        style.textAlign = 'right';
      }
      else if (cellData.type === 'spare') {
        style.textAlign = 'left';
      }
    }

    let editColor = amber200;
    if (this.editValue > 0) editColor = blue900;
    if (this.editValue < 0) editColor = redA700;

    if (this.props.editMode === true) {
      if (cellData.area !== 'total' &&
        cellData.type !== 'spare' &&
        typeof(cellData.value) === 'number' &&
        typeof(cellData.area) !== 'undefined') {
        textStyle.width = 32;
        const buttonStyle = {
          padding: 0,
          height: 18,
        };

        style.borderRightStyle = 'ridge';
        editModeTag.push(
          <input id={JSON.stringify(cellData)} type="button" value="<" style={buttonStyle} name="leftArrow" onClick={this.handleClick} />
      );

        editModeTag.push(<input
          type="number"
          id={JSON.stringify(cellData)}
          value={this.editValue}
          onChange={this.handleChangValue}
          style={{ width: 24, textAlign: 'center', border: 0, color: editColor, height: 18, backgroundColor: 'transparent' }}
        />);

        editModeTag.push(
          <input id={JSON.stringify(cellData)} type="button" value=">" style={buttonStyle} name="rightArrow" onClick={this.handleClick} />
      );
      }
    }

    return (
      <div
        style={style}>
        <div style={textStyle}>
          {cellData.value}
        </div>
        {editModeTag}
      </div>
    );
  }
}

function select(state) {
  const {
    stockManager,
  } = state;
  return stockManager;
}

export default connect(select)(DailyTableCell);
