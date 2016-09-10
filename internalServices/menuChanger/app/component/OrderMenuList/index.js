import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import SelectedDish from '../../SelectedDish';
import DishRow from './DishRow';
import {
  changeAmount,
  clearDish,
  updateTotalPrice,
} from '../../actions';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow } from 'material-ui/Table';
import Paper from 'material-ui/Paper';

class OrderMenuList extends Component {
  constructor(props) {
    super(props);
    this.handleChangeAmount = this.handleChangeAmount.bind(this);
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
  }

  handleChangeAmount(amount, idx) {
    this.props.dispatch(changeAmount(amount, idx));
    this.props.dispatch(updateTotalPrice());
  }
  handleClearButtonClick(idx) {
    this.props.dispatch(clearDish(idx));
    this.props.dispatch(updateTotalPrice());
  }

  render() {
    if (!this.props.selectedMenu) {
      return null;
    }
    return (
      <Paper zDepth={1}>
        <Table selectable={false}>
           <TableHeader
             displaySelectAll={false}
             adjustForCheckbox
           >
              <TableRow>
                 <TableHeaderColumn style={{ width: '50%' }}>이름</TableHeaderColumn>
                 <TableHeaderColumn style={{ width: '15%' }}>가격</TableHeaderColumn>
                 <TableHeaderColumn style={{ width: '15%' }}>수량</TableHeaderColumn>
                 <TableHeaderColumn style={{ width: '20%' }}>총합</TableHeaderColumn>
              </TableRow>
           </TableHeader>
           <TableBody showRowHover>
           {this.props.selectedMenu.map(
             (dish) =>
             <DishRow
               key={dish.menuIdx}
               idx={dish.menuIdx}
               name={dish.name}
               amount={dish.amount}
               price={dish.price}
               onAmountChange = {this.handleChangeAmount}
               onClearButtonClick = {this.handleClearButtonClick}
             />
           )}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

OrderMenuList.propTypes = {
  selectedMenu: PropTypes.arrayOf(PropTypes.instanceOf(SelectedDish)),
  dispatch: PropTypes.func.isRequired,
};


const mapStateToProps = (state) => {
  const {
    menuChanger,
  } = state;
  return menuChanger;
};


OrderMenuList = connect(mapStateToProps)(OrderMenuList);

export default OrderMenuList;
