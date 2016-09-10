const database = require('../../../database');
const fetch = require('node-fetch');
const config = require('getconfig');
const ExpressError = require('../../../error/ExpressError');
const seoulMoment = require('../../../seoulMoment');
const _ = require('lodash');

const {
  foodflyAPIServerURL,
  foodflyUserID,
  foodflyAuthToken,
  foodflyRestaurantID,
  } = config;
const PlatingPayMethod = {
  ONLINE_CARD: 1,
  OFFLINE_CARD: 2,
  OFFLINE_CASH: 3,
};
const FoodflyPaymentType = {
  CARD: 3,
  CASH: 4,
};
const PaymentTypeAlias = {
  [PlatingPayMethod.ONLINE_CARD]: FoodflyPaymentType.CARD,
  [PlatingPayMethod.OFFLINE_CARD]: FoodflyPaymentType.CARD,
  [PlatingPayMethod.OFFLINE_CASH]: FoodflyPaymentType.CASH,
};

function checkStatus(response) {
  return new Promise((resolve, reject) => {
    if (response.status >= 200 && response.status < 300) {
      return resolve(response);
    }
    return response.text()
      .then(text => JSON.stringify({
        body: text,
        statusText: response.statusText,
        status: response.status,
      }))
      .then(message => reject(message));
  });
}

function fetchAllMenusOfFoodfly() {
  return fetch(
    `${foodflyAPIServerURL}/restaurant/${foodflyRestaurantID}` +
    '?lat=37.521887598588&lon=127.02227229057&areacode=11680107'
  )
    .then(checkStatus)
    .then(response => response.json())
    .then(restaurantInfo => restaurantInfo.menus);
}

function generateAddressArgument(orderIdx) {
  return database.getOrderAddress(orderIdx)
    .then(addressData => {
      const {
        address: jibunAddress,
        address_detail: addressDetail,
        road_name_address: roadNameAddress,
        } = addressData;
      return fetch(`${foodflyAPIServerURL}/address?keyword=${encodeURI(jibunAddress)}`)
        .then(checkStatus)
        .then(response => response.json())
        .then(addressResults => {
          const sameAddressResult = addressResults.find(addressResult =>
            jibunAddress.indexOf(addressResult.formatted_address) >= 0
            || roadNameAddress.indexOf(addressResult.street_address) >= 0
          );
          if (!!!sameAddressResult) {
            console.log(seoulMoment().format('YYYY-MM-DD HH:mm:SS'));
            console.log(jibunAddress, roadNameAddress, addressResults);
            throw new ExpressError('not same address with foodfly address search result', 404);
          }

          if (!!!sameAddressResult.is_service_area) {
            throw new ExpressError('it is not in service area', 404);
          }

          const {
            formatted_address,
            street_address,
            lat,
            lon,
            } = sameAddressResult;

          const newAddressDetail = jibunAddress.indexOf(formatted_address) >= 0
            ? `${jibunAddress.substr(formatted_address.length)} ${addressDetail}`
            : addressDetail;

          return {
            formatted_address,
            street_address,
            lat,
            lon,
            detail_address: newAddressDetail,
            is_default: false,
            alias: '배송지',
          };
        });
    });
}

function checkAllMenusAvailable(orderMenus, foodflyMenus) {
  const allMenusAvailable = orderMenus.map((menu) => {
    const ourDBFoodflyMenuName = menu.foodfly_name;
    const isMenuAvailable = foodflyMenus.some(foodflyMenu =>
    foodflyMenu.name === ourDBFoodflyMenuName);
    return isMenuAvailable;
  });
  if (!!!allMenusAvailable) {
    throw new ExpressError('order has unavailable menu(s)', 404);
  }
}

function generateMenusArgument(orderMenus, foodflyMenus) {
  checkAllMenusAvailable(orderMenus, foodflyMenus);

  return orderMenus.map((menu) => {
    const matchingFoodflyMenu = foodflyMenus.find(foodflyMenu =>
    foodflyMenu.name === menu.foodfly_name);
    const id = matchingFoodflyMenu.id;
    const quantity = menu.amount;

    return {
      id,
      quantity,
      options: [],
    };
  });
}

function generateMileageArgument(orderMenus, foodflyMenus, orderMeta) {
  checkAllMenusAvailable(orderMenus, foodflyMenus);

  const totalPrice = orderMenus.reduce((previousValue, menu) => {
    const matchingFoodflyMenu = foodflyMenus.find(foodflyMenu =>
    foodflyMenu.name === menu.foodfly_name);
    return previousValue + matchingFoodflyMenu.price * menu.amount;
  }, 0);

  let purchasePrice = 0;
  orderMeta.map(item => purchasePrice += item.total_price);

  return totalPrice - purchasePrice;
}

function generatePaymentTypeArgument(orderMeta) {
  const payMethod = orderMeta.pay_method;
  const paymentType = PaymentTypeAlias[payMethod];

  if (!!!paymentType) {
    throw new ExpressError(`Unknown payMethod ${payMethod}`, 404);
  }

  return paymentType;
}

function generateReservationTimeArgument(timeSlot) {
  const timeString = timeSlot.time_str; // HH:mm

  // didn't consider near 24 o clock problem.

  // get current Time
  const oneHourLaterTimeString = seoulMoment().add(1, 'h').format('HH:mm');
  let reservationTimeString; // HH:mm
  if (timeString < oneHourLaterTimeString) {
    if (timeString < '16:15' || timeString > '21:00') {
      reservationTimeString = oneHourLaterTimeString;
    }
  } else {
    reservationTimeString = timeString;
  }

  if (reservationTimeString) {
    // return seoulMoment(reservationTimeString, 'HH:mm').format('X');
    return seoulMoment(reservationTimeString, 'HH:mm').add(10, 'm').format('X');
  }
  return undefined;
}

function generateAddressOnFoodfly(addressArgument) {
  return fetch(`${foodflyAPIServerURL}/user/${foodflyUserID}/address`, {
    method: 'POST',
    body: JSON.stringify(addressArgument),
    headers: {
      HTTP_X_AUTH_TOKEN: foodflyAuthToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(checkStatus)
    .then(response => response.json())
    .then(addedAddressResult => addedAddressResult.id);
}

function getOrdersData(orderIdxs) {
  return Promise.all([
    Promise.all(orderIdxs.map(idx => database.getOrderMeta(idx))),
    Promise.all(orderIdxs.map(idx => database.getOrderUser(idx))),
    Promise.all(orderIdxs.map(idx => database.getOrderTimeSlot(idx))),
    Promise.all(orderIdxs.map(idx => database.getOrderMenus(idx))),
  ])
  .then(results => {
    const [
      orderMeta,
      user,
      timeSlot,
      orderMenus,
    ] = results;

    let totalMenus = orderMenus[0];
    orderMenus.splice(0, 1);

    let arr = orderMenus.map(item => item);
    arr.map(data => totalMenus = _.concat(totalMenus, data));

    const response = {
      'orderMeta': orderMeta,
      'orderUser': user,
      'timeSlot': timeSlot,
      'orderMenus': totalMenus,
    };

    return response;
  });
}

// Test Case -> 1253, 1255
function requestCollectionFoodfly(orderIdxs, memoArgument) {
  return fetchAllMenusOfFoodfly()
  .then(foodflyMenus => getOrdersData(orderIdxs)
  .then(result => {
    const menusArgument = generateMenusArgument(result.orderMenus, foodflyMenus);
    const mileageArgument = generateMileageArgument(result.orderMenus, foodflyMenus, result.orderMeta);
    const paymentTypeArgument = generatePaymentTypeArgument(result.orderMeta[0]);
    const reservationTimeArgument = generateReservationTimeArgument(result.timeSlot[0]);

    return generateAddressArgument(orderIdxs[0])
    .then(addressArgument => generateAddressOnFoodfly(addressArgument)
    .then(addressId => {
      const foodflyOrderRequestBody = {
        restaurant_id: foodflyRestaurantID,
        address_id: addressId,
        receipient_name: '플레이팅',
        receipient_phone: result.orderUser[0].mobile,
        menus: menusArgument,
        mileage: mileageArgument,
        payment_type: paymentTypeArgument,
        delivery_type: 1,
        memo: memoArgument,
      };

      if (reservationTimeArgument) {
        foodflyOrderRequestBody.reservation_time = reservationTimeArgument;
      }

      console.log(seoulMoment().format('YYYY-MM-DD HH:mm:SS'));
      console.log('collection foodfly reuqest body -> ', foodflyOrderRequestBody);
      return fetch(`${foodflyAPIServerURL}/user/${foodflyUserID}/order`, {
        method: 'POST',
        body: JSON.stringify(foodflyOrderRequestBody),
        headers: {
          HTTP_X_AUTH_TOKEN: foodflyAuthToken,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })
      .then(checkStatus)
      .then(response => response.json());
    }));
  }));
}

module.exports = requestCollectionFoodfly;
