import moment from 'moment';
export const Actions = {
  INITIALIZE: 'INITIALIZE',
  SELECT_WEEK: 'SELECT_WEEK',
  RECEIVE_MENU_READIED: 'RECEIVE_MENU_READIED',
  SET_INPUT_MAP: 'SET_INPUT_MAP',
  SET_DEFAULT_STOCK: 'SET_DEFAULT_STOCK',
  SET_PERIOD_DAILY_DATA: 'SET_PERIOD_DAILY_DATA',
  SET_AREA_LIST: 'SET_AREA_LIST',
  SET_TRANSACTION: 'SET_TRANSACTION',
  SET_OPEN_APPLY_ADD_DIALOG: 'SET_OPEN_APPLY_ADD_DIALOG',
};

export function initialize() {
  return {
    type: Actions.INITIALIZE,
  }
}

export function selectWeek(firstDayOfWeek) {
  return {
    type: Actions.SELECT_WEEK,
    firstDayOfWeek,
  }
}

export function receiveMenuReadied(data) {
  return {
    type: Actions.RECEIVE_MENU_READIED,
    data,
  }
}

export function setInputMap(inputMap) {
  return {
    type: Actions.SET_INPUT_MAP,
    inputMap,
  }
}

export function setDefaultStock(defaultStock) {
  return {
    type: Actions.SET_DEFAULT_STOCK,
    defaultStock,
  }
}

export function setPeriodDailyData(periodDailyData) {
  return {
    type: Actions.SET_PERIOD_DAILY_DATA,
    periodDailyData,
  }
}

export function setAreaList(areaList) {
  return {
    type: Actions.SET_AREA_LIST,
    areaList,
  }
}

export function setTransaction(transaction) {
  return {
    type: Actions.SET_TRANSACTION,
    transaction,
  }
}

export function setOpenApplyAddDialog(openApplyAddDialog) {
  return {
    type: Actions.SET_OPEN_APPLY_ADD_DIALOG,
    openApplyAddDialog,
  }
}

export function changeInputMapEnable(inputMap, rowIdx, area, day) {
  return (dispatch) => {
    let newInputMap = inputMap;
    newInputMap[rowIdx][day][area].checked = !newInputMap[rowIdx][day][area].checked;
    newInputMap[rowIdx][day][area].changed = true;
    dispatch(setInputMap(newInputMap));
    return Promise.resolve();
  }
}

export function setInputMapStock(inputMap, rowIdx, day, area, value) {
  return (dispatch) => {
    let newInputMap = inputMap;
    newInputMap[rowIdx][day][area].value = value;
    newInputMap[rowIdx][day][area].changed = true;
    dispatch(setInputMap(newInputMap));
    return Promise.resolve();
  }
}


export function fetchMenuReadied() {
  return (dispatch) =>
    fetch(`/menuManager/menu/readied`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 404) {
          return Promise.reject(new Error('Menu 테이블을 가져올 수 없습니다.'));
        }
        return response.json();
      })
      .then(data => {
        dispatch(receiveMenuReadied(data.message));
        return data.message;
      })
      .then((stockArr) => Promise.resolve());
}

export function fetchMenuDailyPeriod(startDate, endDate) {
  return (dispatch) =>
    fetch(`/menuManager/menu/period/${startDate}/${endDate}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 404) {
          return Promise.reject(new Error('Menu 테이블을 가져올 수 없습니다.'));
        }
        return response.json();
      })
      .then(data => data.message)
      .then((data) => {
        dispatch(setPeriodDailyData(data));
        return Promise.resolve();
      });
}

export function fetchAreaList() {
  return (dispatch) =>
    fetch(`/menuManager/area/all`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 404) {
          return Promise.reject(new Error('MenuDaily 테이블을 가져올 수 없습니다.'));
        }
        return response.json();
      })
      .then(data => data.message)
      .then((data) => {
        let areas = [];
        data.forEach((value) => {
          areas.push(value.area)
        });
        dispatch(setAreaList(areas));
        return Promise.resolve();
      });
}

export function fillOriginDailyData(inputMap, periodDailyData, menuIdxIndexMap, weekMap) {
  return dispatch => {
    let newInputMap = inputMap;
    periodDailyData.forEach((menuDailyRow) => {
      let rowIndex, colIndex, area;
      rowIndex = menuIdxIndexMap[menuDailyRow.menu_idx];
      if(typeof(rowIndex) === 'undefined') return;
      colIndex = weekMap[moment(menuDailyRow.serve_date).format('YYYY-MM-DD')];
      if(typeof(colIndex) === 'undefined') return;

      area = menuDailyRow.area;
      if(typeof(area) === 'undefined') return;

      newInputMap[rowIndex][colIndex][area].checked = true;
      newInputMap[rowIndex][colIndex][area].value = menuDailyRow.stock;
    });

    dispatch(setInputMap([])); // do force refresh
    dispatch(setInputMap(newInputMap));
    return Promise.resolve();
  }
}

export function updateTransaction(inputMap, data, week, areaList) {
  return dispatch => {
    let transaction = [];

    inputMap.forEach((eachMenu, index) => {
      let menuIdx = data[index].idx;

      eachMenu.forEach((eachDay, day) => {
        let date = week[day];

        areaList.forEach((eachArea) => {
          let row = eachDay[eachArea];
          if(typeof(row) === 'undefined') {
            return Promise.reject();
          }

          if( row.changed === true && row.checked === true ) {
            transaction.push({
              menuIdx: menuIdx,
              serve_date: date,
              area: eachArea,
              stock: row.value,
            });
          }

          Promise.resolve();
        });
      });
    });

    dispatch(setTransaction(transaction));
    return Promise.resolve();
  }
}

export function addDailyMenu(menuIdx, area, serve_date, stock) {
  return (dispatch) => {
    return fetch(`/menuManager/menu/insert/${menuIdx}/${area}/${serve_date}/${stock}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 404) {
          return Promise.reject(new Error('MenuDaily 테이블에 insert 할 수 없습니다.'));
        }
        return response.json();
      });
  }
}