export const Actions = {
  RECEIVE_AUTH_INFO: 'RECEIVE_AUTH_INFO',
  SET_PHONE_NUMBER: 'SET_PHONE_NUMBER',
  SET_AUTH_USER_IDX: 'SET_AUTH_USER_IDX',
  SET_ADDRESS_DETAIL: 'SET_ADDRESS_DETAIL',
  RECEIVE_ADDRESS_INFOS: 'RECEIVE_ADDRESS_INFOS',
};


function receiveAuthInfo(data) {
  return {
    type: Actions.RECEIVE_AUTH_INFO,
    data,
  };
}

export function setPhoneNumber(phoneNumber) {
  return {
    type: Actions.SET_PHONE_NUMBER,
    phoneNumber,
  };
}

export function setAuthUserIdx(userIdx) {
  return {
    type: Actions.SET_AUTH_USER_IDX,
    userIdx,
  };
}

export function setAddressDetail(addressDetail) {
  return {
    type: Actions.SET_ADDRESS_DETAIL,
    addressDetail,
  };
}

function receiveAddressInfos(addressInfos) {
  return {
    type: Actions.RECEIVE_ADDRESS_INFOS,
    addressInfos,
  };
}

export function queryAddressWithAddressDetail() {
  return (dispatch, getState) => {
    const { forceSMSAuth } = getState();
    const { addressDetail } = forceSMSAuth;
    return fetch(`/forceSMSAuth/address/${encodeURIComponent(addressDetail)}`, {
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(json => dispatch(receiveAddressInfos(json)))
    .catch(err => alert(JSON.stringify(err)));
  };
}

export function fetchAuthInfo() {
  return (dispatch, getState) => {
    const { forceSMSAuth } = getState();
    const { phoneNumber } = forceSMSAuth;
    return fetch(`/forceSMSAuth/authInfo/${phoneNumber}`, {
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(json => dispatch(receiveAuthInfo(json)))
    .catch(err => alert(JSON.stringify(err)));
  };
}

export function requestPhoneNumberAuth() {
  return (dispatch, getState) => {
    const { forceSMSAuth } = getState();
    const { phoneNumber, authUserIdx } = forceSMSAuth;
    return fetch(`/forceSMSAuth/user/${authUserIdx}/auth/${phoneNumber}`, {
      method: 'POST',
      credentials: 'same-origin',
    })
    .then(response => response.json())
    .then(json => alert(JSON.stringify(json)))
    .catch(err => alert(JSON.stringify(err)));
  };
}
