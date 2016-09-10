import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DailyTableRow from './DailyTableRow';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

class DailyTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (typeof(this.props.areaArr) === 'undefined') return (<div></div>);
    console.log('DailyTable Props : ', this.props);

    const tableData = this.props.tableData;
    const attr = this.props.attr;
    const tableWidth = this.props.areaArr.length * 200 + 100;

    let rowsTag = [];

    tableData.forEach((value, index) => {
      rowsTag.push(<DailyTableRow
        key={'row'+index}
        num={attr.length}
        rowIdx={index}
        editMode={this.props.editMode}
        handleChangeStock={this.props.handleChangeStock}
      />);
    });

    return (
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: tableWidth }}>
          <thead>
            <tr>
              {this.props.areaArr.map((iter, index) => {
                let colspan = 3;
                let width = 200;
                if (index === 0) {
                  width = 300;
                }
                if (iter === '순위') {
                  width = 40;
                  colspan = 1;
                }
                const superHeaderStyle = {
                  textAlign: 'center',
                  color: '#FF0000',
                  fontSize: '15px',
                  width,
                };
                return (<td key={'super' + index} colSpan={colspan} style={superHeaderStyle}>
                  {iter}
                </td>);
              })}
            </tr>
          </thead>
            <tr>
              {attr.map((row, index) => {
                let textAlign = 'center';
                if(this.props.editMode === false) {
                  if (row === '생산') textAlign = 'right';
                  if (row === '남음') textAlign = 'left';
                }

                return (
                  <td key={'header' + index} style={{ textAlign }}>{row}</td>
                ); })}
            </tr>
          {rowsTag}
        </table>
      </div>
    );
  }
}

DailyTable.propTypes = {
  tableData: PropTypes.array,
};

function select(state) {
  const {
    stockManager,
  } = state;
  return stockManager;
}

export default connect(select)(DragDropContext(HTML5Backend)(DailyTable));
