import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'material-ui/DatePicker';
import moment from 'moment';
import {
  selectWeek,
  fetchAreaList,
  fetchMenuReadied,
  fetchMenuDailyPeriod,
  fillOriginDailyData,
} from '../actions'

const textStyles = {
  fontSize: 24,
};

function selectFirstDayOfWeek(date) {
  return date.getDay() !== 1;
}

class WeekPicker extends Component {

  handleChange = (event, date) => {
    const formeddate = moment(date).format('YYYY-MM-DD');

    this.props.dispatch(fetchAreaList())
      .then(() => this.props.dispatch(fetchMenuReadied()))
      .then(() => {
        this.props.dispatch(selectWeek(formeddate));
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
  };

  render() {
    return (
      <div>
        <DatePicker
          className="DayPicker"
          hintText={this.props.firstDayOfWeek}
          autoOk='true'
          textFieldStyle={textStyles}
          container="inline"
          mode="landscape"
          shouldDisableDate={selectFirstDayOfWeek}
          onChange={this.handleChange}
        />
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

export default connect(select)(WeekPicker);
