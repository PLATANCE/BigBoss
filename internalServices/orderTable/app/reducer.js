import {Actions} from "./actions"

const defaultState = {
  orders: []
};

function reduce(state = Object.assign({}, defaultState), action) {
  switch (action.type) {

    case Actions.RECEIVE_ORDER_LIST:
    {
      return Object.assign({}, state, {
        orders: action.orderList
      });
    }
    default:
      return state;
  }
};

export default reduce