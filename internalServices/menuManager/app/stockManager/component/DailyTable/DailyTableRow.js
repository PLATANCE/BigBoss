import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DailyTableCell from './DailyTableCell';
import { DragSource, DropTarget } from 'react-dnd';
import { dropRow } from '../../actions';
import { blueGrey50 } from 'material-ui/styles/colors';

let pickRowIdx;

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
  };
}

function targetCollect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  };
}

const rowSource = {
  beginDrag(props) {
    pickRowIdx = props.rowIdx;
    return props;
  },
  endDrag: function (props, monitor, component) {
    if (!monitor.didDrop()) {
      return;
    }
    var dropResult = monitor.getDropResult();
    if(typeof(pickRowIdx) !== 'undefined') {
      console.log("dropResult",dropResult);
      props.dispatch(dropRow(props.tableData, pickRowIdx, dropResult.rowIdx));
    }
  }
};

const target = {
  drop(props) {
    return props;
  }
};

class DailyTableRow extends Component {
  constructor() {
    super();
  }

  render() {
    let tag = [];
    const row = this.props.tableData[this.props.menuIdx];
    const len = this.props.num;
    let editorStyle = { padding: 0 };
    let style = {};

    const handleStyle = {
      color: 'gray',
      width: '1rem',
      height: '1rem',
      display: 'inline-block',
      cursor: 'move',
    };

    if(this.props.isOver) {
      editorStyle.borderBottomStyle = 'dotted';
      editorStyle.paddingBottom = '15px';
    }

    if(this.props.rowIdx % 2 === 0) {
      style.backgroundColor = blueGrey50;
    }

    if(this.props.editMode === true) {
      tag.push(this.props.connectDragSource( // for Sortable Handle
        <td>
          <div style={handleStyle}>:::</div>
        </td>
      ));
    }
    else {
      tag.push( // for Sortable Handle
        <td>
          <div style={{cursor: 'no-drop'}}>---</div>
        </td>
      );
    }

    for (let i = 0; i < len - 1; i++) { // -1 caused by Sortable Handle
      tag.push(
        <td key={'td' + i} style={editorStyle}>
          <DailyTableCell
            key = {'cell' + this.props.rowIdx + i}
            rowIdx={this.props.rowIdx}
            attrKey={i}
          />
        </td>
      );
    }

    return this.props.connectDragPreview(this.props.connectDropTarget(
      <tr
        key={'tr' + this.props.rowIdx}
        style={style}>
        {tag}
      </tr>
      )
    );
  }
}

function select(state) {
  const {
    stockManager,
  } = state;
  return stockManager;
}

const dragSource = DragSource('row', rowSource, collect)(DailyTableRow);
const dropTarget = DropTarget('row', target, targetCollect)(dragSource);
export default connect(select)(dropTarget);
