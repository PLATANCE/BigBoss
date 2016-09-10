import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import MenuPicker from './component/menuPicker';

import { fetchMenuDaily } from './actions';

class B2BManager extends React.Component {

  constructor() {
    super();
  }

  componentWillMount() {
    this.props.dispatch(fetchMenuDaily ());
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <MenuPicker />
      </div>
    );
  }
}

B2BManager.propTypes = {
  menu: PropTypes.array,
};

function select(state) {
  const {
    B2BManager,
  } = state;
  return B2BManager;
}

export default connect(select)(B2BManager);
