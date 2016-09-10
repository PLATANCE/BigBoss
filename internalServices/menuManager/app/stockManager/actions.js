export const Actions = {
  INITIALIZE: 'INITIALIZE',
  RESET_STOCK_TRANSACTION: 'RESET_STOCK_TRANSACTION',
  RECEIVE_MENU_DAILY: 'RECEIVE_MENU_DAILY',
  RECEIVE_STOCK_PARSED: 'RECEIVE_STOCK_PARSED',
  RESET_DAILY_TABLE_CELL: 'RESET_DAILY_TABLE_CELL',
  CHANGE_EDIT_MODE: 'CHANGE_EDIT_MODE',
  SET_OPEN_APPLY_ADD_DIALOG: 'SET_OPEN_APPLY_ADD_DIALOG',
  SET_STOCK_TRANSACTION: 'SET_STOCK_TRANSACTION',
  SET_TABLE_DATA: 'SET_TABLE_DATA',
  SET_PRIORITY_TRANSACTION: 'SET_PRIORITY_TRANSACTION',
  CHANGE_NEED_SYNC: 'CHANGE_NEED_SYNC',
};

function receiveMenuDaily(date, data) {
  return {
    type: Actions.RECEIVE_MENU_DAILY,
    date,
    data,
  };
}

function receiveStockParsed(parsedStock, areaArr, attr, tableData) {
  return {
    type: Actions.RECEIVE_STOCK_PARSED,
    parsedStock,
    areaArr,
    attr,
    tableData,
  };
}

export function initialize() {
  return {
    type: Actions.INITIALIZE,
  };
}

export function resetStockTransaction() {
  return {
    type: Actions.RESET_STOCK_TRANSACTION,
    stockTransaction: {},
    priorityTransaction: {},
  };
}

export function changeEditMode(editMode) {
  return {
    type: Actions.CHANGE_EDIT_MODE,
    editMode,
  };
}

export function changeNeedSync(needSync) {
  return {
    type: Actions.CHANGE_NEED_SYNC,
    needSync,
  };
}

export function setOpenApplyDialog(openApplyDialog) {
  return {
    type: Actions.SET_OPEN_APPLY_ADD_DIALOG,
    openApplyDialog,
  };
}

export function setStockTransaction(stockTransaction) {
  return {
    type: Actions.SET_STOCK_TRANSACTION,
    stockTransaction,
  };
}

export function setTableData(tableData) {
  return {
    type: Actions.SET_TABLE_DATA,
    tableData,
  };
}

export function setPriorityTransaction(priorityTransaction) {
  return {
    type: Actions.SET_PRIORITY_TRANSACTION,
    priorityTransaction,
  };
}

export function checkNeedSync(date, data) {
  return (dispatch) =>
    fetch(`/menuManager/menu/${date}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 404) {
          return Promise.reject(new Error('Menu Daily 테이블을 가져올 수 없습니다.'));
        }
        return response.json();
      })
      .then(newData => {
        let needUpdate = false;
        newData.message.forEach((value, index) => {
          let l = JSON.stringify(data[index]);
          let r = JSON.stringify(newData.message[index]);
          if( l !== r ) {
            needUpdate = true;
          }
        });

        if(needUpdate) {
          dispatch(changeNeedSync(true));
        }

        return Promise.resolve();
      });
}

export function fetchStockParsed(data) {
  const stockObj = {};
  const areaObj = {};
  const areaArr = ['메뉴', '전체'];
  return (dispatch) => {
    let inArea;
    data.map((row) => {
      if (typeof(stockObj[row.menu_idx]) === 'undefined') {
        stockObj[row.menu_idx] = {
          idx: row.menu_idx,
          name: row.foodfly_name,
          priority: row.priority, // 같은 menu_idx를 갖는 메뉴는 같은 priority 를 갖는 것으로 가정
          each_area: {},
        };
      }

      if (typeof(areaObj[row.area]) === 'undefined') {
        areaObj[row.area] = {};
        areaArr.push(row.area);
      }

      inArea = {
        name: row.area,
        produced: row.stock,
        ordered: row.ordered,
        spare: row.stock - row.ordered,
      };

      stockObj[row.menu_idx].each_area[row.area] = inArea;

      return Promise.resolve();
    });
    areaArr.push('순위');

    const attr = [];
    attr.push('='); // sortable handle
    attr.push('Idx');
    attr.push('메뉴');
    Object.keys(areaArr).forEach((arName) => {
      const iter = areaArr[arName];
      if (iter === '메뉴' || iter==='순위' || iter === '=') return;
      attr.push('생산');
      attr.push('판매');
      attr.push('남음');
    });
    attr.push('순서');

    let tableData = [];
    let eachMenu;
    let tableDataRow;
    let eachMenuIdx;
    let totalProduced;
    let totalOrdered;
    let totalSpare;

    Object.keys(stockObj).forEach((key) => {
      eachMenu = stockObj[key];
      tableDataRow = [];
      eachMenuIdx = eachMenu.idx;
      totalProduced = 0;
      totalOrdered = 0;
      totalSpare = 0;

      tableDataRow.push({ menuIdx: eachMenuIdx, value: eachMenu.idx });
      tableDataRow.push({ menuIdx: eachMenuIdx, value: eachMenu.name });

      Object.keys(areaArr).forEach((areaKey) => {
        const area = areaArr[areaKey];
        if (area === '메뉴' || area === '순위') return;
        if (typeof(eachMenu.each_area[area]) !== 'undefined') {
          const temp = eachMenu.each_area[area];
          tableDataRow.push(
              { menuIdx: eachMenuIdx, area, type: 'produced', value: temp.produced },
              { menuIdx: eachMenuIdx, area, type: 'ordered', value: temp.ordered },
              { menuIdx: eachMenuIdx, area, type: 'spare', value: temp.produced - temp.ordered });
          totalProduced += temp.produced;
          totalOrdered += temp.ordered;
          totalSpare += temp.produced - temp.ordered;
        }
        else {
          tableDataRow.push(
              { menuIdx: eachMenuIdx, area, type: 'produced', value: '-' },
              { menuIdx: eachMenuIdx, area, type: 'ordered', value: '-' },
              { menuIdx: eachMenuIdx, area, type: 'spare', value: '-' });
        } });

      tableDataRow.push(
        { menuIdx: eachMenuIdx, area: 'total', type: 'priority', value: eachMenu.priority });

      tableDataRow[2] = {
        menuIdx: eachMenuIdx, area: 'total', type: 'produced', value: totalProduced,
      };
      tableDataRow[3] = {
        menuIdx: eachMenuIdx, area: 'total', type: 'ordered', value: totalOrdered,
      };
      tableDataRow[4] = {
        menuIdx: eachMenuIdx, area: 'total', type: 'spare', value: totalSpare,
      };
      tableData.push(tableDataRow);
    });

    return dispatch(receiveStockParsed(stockObj, areaArr, attr, tableData));
  };
}

export function fetchMenuDaily(date) {
  return (dispatch) =>
    fetch(`/menuManager/menu/${date}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.status === 404) {
          return Promise.reject(new Error('Menu Daily 테이블을 가져올 수 없습니다.'));
        }
        return response.json();
      })
      .then(data => {
        dispatch(receiveMenuDaily(date, data.message));
        dispatch(changeNeedSync(false));
        return data.message;
      })
      .then((stockArr) => dispatch(fetchStockParsed(stockArr)));
}

export function updateMenuDaily(trans, date) {
  return (dispatch) => {
    let willPlus;
    let areaDBName;
    let typeDBName;
    Object.keys(trans).forEach((menuIdx) => {
      Object.keys(trans[menuIdx]).forEach((area) => {
        Object.keys(trans[menuIdx][area]).forEach((type) => {
          willPlus = trans[menuIdx][area][type].willPlus;
          areaDBName = area;

          if (type === 'produced') typeDBName = 'stock';
          else if (type === 'ordered') typeDBName = 'ordered';
          else Error(`Unkown Column : ${type}`);

          return fetch('/menuManager/update/'
            + `${menuIdx}/${areaDBName}/${typeDBName}/${willPlus}/${date}`, {
            method: 'GET',
            credentials: 'same-origin',
          });
        });
      });
    });

    return Promise.resolve();
  };
}

export function updateMenuDailyPriority(priorityTransaction, date) {
  return (dispatch) => {
    Object.keys(priorityTransaction).forEach((menuIdx) => {
      let newPriority = priorityTransaction[menuIdx];
      return fetch('/menuManager/update/priority/'
        + `${menuIdx}/${newPriority}/${date}`, {
        method: 'GET',
        credentials: 'same-origin',
      });
    });

    return Promise.resolve();
  }
}

export function changeStockBuffer(stockTransaction, plusValue, whatToChange) {
  return (dispatch) => {
    const newStockTransaction = stockTransaction;

    if (typeof(newStockTransaction[whatToChange.menuIdx]) === 'undefined') {
      newStockTransaction[whatToChange.menuIdx] = {};
    }
    if (typeof(newStockTransaction[whatToChange.menuIdx][whatToChange.area]) === 'undefined') {
      newStockTransaction[whatToChange.menuIdx][whatToChange.area] = {};
    }
    newStockTransaction[whatToChange.menuIdx][whatToChange.area][whatToChange.type] = {
      beforeUpdate: whatToChange.value, willPlus: (plusValue),
    };

    return dispatch(setStockTransaction(newStockTransaction));
  };
}

export function sortBy(tableData, pivot) { // pivot : 정렬 기준이 있는 cell의 index
  return (dispatch) => {
    let newTableData = tableData;
    newTableData.sort(function(prev,post){
      const l = prev[pivot];
      const r = post[pivot];
      return(l.value < r.value) ? -1 : (l.value > r.value) ? 1 : 0;
    });

    dispatch(setTableData([])); // 이 것을 꼭 넣어야 하는가.. (refresh 가 안됨)
    return dispatch(setTableData(newTableData));
  };
}

export function changePriorityBuffer(priorityTransaction, cellData, newPriority) {
  return (dispatch) => {
    let newPriorityTransaction = priorityTransaction;
    newPriorityTransaction[cellData.menuIdx] = newPriority;
    return dispatch(setPriorityTransaction(newPriorityTransaction));
  }
}

export function setPriority(priorityTransaction, tableData, priorityColumnIndex) {
  return (dispatch) => {
    let newTableData = tableData;
    newTableData.forEach((value, index) => {
      if(newTableData[index][priorityColumnIndex].value !== index) {
        dispatch(changePriorityBuffer(
          priorityTransaction,
          newTableData[index][priorityColumnIndex],
          index));
      }
      newTableData[index][priorityColumnIndex].value = index;
    });

    dispatch(setTableData([])); // (refresh 가 안됨)
    return dispatch(setTableData(newTableData));
  }
}

export function dropRow(tableData, pickRowIdx, dropRowIdx) {
  return (dispatch) => {
    let pickRow = tableData[pickRowIdx];
    let newTableData = tableData;
    if(pickRowIdx < dropRowIdx) {
      for(let i = pickRowIdx + 1; i <= dropRowIdx; i++) {
        newTableData[i-1] = tableData[i];
      }
      newTableData[dropRowIdx] = pickRow;
    }
    else if (pickRowIdx > dropRowIdx) {
      for(let i = pickRowIdx - 1; i > dropRowIdx; i--) {
        newTableData[i+1] = tableData[i];
      }
      newTableData[dropRowIdx + 1] = pickRow;
    }

    dispatch(setTableData([])); // (refresh 가 안됨)
    return dispatch(setTableData(newTableData));
  }
}