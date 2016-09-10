import React, { PropTypes } from 'react';
/* global daum */

export default function AddressSearch({
  query,
  searchResults,
  setQuery,
  searchAddress,
  onClickSearchResult,
}) {
  const searchResultRows = [];
  searchResults.forEach(searchResult => {
    const {
      jibunAddress,
      roadNameAddress,
      available,
    } = searchResult;
    const unavailable = <div className="col-xs-12">배송불가능지역</div>;
    const row = (
      <button
        className="row col-xs-12"
        onClick={() => onClickSearchResult(searchResult)}
        style={{
          'text-align': 'left',
        }}
      >
        <div className="col-xs-12">지번 : {jibunAddress}</div>
        <div className="col-xs-12">도로 : {roadNameAddress}</div>
        {available ? false : unavailable}
      </button>
    );
    searchResultRows.push(row);
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <input
          className="col-xs-7"
          type="text"
          onChange={(event) => setQuery(event.target.value)}
          value={query}
        />
        <div className="col-xs-1"></div>
        <button className="col-xs-4" onClick={searchAddress}>검색</button>
      </div>
      <div className="col-xs-12">
        <div className="container-fluid">
          <div className="row">검색 결과 : {searchResults.length}건</div>
          {searchResultRows}
        </div>
      </div>
    </div>
  );
}

AddressSearch.propTypes = {
  query: PropTypes.string,
  searchResults: PropTypes.arrayOf(PropTypes.shape({
    jibunAddress: PropTypes.string,
    roadNameAddress: PropTypes.string,
    available: PropTypes.bool,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
  })),
  setQuery: PropTypes.func.isRequired,
  searchAddress: PropTypes.func.isRequired,
  onClickSearchResult: PropTypes.func.isRequired,
};
