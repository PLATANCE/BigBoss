import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import RaisedButton from 'material-ui/RaisedButton';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';

import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';

import theme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import DayPicker from './DayPicker';
import {
  changeEditMode,
  setOpenApplyDialog,
  sortBy,
  setPriority,
  resetStockTransaction,
  fetchMenuDaily,
} from '../actions';
class StockManagerUpper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };

    StockManagerUpper.childContextTypes = {
      muiTheme: React.PropTypes.object.isRequired,
    };

    this.getChildContext = function getChildContext() {
      return { muiTheme: getMuiTheme(theme) };
    };

    this.handleToggle = () => this.setState({ open: !this.state.open });

    this.handleChangeEditMode = () => {
      this.props.dispatch(changeEditMode(true));
    };

    this.handleCancelEdit = () => {
      this.props.dispatch(changeEditMode(false));
      this.props.dispatch(resetStockTransaction());
      this.props.dispatch(fetchMenuDaily(this.props.date))
        .then(() => this.props.dispatch(sortBy(this.props.tableData, this.props.attr.length - 2)));
    };

    this.handleEnsureApply = () => {
      this.props.dispatch(setPriority(this.props.priorityTransaction, this.props.tableData, this.props.attr.length - 2)); // 태아불의 순서대로 priority룰 채우고
      this.props.dispatch(setOpenApplyDialog(true));
    };

    this.handleSortByIdx = () => {
      this.props.dispatch(sortBy(this.props.tableData, 0));
      // pivot column index : 0
    };

    this.handleSortByPriority = () => {
      this.props.dispatch(sortBy(this.props.tableData, this.props.attr.length - 2));
      // pivot column index
    };

    // 현재 순서로 적용 버튼 삭제
    // this.handleSetPriority = () => {
    //   this.props.dispatch(setPriority(this.props.priorityTransaction, this.props.tableData, this.props.attr.length - 2));
    // };
  }

  render() {
    return (
      <Toolbar style={this.props.editMode ? { backgroundColor: '#FFFF00' } : {}}>
        <ToolbarGroup firstChild>
          <ToolbarSeparator />
          <ToolbarTitle
            text={this.props.editMode ? '편집모드' : '보기모드'}
            style={this.props.editMode ? {color: '#FF0000'} : {}}
          />
          <DayPicker />
        </ToolbarGroup>

        <div style={ this.props.editMode ? {} : {visibility: 'hidden'}}>
          <ToolbarSeparator />
          <RaisedButton
            label='정렬(Idx)'
            disabled={!this.props.editMode}
            onTouchTap={this.handleSortByIdx}
          />

          <RaisedButton
            label='정렬(순서)'
            disabled={!this.props.editMode}
            onTouchTap={this.handleSortByPriority}
          />

          <ToolbarSeparator />

          <RaisedButton
            label='저장'
            disabled={!this.props.editMode}
            primary onTouchTap={this.handleEnsureApply}
          />

          <RaisedButton
            label='취소'
            disabled={!this.props.editMode}
            onTouchTap={this.handleCancelEdit}
          />
          <ToolbarSeparator />
        </div>

        <ToolbarGroup>

          <RaisedButton
            style={ !this.props.editMode ? {} : {visibility: 'hidden'}}
            label='새로고침'
            disabled={this.props.editMode}
            onTouchTap={this.props.handleRefresh}
          />

          <RaisedButton
            style={ !this.props.editMode ? {} : {visibility: 'hidden'}}
            label='편집'
            disabled={this.props.editMode}
            primary onTouchTap={this.handleChangeEditMode}
          />

          <ToolbarSeparator />
          <div>
            <RaisedButton
              label="History"
              onTouchTap={this.handleToggle}
            />
            <Drawer
              width={500}
              open={this.state.open}
              docked={false}
              openSecondary
              onRequestChange={(open) => this.setState({ open })}
            >
              <AppBar title="History" />
              편집기록
            </Drawer>
          </div>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

StockManagerUpper.propTypes = {
  dispatch: PropTypes.func.isRequired,
  editMode: PropTypes.boolean,
  tableData: PropTypes.array,
};

function select(state) {
  const {
    stockManager,
  } = state;
  return stockManager;
}

export default connect(select)(StockManagerUpper);
