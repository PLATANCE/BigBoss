import { Actions } from './actions';
import Dish from './Dish';
import Stock from './Stock';
import SelectedDish from './SelectedDish';


const defaultMenuChangerState = {
  orderIdx: undefined,
  userIdx: undefined,
  user: undefined,
  date: undefined,
  originPrice: undefined,
  totalPrice: undefined,
  stockList: undefined,
  area: undefined,
  payMethod: undefined,
  couponIdx: undefined,
  pointDelta: 0,
  menu: [],
  orderedMenu: [],
  selectedMenu: [],
};
function menuChanger(state = Object.assign({}, defaultMenuChangerState), action) {
  switch (action.type) {

    case Actions.RESET_ORDER_DATA:
      {
        return Object.assign({}, state, {
          orderIdx: null,
          userIdx: null,
          user: null,
          date: null,
          originPrice: null,
          totalPrice: null,
          stockList: null,
          area: null,
          payMethod: null,
          couponIdx: null,
          pointUsed: null,
          pointDelta: 0,
          orderedMenu: [],
          selectedMenu: [],
        });
      }

    case Actions.APPLY_POINT:
      {
        const { point } = action;
        const {
          totalPrice,
          user,
          pointUsed,
          pointDelta,
        } = state;

        if (point > user.point) {
          alert('보유 중인 포인트보다 많은 포인트를 적용할 수 없습니다.');
          return state;
        }
        const newPointUsed = pointUsed + point;
        const newtotalPrice = totalPrice - point;
        const newUserPoint = user.point - point;
        const newpointDelta = pointDelta + point;
        const newUser = Object.assign({}, user, {
          point: newUserPoint,
        });
        if (totalPrice < 0) {
          alert('최종금액이 0보다 작을 수 없습니다.');
          return state;
        }
        return Object.assign({}, state, {
          pointUsed: newPointUsed,
          totalPrice: newtotalPrice,
          user: newUser,
          pointDelta: newpointDelta,
        });
      }

    case Actions.REQUEST_GIVE_POINT:
      {
        const { userIdx } = action;
        return Object.assign({}, state, {
          userIdx,
        });
      }

    case Actions.REQUEST_USER_INFO_BY_MOBILE:
      {
        return state;
      }

    case Actions.CHANGE_AMOUNT:
      {
        const { idx } = action;
        let { amount } = action;
        amount = parseInt(amount, 10);
        const selectedMenu = state.selectedMenu.slice(0);
        const target = selectedMenu.find((element) => (
          element.menuIdx === idx
        ));
        if (amount !== 0) {
          const menuIdx = selectedMenu.indexOf(target);
          target.amount = amount;
          selectedMenu[menuIdx] = target;
        }
        return Object.assign({}, state, {
          selectedMenu,
        });
      }

    case Actions.REQUEST_ORDER_MENU:
      {
        const { orderIdx } = action;
        return Object.assign({}, state, {
          orderIdx,
        });
      }

    case Actions.RECEIVE_ORDER_MENU:
      {
        const { data } = action;
        const orderedMenu = [];
        const selectedMenu = [];

        if (data && data.orderedMenu) {
          const menu = state.menu;
          data.orderedMenu.forEach((row) => {
            const { idx, menuIdx, amount } = row;
            const targetDish = _.find(menu, { idx: menuIdx });
            if (targetDish) {
              const orderedDish = new SelectedDish(
                idx, targetDish.idx, targetDish.name, targetDish.price, amount);
              orderedMenu.push(orderedDish);
              selectedMenu.push(new SelectedDish(
                idx, targetDish.idx, targetDish.name, targetDish.price, amount));
            } else {
              console.log(`menuIdx가 ${menuIdx}인 메뉴가 없어요.`);
            }
          });
        }
        const { date, totalPrice, userIdx, pointUsed, couponIdx, payMethod } = data;
        let { area } = data;
        area = area || 'seoul-1';
        return Object.assign({}, state, {
          userIdx,
          orderedMenu,
          selectedMenu,
          date,
          area,
          originPrice: totalPrice,
          totalPrice,
          pointUsed,
          couponIdx,
          payMethod,
        });
      }

    case Actions.REQUEST_MENU:
      {
        const { date } = action;
        return Object.assign({}, state, {
          date,
        });
      }

    case Actions.RECEIVE_MENU:
      {
        const { data } = action;
        const menu = [];
        if (data && data.menu) {
          data.menu.forEach(row => {
            const { idx, name, price, ready } = row;
            const dish = new Dish(idx, name, price, ready);
            menu.push(dish);
          });
        }
        return Object.assign({}, state, {
          menu,
        });
      }

    case Actions.CLEAR_DISH:
      {
        const { menuIdx } = action;
        const selectedMenu = state.selectedMenu.slice(0);
        const stockList = state.stockList.slice(0);
        const removedDish = _.remove(selectedMenu, { menuIdx });
        const stock = stockList.find((element) => (
          element.menuIdx === removedDish[0].menuIdx
        ));
        const stockIdx = stockList.indexOf(stock);
        stock.rest += removedDish[0].amount;
        stockList[stockIdx] = stock;
        return Object.assign({}, state, {
          selectedMenu,
          stockList,
        });
      }

    case Actions.ADD_DISH_TO_LIST:
      {
        const menu = state.menu;
        const { orderData } = action;
        const selectedMenu = state.selectedMenu.slice(0);
        const stockList = state.stockList.slice(0);
        const { stock, amount } = orderData;
        const targetDish = _.find(menu, { idx: stock.menuIdx });
        const stockIdx = stockList.indexOf(stock);
        const alreadySelected = selectedMenu.find((element) => (
          element.menuIdx === stock.menuIdx
        ));
        if (targetDish) {
          if (alreadySelected) {
            const menuIdx = selectedMenu.indexOf(alreadySelected);
            alreadySelected.amount += amount;
            selectedMenu[menuIdx] = alreadySelected;
          } else {
            const selectedDish = new SelectedDish(
              null, targetDish.idx, targetDish.name, targetDish.price, amount);
            selectedMenu.push(selectedDish);
          }
          stockList[stockIdx].rest = stock.rest - amount;
        } else {
          console.log(`menuIdx가 ${stock.menuIdx}인 메뉴가 없어요.`);
        }
        return Object.assign({}, state, {
          selectedMenu,
          stockList,
        });
      }
    case Actions.RECEIVE_MENU_STOCK:
      {
        const { data } = action;
        const stockList = [];
        const menu = state.menu;
        if (data && data.stock) {
          data.stock.forEach(row => {
            const { idx, menuIdx, stock, ordered, area } = row;
            const targetDish = _.find(menu, { idx: menuIdx });
            const rest = stock - ordered;
            const one = new Stock(
              idx, targetDish.idx, targetDish.name, targetDish.price, rest, area);
            stockList.push(one);
          });
        }
        return Object.assign({}, state, {
          stockList,
        });
      }
    case Actions.UPDATE_TOTAL_PRICE:
      {
        const selectedMenu = state.selectedMenu.slice(0);
        const couponIdx = state.couponIdx;
        let couponDiscount = 0;
        let totalPrice = 0;
        selectedMenu.forEach(dish => {
          totalPrice += (dish.price * dish.amount);
        });
        if (couponIdx === 30) {
          couponDiscount = 10000;
        } else if (couponIdx === 40) {
          couponDiscount = 2000;
        } else if (couponIdx === 41) {
          couponDiscount = 4000;
        } else if (couponIdx === 42) {
          couponDiscount = 10000;
        } else if (couponIdx === 43) {
          couponDiscount = 4000;
        } else if (couponIdx === 44) {
          couponDiscount = 2000;
        } else if (couponIdx === 45) {
          couponDiscount = totalPrice * 0.1;
        } else if (couponIdx === 48) {
          couponDiscount = totalPrice * 0.2;
        } else if (couponIdx === 999) {
          couponDiscount = totalPrice * 0.2;
        } else {
          couponDiscount = 0;
        }
        totalPrice = totalPrice - state.pointUsed - couponDiscount;
        return Object.assign({}, state, {
          totalPrice,
        });
      }
    case Actions.RECEIVE_USER_INFO:
      {
        const { data } = action;
        const user = {
          mobile: data.user.mobile,
          point: data.user.point,
          idx: data.user.idx,
          nickname: data.user.nickname,
        };
        return Object.assign({}, state, {
          user,
        });
      }

    case Actions.REQUEST_CANCEL_ORDER:
      {
        const { orderIdx } = action;
        return Object.assign({}, state, {
          orderIdx,
        });
      }
    case Actions.RECEIVE_SUBMIT_ORDER:
      {
        return state;
      }

    case Actions.REQUEST_SUBMIT_ORDER:
      {
        return state;
      }
    default:
      return state;
  }
}

export default menuChanger;
