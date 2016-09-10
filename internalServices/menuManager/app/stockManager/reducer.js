import { Actions } from './actions';
import moment from 'moment';

const defaultStockManagerState = {
  date: moment().format('YYYY-MM-DD'),
  data: [],
  stockTransaction: {},
  editMode: false,
  tableData: [],
  priorityTransaction: {},
  attr: [],
  needSync: false,
};

function stockManager(state = Object.assign({}, defaultStockManagerState), action) {
  switch (action.type) {

    case Actions.INITIALIZE:
      {
        return Object.assign({}, state, defaultStockManagerState);
      }

    case Actions.RESET_STOCK_TRANSACTION:
      {
        const { stockTransaction, priorityTransaction } = action;
        return Object.assign({}, state, {
          stockTransaction,
          priorityTransaction,
        });
      }

    case Actions.RECEIVE_MENU_DAILY:
      {
        const { date, data } = action;
        return Object.assign({}, state, {
          date,
          data,
        });
      }

    case Actions.RECEIVE_STOCK_PARSED:
      {
        const { parsedStock, areaArr, attr, tableData } = action;
        const temp = Object.assign({}, state, {
          parsedStock,
          areaArr,
          attr,
          tableData,
        });
        return temp;
      }

    case Actions.RESET_DAILY_TABLE_CELL:
      {
        const value = 0;
        return Object.assign({}, state, {
          value,
        });
      }

    case Actions.CHANGE_EDIT_MODE:
      {
        const { editMode } = action;
        return Object.assign({}, state, {
          editMode,
        });
      }

    case Actions.CHANGE_NEED_SYNC:
    {
      const { needSync } = action;
      return Object.assign({}, state, {
        needSync,
      });
    }

    case Actions.SET_OPEN_APPLY_ADD_DIALOG:
      {
        const { openApplyDialog } = action;
        return Object.assign({}, state, {
          openApplyDialog,
        });
      }

    case Actions.SET_STOCK_TRANSACTION:
      {
        const { stockTransaction } = action;
        return Object.assign({}, state, {
          stockTransaction,
        });
      }

    case Actions.SET_TABLE_DATA:
      {
        const { tableData } = action;
        return Object.assign({}, state, {
          tableData,
        });
      }

    case Actions.SET_PRIORITY_TRANSACTION:
      {
        const { priorityTransaction } = action;
        return Object.assign({}, state, {
          priorityTransaction,
        });
      }

    default:
      {
        return state;
      }
  }
}

export default stockManager;
