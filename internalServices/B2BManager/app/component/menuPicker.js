import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { fetchMenuDaily, setFeatured, cancleFeatured } from '../actions';

class MenuPicker extends React.Component {

  constructor() {
    super();

    this.handleSetFeatured = (idx) => {
      this.props.dispatch(setFeatured(idx))
        .then(()=>this.props.dispatch(fetchMenuDaily ()));
    };

    this.handleCancleFeatured = (idx) => {
      this.props.dispatch(cancleFeatured(idx))
        .then(()=>this.props.dispatch(fetchMenuDaily ()));
    };
  }

  componentWillMount() {

  }

  createSelectList() {
    const { menu } = this.props;
    const tag = [];
    menu.forEach((row) => {
      if(row.menu_idx < 10000 && row.area === 'seoul-1') {
        tag.push(
          <tr key={row.menu_idx}>
            <td style={{ width: '20%' }}> {row.menu_idx} </td>
            <td style={{ width: '40%' }}> {row.foodfly_name} </td>
            <td style={{ width: '20%' }}> {row.stock - row.ordered} </td>
            <td style={{ width: '20%' }}>
              <input type="button" value="선정" onClick={() => this.handleSetFeatured(row.idx)}/>
            </td>
          </tr>
        );
      }
    });
    return tag;
  }

  createFeaturedList() {
    const { menu } = this.props;
    const tag = [];
    menu.forEach((row) => {
      if(row.is_b2b_featured === 1) {
        tag.push(
          <tr key={`feature${row.idx}`} style={{ textAlign: 'left' }}>
            <td style={{ width: '20%', textAlign: 'center' }}> {row.menu_idx} </td>
            <td style={{ width: '60%', textAlign: 'center' }}> {row.foodfly_name} </td>
            <td style={{ width: '20%', textAlign: 'center' }}>
              <input type="button" value="취소" onClick={() => this.handleCancleFeatured(row.idx)}/>
            </td>
          </tr>
        );
      }
    });
    return tag;
  }

  render() {
    return (
      <div style={{ width: 600, display: 'inline-block' }}>

        <hr style={{ borderColor: 'grey', borderWidth: 1 }}/>
        <b>B2B 메뉴선정</b>
        <hr  style={{ borderColor: 'black', borderWidth: 3 }} />

        <div style={{ width: 'inherit' }}>
          <table style = {{ width: 'inherit', textAlign: 'center' }}>
            <thead>
              <tr>
                <th style={{ width: '20%', textAlign: 'center' }}>menuIdx</th>
                <th style={{ width: '40%', textAlign: 'center' }}>메뉴이름</th>
                <th style={{ width: '20%', textAlign: 'center' }}>재고(강남)</th>
                <th style={{ width: '20%', textAlign: 'center' }}>할인메뉴</th>
              </tr>
            </thead>
          </table>
          <div style = {{ width: 'inherit', maxHeight: 200,
            overflowY: 'scroll', overflowX: 'hidden' }}>
            <table style = {{ width: 'inherit', textAlign: 'center' }}>
              <tbody>
                {this.createSelectList()}
              </tbody>
            </table>
          </div>
        </div>

        <hr style={{ borderColor: 'black'}}/>
        <b> 선정 된 메뉴 </b>
        <div style = {{ width: 'inherit' }}>
          <table style = {{ width: 'inherit', textAlign: 'center' }}>
            <thead>
            <tr>
              <th style={{ width: '20%', textAlign: 'center' }}>menuIdx</th>
              <th style={{ width: '60%', textAlign: 'center' }}>메뉴이름</th>
              <th style={{ width: '20%', textAlign: 'center' }}>선정취소</th>
            </tr>
            </thead>
          </table>

          <div style = {{ width: 'inherit', maxHeight: 100,
            overflowY: 'scroll', overflowX: 'hidden' }}>

            <table style={{ width: 'inherit', textAlign: 'center' }}>
              <tbody>
              {this.createFeaturedList()}
              </tbody>
            </table>

          </div>
        </div>
        <hr style={{ borderColor: 'black'}}/>
      </div>
    );
  }
}

MenuPicker.propTypes = {
  menu: PropTypes.array,
};

function select(state) {
  const {
    B2BManager,
  } = state;
  return B2BManager;
}

export default connect(select)(MenuPicker);
