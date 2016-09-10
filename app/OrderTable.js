import {Component} from 'react';

class OrderTable extends Component {

  renderRow() {
    return (
      <tr>
        <td>1</td>
        <td>2</td>
        <td>3</td>
      </tr>
    )
  }

  render() {
    return (
      <table>
        <thead />
        <tbody>
          {this.renderRow()}
          {this.renderRow()}
          {this.renderRow()}
        </tbody>
      </table>
    )
  }
}

export default OrderTable