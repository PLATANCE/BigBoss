import React from 'react';
import { connect } from 'react-redux';
import StockManager from './stockManager/index';
import DailyMenuAdder from './dailyMenuAdder/index'
import Header from './Header';

import {
  initialize,
} from './actions'

const disableStyle = {
  display: 'none',
}

class MenuManager extends React.Component {

  componentDidMount() {
    this.props.dispatch(initialize());
  }

  render() {

    return (
      <div>
        <Header />
        <StockManager
          style={ this.props.selectedMenu === 'stockManager' ? {} : disableStyle }
        />
        <DailyMenuAdder
          style={ this.props.selectedMenu === 'dailyMenuAdder' ? {} : disableStyle }
        />
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

export default connect(select)(MenuManager);
