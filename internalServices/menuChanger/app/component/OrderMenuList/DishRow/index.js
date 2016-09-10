import React, { PropTypes, Component } from 'react';
import { TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';

class DishRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orderAmount: props.amount,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const idx = this.props.idx;
    this.props.onClearButtonClick(idx);
  }

  handleChange(event) {
    const idx = this.props.idx;
    const orderAmount = event.target.value;
    if (isNaN(orderAmount)) {
      return;
    }
    this.setState({ orderAmount });

    if (event.target.value === '') {
      this.setState({ orderAmount: '0' });
    }
    this.props.onAmountChange(orderAmount, idx);
  }

  render() {
    if (!this.props.name && !this.props.name && !this.props.price) {
      return null;
    }
    return (
       <TableRow>
          <TableRowColumn style={{ width: '10%' }}>
          <IconButton
            iconClassName="material-icons"
            onMouseDown={this.handleClick}
          >clear
          </IconButton>
         </TableRowColumn>
          <TableRowColumn style={{ width: '40%' }}>
            {this.props.name}
          </TableRowColumn>
          <TableRowColumn style={{ width: '15%' }}>
            {this.props.price} 원
          </TableRowColumn>
          <TableRowColumn style={{ width: '15%' }}>
            <input
              type="number"
              value={this.props.amount}
              onChange={this.handleChange}
              className="widthFull"
            />
          </TableRowColumn>
          <TableRowColumn style={{ width: '20%' }}>
          {this.props.price * this.props.amount} 원
          </TableRowColumn>
        </TableRow>
    );
  }
}

DishRow.propTypes = {
  idx: PropTypes.number,
  name: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  onAmountChange: PropTypes.func.isRequired,
  onClearButtonClick: PropTypes.func.isRequired,
};


export default DishRow;
