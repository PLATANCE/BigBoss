export default class SelectedDish {
  constructor(orderDetailIdx, menuIdx, name, price, amount) {
    this.orderDetailIdx = orderDetailIdx;
    this.menuIdx = menuIdx;
    this.name = name;
    this.price = price;
    this.amount = amount;
  }
}
