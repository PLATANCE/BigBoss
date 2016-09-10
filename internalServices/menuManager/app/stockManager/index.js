import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DailyTable from './component/DailyTable';
import Paper from 'material-ui/Paper';
import ShowStockPageUpper from './component/StockManagerUpper';

import moment from 'moment';
import {
  fetchMenuDaily,
  updateMenuDaily,
  setOpenApplyDialog,
  changeEditMode,
  changeStockBuffer,
  resetStockTransaction,
  initialize,
  updateMenuDailyPriority,
  sortBy,
  setPriority,
  checkNeedSync,
} from './actions';
class StockManager extends Component {

  constructor() {
    super();

    this.handleChangeStock = (event, value) => {
      const whatToChange = JSON.parse(event.target.id);
      this.props.dispatch(changeStockBuffer(this.props.stockTransaction, value, whatToChange));
    };

    this.handleDialogClose = () => {
      this.props.dispatch(setOpenApplyDialog(false));
    };

    this.handleDialogApply = () => {
      this.props.dispatch(updateMenuDaily(this.props.stockTransaction, this.props.date))  // 재고 변경사항을 디비에 업테이트
      .then(() => this.props.dispatch(setPriority(this.props.priorityTransaction, this.props.tableData, this.props.attr.length - 2))) // 태아불의 순서대로 priority룰 채우고
      .then(() => this.props.dispatch(updateMenuDailyPriority(this.props.priorityTransaction, this.props.date))) // priority 를 디비에 업데이트
      .then(() => this.props.dispatch(setOpenApplyDialog(false))) // 다이얼로그 창을 닫음
      .then(() => this.props.dispatch(changeEditMode(false))) // 모드를 바꿈
      .then(() => this.props.dispatch(resetStockTransaction())) // 수정사항을 초기화
      .then(() => this.props.dispatch(fetchMenuDaily(this.props.date))) // 디비에서 테이블을 다시 가져옴
      .then(() => this.props.dispatch(sortBy(this.props.tableData, this.props.attr.length - 2))); // 가져온 데이터를 priority에 따라 정렬
    };

    this.checkNeedSyncMenuDailyDB = () => {
      this.props.dispatch(checkNeedSync(this.props.date, this.props.data));
    }

    this.refreshTable = () => {
      this.props.dispatch(fetchMenuDaily(this.props.date))
        .then(() => this.props.dispatch(sortBy(this.props.tableData, this.props.attr.length - 2)));
    }
  }

  componentWillMount() {
    const currentDate = moment().format('YYYY-MM-DD');
    this.props.dispatch(initialize());
    this.props.dispatch(fetchMenuDaily(currentDate))
      .then(() => this.props.dispatch(sortBy(this.props.tableData, this.props.attr.length - 2)));
    this.refreshTable();
    // this.timerId = setInterval(this.checkNeedSyncMenuDailyDB, 3000);
  }

  showTransaction() {
    let str = [];
    str.push(<div> 수량 변경 </div>);
    Object.keys(this.props.stockTransaction).forEach((key) => {
      str.push(key + '번 메뉴 : ' + JSON.stringify(this.props.stockTransaction[key]));
      str.push(<br />);
    });
    str.push(<br />);
    str.push(<div> 우선순위 변경 </div>);
    Object.keys(this.props.priorityTransaction).forEach((key) => {
      str.push(key + '번 메뉴의 우선순위 -> ' + JSON.stringify(this.props.priorityTransaction[key]));
      str.push(<br />);
    });

    return str;
  }

  render() {
    return (
      <div style = {this.props.style}>
        <ShowStockPageUpper handleRefresh={this.refreshTable}/>
        <div className="ShowStockPageBody">
          <DailyTable />
        </div>

        <Dialog
          title="수정사항을 검토해주세요 !"
          actions={[
            <FlatButton
              label="취소"
              primary
              onTouchTap={this.handleDialogClose}
            />,
            <FlatButton
              label="적용"
              primary
              keyboardFocused
              onTouchTap={this.handleDialogApply}
            />,
          ]}
          modal={false}
          open={this.props.openApplyDialog}
          onRequestClose={this.handleDialogClose}
        >
          {this.showTransaction()}
        </Dialog>

        <p>
          <br/><br/>
          <ul>
            <li>'편집'버튼을 누르면 편집이 가능합니다 </li>
            <li>우선순위를 변경 하면 수정사항이 초기화 되니 주의해 주세요 </li>
            <li>편집모드에서 테이블 좌측 :::마크를 드래그 & 드랍 하여 메뉴의 우선순위를 바꿉니다 </li>
            <li>'적용'을 눌렀을 때만 재고와 우선순위가 DB에 반영됩니다 </li>
            <li>(매뉴 1개는 지역이 달라도 같은 우선순위를 가져야 합니다) </li>
          </ul>
        </p>

        <Paper style={{textAlign: 'center', color: 'red', visibility: this.props.needSync ? 'visible' : 'hidden'}} zDepth={4}>
          <div>
            데이터가 외부에서 변경되어 새로고침이 필요합니다
          </div>
          <RaisedButton
            label="새로고침"
            style={{margin:12, width:400}}
            secondary onTouchTap={this.refreshTable}
          />
        </Paper>
      </div>
    );
  }
}

StockManager.propTypes = {
  date: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.instanceOf(Object)),
  stockTransaction: PropTypes.Object,
  dispatch: PropTypes.func.isRequired,
  openApplyDialog: PropTypes.boolean,
  tableData: PropTypes.array,
};

function select(state) {
  const {
    stockManager,
  } = state;
  return stockManager;
}

export default connect(select)(StockManager);
