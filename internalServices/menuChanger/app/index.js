import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import SelectedDish from './SelectedDish';
import Stock from './Stock';
import OrderSearchBar from './component/SearchBar/Order';
import UserSearchBar from './component/SearchBar/User';
import MenuAdder from './component/MenuAdder';
import OrderMenuList from './component/OrderMenuList';
import UserInfo from './component/UserInfo';
import PayInfo from './component/PayInfo';
import OrderCancelDialog from './component/OrderCancelDialog';
import OrderSubMitButton from './component/OrderSubmitButton';
import {
searchOrderMenu,
fetchMenu,
fetchMenuStock,
changeAmount,
searchUserInfo,
searchUserInfoByMobile,
resetOrderData,
} from './actions';

class MenuChanger extends Component {

  constructor() {
    super();
    this.handleUserInput = this.handleUserInput.bind(this);
    this.handleOrderInput = this.handleOrderInput.bind(this);
    this.changeAmountOfDish = this.changeAmountOfDish.bind(this);
    this.resetData = this.resetData.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(fetchMenu());
  }

  handleOrderInput(orderIdx) {
    const self = this;
    this.props.dispatch(searchOrderMenu(orderIdx))
    .then(() => {
      const date = self.props.date;
      const area = self.props.area;
      this.props.dispatch(fetchMenuStock(date, area));
    })
    .then(() => {
      self.props.dispatch(searchUserInfo(self.props.userIdx));
    });
  }

  resetData() {
    this.props.dispatch(resetOrderData());
    return Promise.resolve();
  }


  handleUserInput(input) {
    const mobileExp = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
    const idxExp = /[0-9]{1,6}/;
    const trimedInput = input.trim();
    if (mobileExp.test(trimedInput)) {
      this.resetData().then(() =>
      this.props.dispatch(searchUserInfoByMobile(trimedInput))
    );
    } else if (idxExp.test(trimedInput)) {
      this.resetData().then(() =>
      this.props.dispatch(searchUserInfo(trimedInput))
    );
    } else {
      alert('잘못 입력했습니다. 입력한 번호를 확인해주세요.');
    }
  }


  changeAmountOfDish(amount, idx) {
    this.props.dispatch(changeAmount(amount, idx));
  }
  render() {
    return (
      <div>
        <Row>
          <AppBar
            title="메뉴 변경기"
            iconClassNameRight="muidocs-icon-navigation-expand-more"
          />
        </Row>
        <Row center="xs" className="top">
          <Col xs={8}>
            <OrderSearchBar onUserInput = {this.handleOrderInput} />
          </Col>
        </Row>
        <Row center="xs" className="top">
          <Col xs={8}>
            <UserSearchBar onUserInput = {this.handleUserInput} />
          </Col>
        </Row>
        <Row center="xs" className="top50">
          <Col xs={10}>
          <OrderMenuList
            selectedMenu = {this.props.selectedMenu}
            dispatch = {this.props.dispatch}
          />
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={10}>
          <MenuAdder stockList = {this.props.stockList}
            dispatch = {this.props.dispatch}
          />
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={10}>
            <UserInfo
              user = { this.props.user }
              dispatch = { this.props.dispatch }
            />
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={10}>
          <PayInfo
            originPrice = { this.props.originPrice }
            totalPrice = { this.props.totalPrice }
            pointUsed = { this.props.pointUsed }
            couponIdx = { this.props.couponIdx }
            date = { this.props.date }
            payMethod = {this.props.payMethod }
            area = { this.props.area }
            user = { this.props.user }
            dispatch = { this.props.dispatch }
          />
          </Col>
        </Row>
        <Row center="xs">
          <Col xs={3}>
          <OrderSubMitButton
            orderIdx = { this.props.orderIdx }
            dispatch = { this.props.dispatch }
          />
          </Col>
          <Col xs={3}>
          <OrderCancelDialog
            orderIdx = { this.props.orderIdx }
            dispatch = { this.props.dispatch }
          />
          </Col>
        </Row>
      </div>
    );
  }
}

MenuChanger.propTypes = {
  selectedMenu: PropTypes.arrayOf(PropTypes.instanceOf(SelectedDish)),
  dispatch: PropTypes.func.isRequired,
  date: PropTypes.node,
  payMethod: PropTypes.number,
  totalPrice: PropTypes.number,
  orderIdx: PropTypes.number,
  user: PropTypes.object,
  pointUsed: PropTypes.number,
  originPrice: PropTypes.number,
  couponIdx: PropTypes.number,
  area: PropTypes.string,
  stockList: PropTypes.arrayOf(PropTypes.instanceOf(Stock)),
};

function select(state) {
  const {
    menuChanger,
  } = state;
  return menuChanger;
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(MenuChanger);
