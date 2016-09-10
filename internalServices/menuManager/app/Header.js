/**
 * Created by Gyu on 2016-07-11.
 */
import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DropDownMenu from 'material-ui/DropDownMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import {browserHistory} from 'react-router';
import {
  selectMenu,
} from './actions';
import ActionHome from 'material-ui/svg-icons/action/home';
const dropDownMenuStyle = {
  color: '#FFFFFF',
  width: 500,
};

class Header extends React.Component {

  constructor() {
    super();

  }

  handleChange = (event, index, value) => this.props.dispatch(selectMenu(value));

  render() {
    return (

      <div className="MenuManagerHeader">
        <IconButton
          tooltip="빅보스 메인으로 이동"
          color='red'
          iconStyle={{color: 'white'}}
          onClick={()=>browserHistory.push('/')}
          style={
          {position: 'absolute',
            width: 64, height: 64,
            left: '30px'}}>
          <ActionHome />
        </IconButton>

        <DropDownMenu
          value={this.props.selectedMenu}
          onChange={this.handleChange}
          labelStyle={dropDownMenuStyle}
          autoWidth={false}
        >
          <MenuItem value={'dailyMenuAdder'} primaryText="데일리 메뉴 추가" />
          <MenuItem value={'stockManager'} primaryText="재고 편집기" />
        </DropDownMenu>
      </div>

    );
  }
}

function select(state) {
  const {
    menuManager,
  } = state;
  return menuManager;
}


export default connect(select)(Header);
