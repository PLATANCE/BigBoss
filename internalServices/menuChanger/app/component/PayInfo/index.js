import React, { PropTypes, Component } from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/RaisedButton';
import {
  applyPoint,
} from '../../actions';


export default class PayInfo extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleClick() {
    const point = parseInt(this.refs.userPointApply.input.value, 10);
    this.props.dispatch(applyPoint(point));
  }

  handleFocus() {
    this.refs.userPointApply.input.value = '';
  }

  render() {
    if (!this.props.date) {
      return null;
    }
    let couponDiscount;
    let couponName;
    let payMethod = '현장결제';
    let area = '강남';
    if (this.props.area === 'seoul-2') {
      area = '송파';
    } else if (this.props.area === 'captain1') {
      area = '캡틴-1';
    }
    if (!this.props.couponIdx) {
      couponName = '쿠폰 적용 안함';
      couponDiscount = 0;
    } else if (this.props.couponIdx === 30) {
      couponName = '1만원 할인 쿠폰';
      couponDiscount = 10000;
    } else if (this.props.couponIdx === 40) {
      couponName = '복날 주문시, 산펠 무료. 메뉴 변경시 복날, 산펠 빼야하면 개발자에게 연락!';
      couponDiscount = 2000;
    } else if (this.props.couponIdx === 41) {
      couponName = '복날 메뉴 2개 주문시 샐러드무료. 변경시 복날,샐러드 빼야하면 개발자에게 연락!';
      couponDiscount = 4000;
    } else if (this.props.couponIdx === 42) {
      couponName = '메인메뉴 3+1 이벤트. 변경시 3개미만이면 개발자에게 연락!';
      couponDiscount = 10000;
    } else if (this.props.couponIdx === 43) {
      couponName = '메인메뉴 2개 주문시 샐러드무료. 변경시 메뉴,샐러드 빼야하면 개발자에게 연락!';
      couponDiscount = 4000;
    } else if (this.props.couponIdx === 44) {
      couponName = '산펠 무료! 산펠 뺴야하면 개발자 노티!';
      couponDiscount = 2000;
    } else if (this.props.couponIdx === 45) {
      couponName = '신한 10% 할인. 수정 시 무조건 개발자 연락.';
      couponDiscount = 0;
    } else if (this.props.couponIdx === 48) {
      couponName = '20% 할인.';
      couponDiscount = this.props.totalPrice * 0.2;
    } else if (this.props.couponIdx === 999) {
      couponName = '20% 할인.';
      couponDiscount = this.props.totalPrice * 0.2;
    } else {
      couponName = '알 수 없는 쿠폰. 개발자에게 연락해요.';
      couponDiscount = 0;
    }
    if (this.props.payMethod === 1) {
      payMethod = '카드 선결제. 카드 취소하셔야 합니다.';
    }
    return (
      <div>
        <h3>결제 정보</h3>
        <h4>주문 지역 : { this.props.area.concat('  ', area)}</h4>
        <h4>결제 방법 : { payMethod }</h4>
        <h4>수정 전 결제 금액 : { this.props.originPrice }</h4>
        <h4>사용한 포인트 : { this.props.pointUsed }</h4>
        <h4>적용한 쿠폰 : { couponName }</h4>
        <TextField
          id="userPointApply"
          ref="userPointApply"
          floatingLabelText="포인트 적용"
          hintText="사용할 포인트 양을 입력해주세요."
          onFocus={this.handleFocus}
          errorText={this.errorText}
        />
        <FlatButton
          className="pointButton"
          onTouchTap={this.handleClick}
          label="적용하기"
        />
        <h4>쿠폰 할인 : { couponDiscount }</h4>
        <h4>최종 결제가격 : { this.props.totalPrice }</h4>
        <h4>가격 변동 : { this.props.totalPrice - this.props.originPrice }</h4>
      </div>
    );
  }
}

PayInfo.propTypes = {
  totalPrice: PropTypes.number,
  pointUsed: PropTypes.number,
  originPrice: PropTypes.number,
  couponIdx: PropTypes.number,
  date: PropTypes.node,
  payMethod: PropTypes.number,
  area: PropTypes.string,
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
};
