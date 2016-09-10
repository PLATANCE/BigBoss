import React, { PropTypes, Component } from 'react';

export default class MainController extends Component {
  constructor(props) {
    super(props);

    // bind event handler
    this.onSearchButtonClicked = this.onSearchButtonClicked.bind(this);
    this.onClearButtonClicked = this.onClearButtonClicked.bind(this);
  }

  onSearchButtonClicked() {
    const orderIdx = parseInt(this.refs.searchOrderIdxInput.value, 10);
    this.props.fetchOrderAddress(orderIdx);
  }

  onClearButtonClicked() {
    this.props.clear();
  }

  render() {
    const {
      orderIdx,
      addressIdx,
      jibunAddress,
      roadNameAddress,
      addressDetail,
      newJibunAddress,
      newAddressDetail,
      newAddressLatitude,
      newAddressLongitude,
      newAddressAvailable,
      onChangeNewAddressDetail,
      onNextOrderAddress,
      requestSaveNewAddress,
    } = this.props;

    return (
      <div className="container-fluid">
        <div className="row">
          <input
            ref="searchOrderIdxInput"
            className="col-xs-5"
            type="text"
            placeholder="주문번호"
          />
          <div className="col-xs-1"></div>
          <button className="col-xs-2" onClick={this.onSearchButtonClicked}>검색</button>
          <button className="col-xs-2" onClick={onNextOrderAddress}>다음</button>
          <button className="col-xs-2" onClick={this.onClearButtonClicked}>초기화</button>
        </div>
        <div>
          <div className="row">
            <div className="col-xs-2">주문 번호</div>
            <div className="col-xs-10">{orderIdx}</div>
          </div>
          <div className="row">
            <div className="col-xs-2">주소 번호</div>
            <div className="col-xs-10">{addressIdx}</div>
          </div>
          <div className="row">
            <div className="col-xs-2">지번주소</div>
            <div className="col-xs-10">{jibunAddress}</div>
          </div>
          <div className="row">
            <div className="col-xs-2">도로명주소</div>
            <div className="col-xs-10">{roadNameAddress}</div>
          </div>
          <div className="row">
            <div className="col-xs-2">상세 주소</div>
            <div className="col-xs-10">{addressDetail}</div>
          </div>
        </div>
        <div className="row">
          New
        </div>
        <div>
          <div className="row">
            <div className="col-xs-2">새 상세주소</div>
            <input
              className="col-xs-10"
              type="text"
              value={newAddressDetail}
              onChange={(event) => onChangeNewAddressDetail(event.target.value)}
            />
          </div>
          <div className="row">
            <div className="col-xs-2">새 지번주소</div>
            <input
              className="col-xs-10"
              type="text"
              value={newJibunAddress}
              readOnly
            />
          </div>
          <div className="row">
            <div className="col-xs-6">새 위도</div>
            <div className="col-xs-6">{newAddressLatitude}</div>
          </div>
          <div className="row">
            <div className="col-xs-6">새 경도</div>
            <div className="col-xs-6">{newAddressLongitude}</div>
          </div>
          <div className="row">
            <div className="col-xs-6">배달 가능</div>
            <div className="col-xs-6">{newAddressAvailable ? '가능지역' : '불가능지역'}</div>
          </div>
        </div>
        <div className="row">
            <button className="col-xs-4">삭제</button>
            <div className="col-xs-4"></div>
            <button className="col-xs-4" onClick={requestSaveNewAddress}>저장</button>
        </div>
      </div>
    );
  }
}

MainController.propTypes = {
  orderIdx: PropTypes.number,
  addressIdx: PropTypes.number,
  jibunAddress: PropTypes.string,
  roadNameAddress: PropTypes.string,
  addressDetail: PropTypes.string,
  newJibunAddress: PropTypes.string,
  newRoadNameAddress: PropTypes.string,
  newAddressDetail: PropTypes.string,
  newAddressLatitude: PropTypes.number,
  newAddressLongitude: PropTypes.number,
  newAddressAvailable: PropTypes.bool,
  fetchOrderAddress: PropTypes.func.isRequired,
  onChangeNewAddressDetail: PropTypes.func.isRequired,
  onNextOrderAddress: PropTypes.func.isRequired,
  requestSaveNewAddress: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
};
