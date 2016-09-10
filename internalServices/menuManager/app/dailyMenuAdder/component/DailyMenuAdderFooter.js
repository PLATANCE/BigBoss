import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import Chip from 'material-ui/Chip';
import { setAreaList } from '../actions'
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';

class DailyMenuAdderFooter extends Component {

  constructor() {
    super();
    this.state = {
      areaText: '',
    };

    this.handleClick = () => {
      let newList = this.props.areaList;
      newList.push(this.state.areaText);
      this.props.dispatch(setAreaList([])); // do force refresh
      this.props.dispatch(setAreaList(newList));
      this.setState({areaText: ''});
    };

    this.handleChange = (event) => {
      this.setState({areaText: event.target.value});
    };

    this.handleRequestDelete = (label) => {
      let newList = [];
      this.props.areaList.forEach((area) => {
        if(area !== label) {
          newList.push(area);
        }});

      this.props.dispatch(setAreaList(newList));
    };
  }

  renderChip(label) {
    return (
      <Chip
        style={{margin: 4}}
        onRequestDelete={() => this.handleRequestDelete(label)}
      >
        {label}
      </Chip>
    );
  }

  render() {
    return (
      <div style = {{textAlign: 'center'}}>
        <TextField
          style={{margin: 10}}
          floatingLabelText="지역 추가"
          floatingLabelFixed={true}
          value={this.state.areaText}
          onChange={this.handleChange}
        />
        <FloatingActionButton mini={true} onClick={this.handleClick}>
          <ContentAdd />
        </FloatingActionButton>

        <div style={{display: 'flex', flexWrap: 'wrap', width: 600, margin: 'auto'}}>
          {this.props.areaList.map(this.renderChip, this)}
        </div>

      </div>
    );
  }
}

function select(state) {
  const {
    dailyMenuAdder,
  } = state;
  return dailyMenuAdder;
}

export default connect(select)(DailyMenuAdderFooter);
