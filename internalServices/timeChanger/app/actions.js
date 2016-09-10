export const Actions = {
  RECEIVE_ORDER_TIME_SLOT: 'RECEIVE_ORDER_TIME_SLOT',
  REQUEST_ORDER_TIME_SLOT: 'REQUEST_ORDER_TIME_SLOT',
  RECEIVE_TIME_SLOT: 'RECEIVE_TIME_SLOT',
  SELECT_TIME_SLOT: 'SELECT_TIME_SLOT',
};

function requestOrderTimeSlot(orderIdx) {
  return {
    type: Actions.REQUEST_ORDER_TIME_SLOT,
    orderIdx,
  };
}

function receiveOrderTimeSlot(data) {
  return {
    type: Actions.RECEIVE_ORDER_TIME_SLOT,
    data,
  };
}

function receiveTimeSlot(data) {
  return {
    type: Actions.RECEIVE_TIME_SLOT,
    data,
  };
}

export function selectTimeSlot(timeSlot) {
  return {
    type: Actions.SELECT_TIME_SLOT,
    timeSlot,
  };
}

export function fetchTimeSlot() {
  return (dispatch) => (
    fetch('/timeChanger/timeSlot', {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject('타임 슬롯들을 가져올 수 없습니다.');
      }
      return response.json();
    })
    .then(json => {
      dispatch(receiveTimeSlot(json));
    })
    .catch(err => alert(JSON.stringify(err)))
  );
}

export function searchOrderTimeSlot(orderIdx) {
  return (dispatch) => {
    dispatch(requestOrderTimeSlot(orderIdx));
    return fetch(`/timeChanger/order/${orderIdx}/timeSlot`, {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject(new Error(`orderIdx가 ${orderIdx}인 주문 혹은 그 주문의 시간대가 없습니다.`));
      }
      return response.json();
    })
    .then(json => dispatch(receiveOrderTimeSlot(json)))
    .catch(err => alert(JSON.stringify(err)));
  };
}

export function saveTimeSlot() {
  return (dispatch, getState) => {
    const { timeChanger } = getState();
    const {
      orderIdx,
      selectedTimeSlot,
    } = timeChanger;

    return fetch(`/timeChanger/order/${orderIdx}/timeSlot`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timeSlotIdx: selectedTimeSlot.idx,
      }),
    })
    .then(response => response.json())
    .then(json => alert(JSON.stringify(json)))
    .catch(err => alert(JSON.stringify(err)));
  };
}
