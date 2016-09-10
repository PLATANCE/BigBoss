import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import WeekPicker from './WeekPicker';
import RaisedButton from 'material-ui/RaisedButton';

import {
  setDefaultStock,
  updateTransaction,
  setOpenApplyAddDialog,
} from '../actions';

class DailyMenuAdderUpper extends Component {

  constructor() {
    super();
    this.handelDefaultStockChange = (event) => {
      if(event.target.value !== '') {
        this.props.dispatch(setDefaultStock(parseInt(event.target.value)));
      }
      else {
        this.props.dispatch(setDefaultStock(0));
      }
    };

    this.handleApply = () => {
      this.props.dispatch(updateTransaction(
        this.props.inputMap,
        this.props.data,
        this.props.week,
        this.props.areaList))
      .then(() => this.props.dispatch(setOpenApplyAddDialog(true)));
    }
  }

  render() {
    return (
      <Toolbar>
        <ToolbarGroup firstChild>
          <ToolbarSeparator />
          {/*<ToolbarTitle*/}
            {/*text={this.props.editMode ? '편집모드' : '보기모드'}*/}
            {/*style={this.props.editMode ? {color: '#FF0000'} : {}}*/}
          {/*/>*/}
          <WeekPicker />

          <ToolbarSeparator />
          <ToolbarTitle text="기본값" />
          <input
            type="number"
            value={this.props.defaultStock}
            onChange={this.handelDefaultStockChange}
            style={{margin: 12, width: 50, textAlign: 'center'}}
          />

        </ToolbarGroup>

        <ToolbarGroup>

          <RaisedButton
            label='새로고침'
            onTouchTap={this.props.handleRefresh}
          />

          <RaisedButton
            label='메뉴 추가'
            primary onTouchTap={this.handleApply}
          />

          {/*<ToolbarSeparator />*/}
          {/*<div>*/}
            {/*<RaisedButton*/}
              {/*label="History"*/}
              {/*onTouchTap={this.handleToggle}*/}
            {/*/>*/}
            {/*<Drawer*/}
              {/*width={500}*/}
              {/*open={this.state.open}*/}
              {/*docked={false}*/}
              {/*openSecondary*/}
              {/*onRequestChange={(open) => this.setState({ open })}*/}
            {/*>*/}
              {/*<AppBar title="History" />*/}
              {/*편집기록*/}
            {/*</Drawer>*/}
          {/*</div>*/}
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

function select(state) {
  const {
    dailyMenuAdder,
  } = state;
  return dailyMenuAdder;
}

export default connect(select)(DailyMenuAdderUpper);

