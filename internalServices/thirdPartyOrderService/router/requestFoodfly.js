const database = require('../../../database');
const fetch = require('node-fetch');
const config = require('getconfig');
const ExpressError = require('../../../error/ExpressError');
const seoulMoment = require('../../../seoulMoment');

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
  const allMenusAvailable = orderMenus.every((menu) => {
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

  const purchasePrice = orderMeta.total_price;
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

function generateMemoArgument(orderMeta) {
  let memo = '';

  const payMethod = orderMeta.pay_method;
  if (payMethod === PlatingPayMethod.ONLINE_CARD) {
    memo += '[[입금]]\n';
  }

  const orderIdx = orderMeta.idx;
  memo += `주문 번호 : ${orderIdx}\n`;

  return memo;
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

function requestFoodfly(orderIdx) {
  return Promise.all([
    database.getOrderMenus(orderIdx),
    fetchAllMenusOfFoodfly(),
    generateAddressArgument(orderIdx),
    database.getOrderMeta(orderIdx),
    database.getOrderUser(orderIdx),
    database.getOrderTimeSlot(orderIdx),
  ])
    .then((results) => {
      const [
        orderMenus,
        foodflyMenus,
        addressArgument,
        orderMeta,
        user,
        timeSlot,
        ] = results;

      const menusArgument = generateMenusArgument(orderMenus, foodflyMenus);
      const mileageArgument = generateMileageArgument(orderMenus, foodflyMenus, orderMeta);
      const paymentTypeArgument = generatePaymentTypeArgument(orderMeta);
      const memoArgument = generateMemoArgument(orderMeta);
      const reservationTimeArgument = generateReservationTimeArgument(timeSlot);

      return generateAddressOnFoodfly(addressArgument)
        .then(addressId => {
          const foodflyOrderRequestBody = {
            restaurant_id: foodflyRestaurantID,
            address_id: addressId,
            receipient_name: '플레이팅',
            receipient_phone: user.mobile,
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
          console.log(foodflyOrderRequestBody);
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
        });
    });
}

module.exports = requestFoodfly;
