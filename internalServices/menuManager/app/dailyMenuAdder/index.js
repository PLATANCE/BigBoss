
import React, { PropTypes, Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import DailyMenuAdderUpper from './component/DailyMenuAdderUpper';
import DailyMenuAdderFooter from './component/DailyMenuAdderFooter';
import MenuTable from './component/MenuTable';

import { connect } from 'react-redux';
import {
  initialize,
  fetchMenuReadied,
  selectWeek,
  fetchMenuDailyPeriod,
  fillOriginDailyData,
  fetchAreaList,
  setOpenApplyAddDialog,
  addDailyMenu,
} from './actions';

class DailyMenuAdder extends Component {

  constructor() {
    super();

    this.handleDialogApply = () => {

      this.props.transaction.forEach((eachTrans) => {
        this.props.dispatch(addDailyMenu(eachTrans.menuIdx, eachTrans.area, eachTrans.serve_date, eachTrans.stock));
      });

      this.props.dispatch(setOpenApplyAddDialog(false));
    }

    this.handleDialogClose = () => {
      this.props.dispatch(setOpenApplyAddDialog(false));
    }

    this.refresh = () => {
      this.props.dispatch(fetchAreaList())
        .then(() => this.props.dispatch(fetchMenuReadied()))
        .then(() => {
          this.props.dispatch(selectWeek(this.props.firstDayOfWeek));
          return this.props.dispatch(fetchMenuDailyPeriod(
            this.props.firstDayOfWeek,
            this.props.lastDayOfWeek));
        })
        .then(() => this.props.dispatch(fillOriginDailyData(
          this.props.inputMap,
          this.props.periodDailyData,
          this.props.menuIdxIndexMap,
          this.props.weekMap,
        )));
    }

  }

  componentDidMount() {
    this.props.dispatch(initialize());
    this.refresh();
  }

  render() {
    return (
      <div style={this.props.style}>
        <DailyMenuAdderUpper handleRefresh={this.refresh}/>
        <MenuTable />

        <ul>
          <li>메뉴 추가 시스템으로, 이미 추가된 메뉴가 지워지는 경우는 없습니다.</li>
          <li>언체크된 항목은 업데이트에서 제외됩니다.</li>
          <li>날짜는 월요일만 선택할 수 있습니다.</li>
          <li>생산량은 새로 입력한 숫자로 덮어쓰기 됩니다.</li>
        </ul>

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
          open={this.props.openApplyAddDialog}
          onRequestClose={this.handleDialogClose}
        >
          {JSON.stringify(this.props.transaction)}
        </Dialog>

        <DailyMenuAdderFooter />
      </div>
    );
  }
}

function select(state) {
  const {
    dailyMenuAdder,
  } = state;
  return dailyMenuAdder;
}

export default connect(select)(DailyMenuAdder);
