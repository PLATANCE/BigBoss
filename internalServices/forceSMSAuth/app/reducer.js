import { Actions } from './actions';

const defaultState = {
  phoneNumber: '',
  authInfos: [],
  users: [],
  authUserIdx: 0,
  addressDetail: '',
  addressInfos: [],
};
function forceSMSAuth(state = Object.assign({}, defaultState), action) {
  switch (action.type) {
    case Actions.SET_PHONE_NUMBER: {
      const {
        phoneNumber,
      } = action;
      return Object.assign({}, state, {
        phoneNumber,
      });
    }
    case Actions.SET_AUTH_USER_IDX: {
      const {
        userIdx,
      } = action;
      return Object.assign({}, state, {
        authUserIdx: userIdx,
      });
    }
    case Actions.SET_ADDRESS_DETAIL: {
      const {
        addressDetail,
      } = action;
      return Object.assign({}, state, {
        addressDetail,
      });
    }
    case Actions.RECEIVE_ADDRESS_INFOS: {
      const {
        addressInfos,
      } = action;
      return Object.assign({}, state, {
        addressInfos,
      });
    }
    case Actions.RECEIVE_AUTH_INFO: {
      const {
        data,
      } = action;
      const {
        authInfos,
        users,
      } = data;
      return Object.assign({}, state, {
        authInfos,
        users,
      });
    }
    default:
      return state;
  }
}

export default forceSMSAuth;
