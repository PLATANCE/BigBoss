import { Actions } from './actions';
import TimeSlot from './TimeSlot';

const defaultTimeChangerState = {
  orderIdx: undefined,
  selectedTimeSlot: undefined,
  timeSlots: [],
};
function timeChanger(state = Object.assign({}, defaultTimeChangerState), action) {
  switch (action.type) {
    case Actions.REQUEST_ORDER_TIME_SLOT:
      {
        const { orderIdx } = action;
        return Object.assign({}, state, {
          orderIdx,
        });
      }
    case Actions.RECEIVE_ORDER_TIME_SLOT:
      {
        const { data } = action;
        const { idx, time } = data;
        const selectedTimeSlot = new TimeSlot(idx, time);
        return Object.assign({}, state, {
          selectedTimeSlot,
        });
      }
    case Actions.RECEIVE_TIME_SLOT:
      {
        const { data } = action;
        const timeSlots = [];
        if (data && data.timeSlots) {
          data.timeSlots.forEach(row => {
            const { idx, time } = row;
            const timeSlot = new TimeSlot(idx, time);
            timeSlots.push(timeSlot);
          });
        }
        return Object.assign({}, state, {
          timeSlots,
        });
      }
    case Actions.SELECT_TIME_SLOT:
      {
        const { timeSlot } = action;
        return Object.assign({}, state, {
          selectedTimeSlot: timeSlot,
        });
      }
    default:
      return state;
  }
}

export default timeChanger;
