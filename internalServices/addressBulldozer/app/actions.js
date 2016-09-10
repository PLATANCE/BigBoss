export const Actions = {
  REQUEST_ORDER_ADDRESS: 'REQUEST_ORDER_ADDRESS',
  RECEIVE_ORDER_ADDRESS: 'RECEIVE_ORDER_ADDRESS',
  SET_QUERY: 'SET_QUERY',
  REQUEST_SEARCH_ADDRESS: 'REQUEST_SEARCH_ADDRESS',
  RECEIVE_SEARCH_ADDRESS: 'RECEIVE_SEARCH_ADDRESS',
  ON_CLICK_SEARCH_RESULT: 'ON_CLICK_SEARCH_RESULT',
  ON_CHANGE_NEW_ADDRESS_DETAIL: 'ON_CHANGE_NEW_ADDRESS_DETAIL',
  REQUEST_SAVE_NEW_ADDRESS: 'REQUEST_SAVE_NEW_ADDRESS',
  CLEAR: 'CLEAR',
};

export function clear() {
  return {
    type: Actions.CLEAR,
  };
}

function receiveOrderAddress(data) {
  return {
    type: Actions.RECEIVE_ORDER_ADDRESS,
    data,
  };
}

function requestOrderAddress(orderIdx) {
  return {
    type: Actions.REQUEST_ORDER_ADDRESS,
    orderIdx,
  };
}

export function setQuery(query) {
  return {
    type: Actions.SET_QUERY,
    query,
  };
}

function receiveSearchAddress(searchResults) {
  return {
    type: Actions.RECEIVE_SEARCH_ADDRESS,
    searchResults,
  };
}

function requestSearchAddress() {
  return {
    type: Actions.REQUEST_SEARCH_ADDRESS,
  };
}

export function onClickSearchResult(searchResult) {
  return {
    type: Actions.ON_CLICK_SEARCH_RESULT,
    searchResult,
  };
}

export function onChangeNewAddressDetail(newAddressDetail) {
  return {
    type: Actions.ON_CHANGE_NEW_ADDRESS_DETAIL,
    newAddressDetail,
  };
}

export function searchAddress() {
  return (dispatch, getState) => {
    const { addressBulldozer } = getState();
    const { addressSearchReducer } = addressBulldozer;
    const { query } = addressSearchReducer;

    dispatch(requestSearchAddress());
    return fetch(`https://address.plating.co.kr/?query=${encodeURI(query)}`)
    .then(response => response.json())
    .then(json => dispatch(receiveSearchAddress(json)))
    .catch(err => alert(JSON.stringify(err)));
  };
}

export function fetchOrderAddress(orderIdx) {
  return (dispatch) => {
    dispatch(clear());
    dispatch(requestOrderAddress(orderIdx));
    return fetch(`/addressBulldozer/order/${orderIdx}/address`, {
      method: 'GET',
      credentials: 'same-origin',
    })
    .then(response => {
      if (response.status === 404) {
        return Promise.reject(new Error(`orderIdx가 ${orderIdx}인 주문 혹은 그 주문의 주소가 없습니다.`));
      }
      return response.json();
    })
    .then(json => {
      dispatch(setQuery(`${json.jibunAddress} ${json.addressDetail}`));
      dispatch(receiveOrderAddress(json));
      dispatch(searchAddress());
    })
    .catch(err => alert(JSON.stringify(err)));
  };
}

export function requestSaveNewAddress() {
  return (dispatch, getState) => {
    const { addressBulldozer } = getState();
    const { mainControllerReducer } = addressBulldozer;
    const {
      addressIdx,
      newJibunAddress,
      newRoadNameAddress,
      newAddressDetail,
      newAddressLatitude,
      newAddressLongitude,
      newAddressAvailable,
    } = mainControllerReducer;

    return fetch(`/addressBulldozer/address/${addressIdx}`, {
      method: 'PUT',
      credentials: 'same-origin',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jibunAddress: newJibunAddress,
        roadNameAddress: newRoadNameAddress,
        addressDetail: newAddressDetail,
        latitude: newAddressLatitude,
        longitude: newAddressLongitude,
        available: newAddressAvailable,
      }),
    })
    .then(response => response.json())
    .then(json => alert(JSON.stringify(json)))
    .catch(err => alert(JSON.stringify(err)));
  };
}
