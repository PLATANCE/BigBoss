import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import TimeSlot from './TimeSlot';

import {
  searchOrderTimeSlot,
  saveTimeSlot,
  fetchTimeSlot,
  selectTimeSlot,
} from './actions';

class TimeChanger extends Component {
  componentDidMount() {
    const {
      dispatch,
    } = this.props;
    dispatch(fetchTimeSlot());
  }

  render() {
    const {
      dispatch,
      selectedTimeSlot,
      timeSlots,
    } = this.props;
    const timeSlotList = [];

    timeSlots.forEach(timeSlot => {
      timeSlotList.push(
        <li key={timeSlot.idx}>
          <a onClick={() => dispatch(selectTimeSlot(timeSlot))} >
          {timeSlot.time}
          </a>
        </li>);
    });

    const selectedTime = selectedTimeSlot ? selectedTimeSlot.time : false;
    return (
      <div className="container-fluid">
        <div className="row">
          <input
            ref="orderIdxInput"
            className="col-xs-7"
            type="text"
            placeholder="주문 번호"
          />
          <div className="col-xs-1"></div>
          <button className="col-xs-4" onClick={() => {
            const orderIdx = parseInt(this.refs.orderIdxInput.value, 10);
            return dispatch(searchOrderTimeSlot(orderIdx));
          }}
          >검색</button>
        </div>
        <div className="row">
          <div className="col-xs-8">
            <div className="dropdown">
              <button className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                {selectedTime}
                <span className="caret"></span>
              </button>
              <ul className="dropdown-menu">
                {timeSlotList}
              </ul>
            </div>
          </div>
          <button className="col-xs-4" onClick={() => dispatch(saveTimeSlot())}>변경</button>
        </div>
      </div>
    );
  }
}

TimeChanger.propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedTimeSlot: PropTypes.instanceOf(TimeSlot),
  timeSlots: PropTypes.arrayOf(PropTypes.instanceOf(TimeSlot)),
};

function select(state) {
  const {
    timeChanger,
  } = state;
  return timeChanger;
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(TimeChanger);
