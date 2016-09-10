// actions
export const Actions = {
  RECEIVE_ORDER_LIST: 'RECEIVE_ORDER_LIST'
};


// private action creator
function receiveOrderList(orderList) {
  let action = {
    type: Actions.RECEIVE_ORDER_LIST,
    orderList
  }
  return action
}

// actions
export function getOrderList() {
  return (dispatch) => {
    return fetch('/orderTable/list', {
      method: 'GET',
      credentials: 'same-origin',
    }).then(response => {
      if (response.status === 404) {
        return Promise.reject('주문 내역을 가져올 수 없습니다.');
      }
      return response.json();
    })
      .then(json => {
        dispatch(receiveOrderList(json));
      })
      .catch(err => alert(JSON.stringify(err)))
  };
}
