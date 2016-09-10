import { combineReducers } from 'redux';
import { Actions } from './actions';

const defaultAddressSearchReducerState = {
  searchResults: [],
  query: '',
};
function addressSearchReducer(state = Object.assign({}, defaultAddressSearchReducerState), action) {
  switch (action.type) {
    case Actions.SET_QUERY:
      {
        const { query } = action;
        return Object.assign({}, state, {
          query,
        });
      }
    case Actions.RECEIVE_SEARCH_ADDRESS:
      {
        const { searchResults } = action;
        return Object.assign({}, state, {
          searchResults,
        });
      }
    case Actions.CLEAR:
      {
        return Object.assign({}, defaultAddressSearchReducerState);
      }
    default:
      return state;
  }
}

const defaultMainControllerReducerState = {
  orderIdx: 0,
  addressIdx: 0,
  jibunAddress: '',
  roadNameAddress: '',
  addressDetail: '',
  newJibunAddress: '',
  newRoadNameAddress: '',
  newAddressDetail: '',
  newAddressLatitude: 0,
  newAddressLongitude: 0,
  newAddressAvailable: false,
};

function mainControllerReducer(state = Object.assign({}, defaultMainControllerReducerState)
, action) {
  switch (action.type) {
    case Actions.REQUEST_ORDER_ADDRESS:
      {
        const orderIdx = action.orderIdx;
        return Object.assign({}, state, {
          orderIdx,
        });
      }
    case Actions.RECEIVE_ORDER_ADDRESS:
      {
        const data = action.data;
        const addressIdx = data.idx;
        const {
          jibunAddress,
          roadNameAddress,
          addressDetail,
        } = data;

        return Object.assign({}, state, {
          addressIdx,
          jibunAddress,
          roadNameAddress,
          addressDetail,
        });
      }
    case Actions.ON_CLICK_SEARCH_RESULT:
      {
        const {
          jibunAddress,
          roadNameAddress,
          longitude,
          latitude,
          available,
        } = action.searchResult;
        return Object.assign({}, state, {
          newJibunAddress: jibunAddress,
          newRoadNameAddress: roadNameAddress,
          newAddressLatitude: latitude,
          newAddressLongitude: longitude,
          newAddressAvailable: available,
        });
      }
    case Actions.ON_CHANGE_NEW_ADDRESS_DETAIL:
      {
        const {
          newAddressDetail,
        } = action;
        return Object.assign({}, state, {
          newAddressDetail,
        });
      }
    case Actions.CLEAR:
      {
        return Object.assign({}, defaultMainControllerReducerState);
      }
    default:
      return state;
  }
}

const addressBulldozer = combineReducers({
  addressSearchReducer,
  mainControllerReducer,
});

export default addressBulldozer;
