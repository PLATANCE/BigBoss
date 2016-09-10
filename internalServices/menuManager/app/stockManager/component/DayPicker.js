import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'material-ui/DatePicker';
import theme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import FontIcon from 'react-material-icons/icons/action/today';
import moment from 'moment';

import {
  fetchMenuDaily,
  sortBy,
} from '../actions';

const textStyles = {
  fontSize: 24,
};

class DayPicker extends React.Component {
  constructor(props) {
    super(props);

    const divProps = Object.assign({}, props);
    delete divProps.onTouchTap;

    DayPicker.childContextTypes = {
      muiTheme: React.PropTypes.object.isRequired,
    };

    this.getChildContext = function getChildContext() {
      return { muiTheme: getMuiTheme(theme) };
    };

    this.handleChange = (event, date) => {
      const formeddate = moment(date).format('YYYY-MM-DD');
      this.props.dispatch(fetchMenuDaily(formeddate))
      .then(() => this.props.dispatch(sortBy(this.props.tableData, this.props.attr.length - 2)));
    };
  }

  render() {
    return (
      <table>
        <tr>
          <td>
            <FontIcon />
          </td>
          <td>
            <DatePicker
              className="DayPicker"
              hintText={this.props.date}
              textFieldStyle={textStyles}
              onChange={this.handleChange}
              container="inline"
              mode="landscape"
              disabled={this.props.editMode}
              autoOk="true"
            />
          </td>
        </tr>
      </table>
    );
  }
}

DayPicker.propTypes = {
  dispatch: PropTypes.func.isRequired,
  date: PropTypes.string,
  editMode: PropTypes.boolean,
};

function select(state) {
  const {
    stockManager,
  } = state;
  return stockManager;
}

export default connect(select)(DayPicker);
