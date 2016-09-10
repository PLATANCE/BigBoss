import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MainController from './MainController';
import AddressSearch from './AddressSearch';

import {
  fetchOrderAddress,
  searchAddress,
  setQuery,
  onClickSearchResult,
  onChangeNewAddressDetail,
  requestSaveNewAddress,
  clear,
} from './actions';


function AddressBulldozer({
  mainControllerReducer,
  addressSearchReducer,
  dispatch,
}) {
  const {
    orderIdx,
    addressIdx,
    jibunAddress,
    roadNameAddress,
    addressDetail,
    newJibunAddress,
    newRoadNameAddress,
    newAddressDetail,
    newAddressLatitude,
    newAddressLongitude,
    newAddressAvailable,
  } = mainControllerReducer;
  const {
    query,
    searchResults,
  } = addressSearchReducer;
  return (
    <div className="container-fluid">
      <div className="col-xs-5">
        <MainController
          orderIdx={orderIdx}
          addressIdx={addressIdx}
          jibunAddress={jibunAddress}
          roadNameAddress={roadNameAddress}
          addressDetail={addressDetail}
          newJibunAddress={newJibunAddress}
          newRoadNameAddress={newRoadNameAddress}
          newAddressDetail={newAddressDetail}
          newAddressLatitude={newAddressLatitude}
          newAddressLongitude={newAddressLongitude}
          newAddressAvailable={newAddressAvailable}
          fetchOrderAddress={(fetchOrderIdx) => dispatch(fetchOrderAddress(fetchOrderIdx))}
          onChangeNewAddressDetail={
            (newNewAddressDetail) => dispatch(onChangeNewAddressDetail(newNewAddressDetail))
          }
          onNextOrderAddress={() => dispatch(fetchOrderAddress(orderIdx + 1))}
          requestSaveNewAddress={() => dispatch(requestSaveNewAddress())}
          clear={() => dispatch(clear())}
        />
      </div>
      <div className="col-xs-7">
        <AddressSearch
          query={query}
          searchResults={searchResults}
          setQuery={(newQuery) => dispatch(setQuery(newQuery))}
          searchAddress={() => dispatch(searchAddress())}
          onClickSearchResult={(searchResult) => dispatch(onClickSearchResult(searchResult))}
        />
      </div>
    </div>
  );
}

AddressBulldozer.propTypes = {
  dispatch: PropTypes.func.isRequired,
  mainControllerReducer: PropTypes.object.isRequired,
  addressSearchReducer: PropTypes.object.isRequired,
};

function select(state) {
  const {
    addressBulldozer,
  } = state;
  return addressBulldozer;
}

// Wrap the component to inject dispatch and state into it
export default connect(select)(AddressBulldozer);
