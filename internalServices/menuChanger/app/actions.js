export const Actions = {
  RECEIVE_MENU: 'RECEIVE_MENU',
  REQUEST_ORDER_MENU: 'REQUEST_ORDER_MENU',
  RECEIVE_ORDER_MENU: 'RECEIVE_ORDER_MENU',
  REQUEST_MENU_STOCK: 'REQUEST_MENU_STOCK',
  RECEIVE_MENU_STOCK: 'RECEIVE_MENU_STOCK',
  CHANGE_AMOUNT: 'CHANGE_AMOUNT',
  CLEAR_DISH: 'CLEAR_DISH',
  ADD_DISH_TO_LIST: 'ADD_DISH_TO_LIST',
  UPDATE_TOTAL_PRICE: 'UPDATE_TOTAL_PRICE',
  REQUEST_USER_INFO: 'REQUEST_USER_INFO',
  RECEIVE_USER_INFO: 'RECEIVE_USER_INFO',
  REQUEST_SUBMIT_ORDER: 'REQUEST_SUBMIT_ORDER',
  RECEIVE_SUBMIT_ORDER: 'RECEIVE_SUBMIT_ORDER',
  REQUEST_CANCEL_ORDER: 'REQUEST_CANCEL_ORDER',
  REQUEST_GIVE_POINT: 'REQUEST_GIVE_POINT',
  RECEIVE_GIVE_POINT: 'RECEIVE_GIVE_POINT',
  REQUEST_USER_INFO_BY_MOBILE: 'REQUEST_USER_INFO_BY_MOBILE',
  RESET_ORDER_DATA: 'RESET_ORDER_DATA',
  APPLY_POINT: 'APPLY_POINT',
};


function requestGivePoint(userIdx, point, reason) {
  return {
    type: Actions.REQUEST_GIVE_POINT,
    userIdx,
    point,
    reason,
  };
}

function requestUserInfoByMobile(mobile) {
  return {
    type: Actions.REQUEST_USER_INFO_BY_MOBILE,
    mobile,
  };
}

function receiveGivePoint() {
  return {
    type: Actions.RECEIVE_GIVE_POINT,
  };
}


function requestSubmitOrder() {
  return {
    type: Actions.REQUEST_SUBMIT_ORDER,
  };
}

function receiveSubmitOrder(data) {
  return {
    type: Actions.RECEIVE_SUBMIT_ORDER,
    data,
  };
}


function receiveMenu(data) {
  return {
    type: Actions.RECEIVE_MENU,
    data,
  };
}

function requestOrderMenu(orderIdx) {
  return {
    type: Actions.REQUEST_ORDER_MENU,
    orderIdx,
  };
}

function receiveOrderMenu(data) {
  return {
    type: Actions.RECEIVE_ORDER_MENU,
    data,
  };
}

function requestMenuStock(date) {
  return {
    type: Actions.REQUEST_MENU_STOCK,
    date,
  };
}

function receiveMenuStock(data) {
  return {
    type: Actions.RECEIVE_MENU_STOCK,
    data,
  };
}

function requestUserInfo(useridx) {
  return {
    type: Actions.REQUEST_USER_INFO,
    useridx,
  };
}

function receiveUserInfo(data) {
  return {
    type: Actions.RECEIVE_USER_INFO,
    data,
  };
}

export function applyPoint(point) {
  return {
    type: Actions.APPLY_POINT,
    point,
  };
}

export function resetOrderData() {
  return {
    type: Actions.RESET_ORDER_DATA,
  };
}

export function changeAmount(amount, idx) {
  return {
    type: Actions.CHANGE_AMOUNT,
    amount, idx,
  };
}

export function addDishToList(orderData) {
  return {
    type: Actions.ADD_DISH_TO_LIST,
    orderData,
  };
}

export function clearDish(menuIdx) {
  return {
    type: Actions.CLEAR_DISH,
    menuIdx,
  };
}

export function updateTotalPrice() {
  return {
    type: Actions.UPDATE_TOTAL_PRICE,
  };
}

function requestCancelOrder(orderIdx) {
  return {
    type: Actions.REQUEST_CANCEL_ORDER,
    orderIdx,
  };
}

export function cancelOrder(orderIdx) {
  return (dispatch) => {
    dispatch(requestCancelOrder(orderIdx));
    return fetch(`/menuChanger/order/${orderIdx}`, {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.json())
    .then(json => alert(JSON.stringify(json)))
    .catch(err => alert(JSON.stringify(err.message)));
  };
}

export function fetchMenu() {
  return (dispatch) => (
    fetch('/menuChanger/menu', {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject('메뉴 들을 가져올 수 없습니다.');
      }
      return response.json();
    })
    .then(json => {
      dispatch(receiveMenu(json));
    })
    .catch(err => alert(JSON.stringify(err.message)))
  );
}

export function fetchMenuStock(date, area) {
  return (dispatch) => {
    dispatch(requestMenuStock(date));
    return fetch(`/menuChanger/menuStock/${date}/area/${area}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject('메뉴 들을 가져올 수 없습니다.');
      }
      return response.json();
    })
    .then(json => {
      dispatch(receiveMenuStock(json));
    })
    .catch(err => alert(JSON.stringify(err.message)));
  };
}

export function searchOrderMenu(orderIdx) {
  return (dispatch) => {
    dispatch(requestOrderMenu(orderIdx));
    return fetch(`/menuChanger/order/${orderIdx}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject(new Error(`orderIdx가 ${orderIdx}인 주문 혹은 주문한 제품이 없습니다.`));
      }
      return response.json();
    })
    .then(json => dispatch(receiveOrderMenu(json)))
    .catch(err => alert(JSON.stringify(err.message)));
  };
}

export function saveOrderMenu() {
  return (dispatch, getState) => {
    const { menuChanger } = getState();
    const {
      orderIdx,
      orderItemList,
    } = menuChanger;

    return fetch(`/menuChanger/order/${orderIdx}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // TODO: 수정수정수정
        orderItemList: orderItemList.idx,
      }),
    })
    .then(response => response.json())
    .then(json => alert(JSON.stringify(json)))
    .catch(err => alert(JSON.stringify(err.message)));
  };
}

export function submitOrderMenu() {
  return (dispatch, getState) => {
    const { menuChanger } = getState();
    const {
      orderIdx,
      orderedMenu,
      selectedMenu,
      totalPrice,
      date,
      area,
      pointUsed,
      pointDelta,
      user,
    } = menuChanger;
    const userIdx = user.idx;
    dispatch(requestSubmitOrder());
    const shouldUpdateMenu = _.differenceWith(selectedMenu, orderedMenu, _.isEqual);
    const shouldDeleteMenu = _.differenceWith(orderedMenu, selectedMenu, _.isEqual)
    .filter(dish => {
      let result = true;
      shouldUpdateMenu.forEach(updateDish => {
        if (dish.menuIdx === updateDish.menuIdx) {
          result = false;
        }
      });
      return result;
    });
    const shouldInsertMenu = _.remove(shouldUpdateMenu, { orderDetailIdx: null });
    shouldUpdateMenu.forEach((dish, index) => {
      const temp = dish;
      orderedMenu.forEach((orderedDish) => {
        if (orderedDish.menuIdx === dish.menuIdx) {
          temp.delta = temp.amount - orderedDish.amount;
          shouldUpdateMenu[index] = temp;
        }
      });
    });

    return fetch(`/menuChanger/order/${orderIdx}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // TODO: 수정수정수정
        shouldUpdateMenu,
        shouldDeleteMenu,
        shouldInsertMenu,
        totalPrice,
        pointUsed,
        pointDelta,
        date,
        area,
        userIdx,
      }),
    })
    .then(response => response.json())
    .then(json => dispatch(receiveSubmitOrder(json)))
    .catch(err => alert(JSON.stringify(err.message)));
  };
}

export function searchUserInfo(userIdx) {
  return (dispatch) => {
    dispatch(requestUserInfo(userIdx));
    return fetch(`/menuChanger/user/${userIdx}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject(new Error(`userIdx ${userIdx}인 고객이 없습니다.`));
      }
      return response.json();
    })
    .then(json => dispatch(receiveUserInfo(json)))
    .catch(err => alert(JSON.stringify(err.message)));
  };
}

export function searchUserInfoByMobile(mobile) {
  return (dispatch) => {
    dispatch(requestUserInfoByMobile(mobile));
    return fetch(`/menuChanger/user/mobile/${mobile}`, {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject(new Error(`mobile이 ${mobile}인 고객이 없습니다.`));
      }
      return response.json();
    })
    .then(json => dispatch(receiveUserInfo(json)))
    .catch(err => alert(JSON.stringify(err.message)));
  };
}


export function givePointToUser(query) {
  const {
    userIdx,
    point,
    reason,
  } = query;
  return (dispatch) => {
    dispatch(requestGivePoint(userIdx, point, reason));
    return fetch(`/menuChanger/user/${userIdx}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        point,
        reason,
      }),
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject(new Error(`userIdx ${userIdx}인 고객이 없습니다.`));
      }
      return response.json();
    })
    .then(json => dispatch(receiveGivePoint(json)))
    .catch(err => alert(JSON.stringify(err.message)));
  };
}
