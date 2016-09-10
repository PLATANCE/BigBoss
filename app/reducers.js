import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import addressBulldozer from '../internalServices/addressBulldozer/app/reducer';
import timeChanger from '../internalServices/timeChanger/app/reducer';
import menuChanger from '../internalServices/menuChanger/app/reducer';
import forceSMSAuth from '../internalServices/forceSMSAuth/app/reducer';
import { stockManager, menuManager, dailyMenuAdder } from '../internalServices/menuManager/app/reducer';
import orderTable from '../internalServices/orderTable/app/reducer';
import B2BManager from '../internalServices/B2BManager/app/reducer';

const reducers = combineReducers({
  routing: routerReducer,
  addressBulldozer,
  timeChanger,
  menuChanger,
  stockManager,
  menuManager,
  dailyMenuAdder,
  forceSMSAuth,
  orderTable,
  B2BManager,
});
export default reducers;
