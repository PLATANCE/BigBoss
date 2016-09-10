/**
 * Created by limhwangyu on 2016. 8. 3..
 */
import stockManager from './stockManager/reducer';
import dailyMenuAdder from './dailyMenuAdder/reducer'
import { Actions } from './actions'

const defaultMenuManagerState = {
  selectedMenu: 'stockManager',
};

function menuManager(state = Object.assign({}, defaultMenuManagerState), action) {
  switch (action.type) {
    case Actions.INITIALIZE:
      {
        return Object.assign({}, state, defaultMenuManagerState)
      }
    case Actions.SELECT_MENU:
      {
        const { selectedMenu } = action;
        return Object.assign({}, state, {
          selectedMenu,
        });
      }
    default:
      {
        return state;
      }
  }
}

module.exports = {
  stockManager,
  menuManager,
  dailyMenuAdder,
};