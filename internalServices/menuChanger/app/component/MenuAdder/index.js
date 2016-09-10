import React, { PropTypes, Component } from 'react';
import Stock from '../../Stock';
import { connect } from 'react-redux';
import {
  addDishToList,
  updateTotalPrice,
} from '../../actions';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/RaisedButton';

class MenuAdder extends Component {
  constructor() {
    super();
    this.state = {
      selectedStock: null,
      rest: null,
      amount: null,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleAmountChange = this.handleAmountChange.bind(this);
  }

  makeMenuItems(limit) {
    if (!limit) {
      return null;
    }
    const items = [];
    for (let i = 0; i <= limit; i++) {
      items.push(<MenuItem key={i} value={i} primaryText={i} />);
    }
    return items;
  }

  handleClick() {
    const orderData = {
      stock: this.state.selectedStock,
      amount: this.state.amount,
    };
    this.props.dispatch(addDishToList(orderData));
    this.props.dispatch(updateTotalPrice());
  }

  handleAmountChange(e, i, amount) {
    this.setState({ amount });
  }

  handleChange(e, i, selectedStock) {
    this.setState({ selectedStock });
    this.setState({ rest: selectedStock.rest });
  }

  renderAddButton() {
    return (
      <Col xs={2}>
        <FlatButton
          className="searchButton"
          onMouseDown={this.handleClick}
          label="추가"
        />
      </Col>
    );
  }

  renderMenuAmountChanger() {
    return (
      <Col xs={2}>
        <SelectField
          value={this.state.amount}
          onChange={this.handleAmountChange}
          fullWidth
          floatingLabelText="수량"
          maxHeight={100}
        >
        { this.makeMenuItems(this.state.rest) }
        </SelectField>
      </Col>
    );
  }

  render() {
    if (!this.props.stockList) {
      return null;
    }
    return (
        <Row center="xs" bottom="xs">
          <Col xs={8}>
          <SelectField
            value={this.state.selectedStock}
            onChange={this.handleChange}
            fullWidth
            floatingLabelText="추가할 메뉴"
          >
          {this.props.stockList.map(
             (dish) => {
               const text = `${dish.name} (${dish.rest}개 남음)`;
               return <MenuItem key={dish.menuIdx} value={dish} primaryText={text} />;
             }
          )}
          </SelectField>
          </Col>
          { this.renderMenuAmountChanger() }
          { this.renderAddButton() }
        </Row>
    );
  }
}

MenuAdder.propTypes = {
  stockList: PropTypes.arrayOf(PropTypes.instanceOf(Stock)),
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => {
  const {
    menuChanger,
  } = state;
  return menuChanger;
};


MenuAdder = connect(mapStateToProps)(MenuAdder);

export default MenuAdder;
