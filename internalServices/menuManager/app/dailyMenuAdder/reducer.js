/**
 * Created by limhwangyu on 2016. 8. 3..
 */
import { Actions } from './actions'
import moment from 'moment';

const defaultMenuManagerState = {
  firstDayOfWeek: moment().weekday(1).format('YYYY-MM-DD'),
  lastDayOfWeek: moment().weekday(7).format('YYYY-MM-DD'),
  inputMap: [],
  week: [],
  data: [],
  menuIdxIndexMap: {},
  weekMap: {},
  defaultStock: 0,
  periodDailyData: [],
  areaList: [],
  transaction: [],
  openApplyAddDialog: false,
};

function dailyMenuAdder(state = Object.assign({}, defaultMenuManagerState), action) {
  switch (action.type) {
    case Actions.INITIALIZE:
      {
        return Object.assign({}, state, defaultMenuManagerState)
      }

    case Actions.SELECT_WEEK:
      {
        const { firstDayOfWeek } = action;
        let week = [];
        let weekMap = {};
        let lastDayOfWeek;
        for(let i = 0; i < 7; i++) {
          week[i] = moment(firstDayOfWeek, 'YYYY-MM-DD').add(i, 'days').format('YYYY-MM-DD');
          weekMap[week[i]] = i;
          lastDayOfWeek = week[i];
        }
        return Object.assign({}, state, {
          firstDayOfWeek,
          lastDayOfWeek,
          week,
          weekMap,
        });
      }

    case Actions.RECEIVE_MENU_READIED:
      {
        const { data } = action;
        let inputMap = [];
        let menuIdxIndexMap = {};
        let len = data.length;

        for(let i = 0; i < len; i++) {
          inputMap[i] = [];
          menuIdxIndexMap[data[i].idx] = i;

          for(let j = 0; j < 7; j++) {
            state.areaList.forEach((area) => {
              if(typeof(inputMap[i][j]) === 'undefined') {
                inputMap[i][j] = {};
              }

              inputMap[i][j][area] = {
                checked: false,
                changed: false,
                value: 0,
              };
            });
          }

        }
        return Object.assign({}, state, {
          data,
          inputMap,
          menuIdxIndexMap,
        });
      }

    case Actions.SET_INPUT_MAP:
      {
        const { inputMap } = action;
        return Object.assign({}, state, {
          inputMap,
        });
      }

    case Actions.SET_DEFAULT_STOCK:
      {
        const { defaultStock } = action;
        return Object.assign({}, state, {
          defaultStock,
        });
      }

    case Actions.SET_PERIOD_DAILY_DATA:
      {
        const { periodDailyData } = action;
        return Object.assign({}, state, {
          periodDailyData,
        });
      }

    case Actions.SET_AREA_LIST:
      {
        const { areaList } = action;
        return Object.assign({}, state, {
          areaList,
        });
      }

    case Actions.SET_TRANSACTION:
      {
        const { transaction } = action;
        return Object.assign({}, state, {
          transaction,
        });
      }

    case Actions.SET_OPEN_APPLY_ADD_DIALOG:
      {
        const { openApplyAddDialog } = action;
        return Object.assign({}, state, {
          openApplyAddDialog,
        });
      }

    default:
    {
      return state;
    }
  }
}

export default dailyMenuAdder;