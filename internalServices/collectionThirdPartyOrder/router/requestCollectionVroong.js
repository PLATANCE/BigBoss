/**
 * Created by JudePark on 2016. 8. 4..
 */
const database = require('../../../database');
const fetch = require('node-fetch');
const config = require('getconfig');
const ExpressError = require('../../../error/ExpressError');
const seoulMoment = require('../../../seoulMoment');
const crypto = require('crypto');

const {
  apiKey,
  secretKey,
  hostURL,
  apiSummitPath,
} = config.vroong;

const {
  platingPhoneNumber,
} = config;

const PlatingPayMethod = {
  ONLINE_CARD: 1,
  OFFLINE_CARD: 2,
  OFFLINE_CASH: 3,
};

const VroongPaymentMethodMap = {
  [PlatingPayMethod.ONLINE_CARD]: 'PREPAID',
  [PlatingPayMethod.OFFLINE_CARD]: 'CREDIT_CARD',
  [PlatingPayMethod.OFFLINE_CASH]: 'CASH',
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

function isAddressInGu(address, gu) {
  const words = address.match(/\S+/g);
  const guOnSecondWord = (words[1] && words[1].indexOf(gu) >= 0);
  const guOnThirdWord = (words[2] && words[2].indexOf(gu) >= 0);

  return guOnSecondWord | guOnThirdWord;
}

function isAddressDeliveryAvailable(address) {
  return isAddressInGu(address, '강남구') || isAddressInGu(address, '송파구');
}

function generateHMACDigest(body) {
  const method = 'POST';
  const path = '/api/delivery/submit';
  console.log(`${method}${path}${body}`);
  return crypto.createHmac('sha256', secretKey)
  .update(`${method}${path}${body}`)
  .digest('hex');
}

function generateDestinationAddressArgument(addressData, orderIdx) {
  const {
    address: jibunAddress,
    address_detail: addressDetail,
    road_name_address: dest_address_road,
    lat: latitude,
    lon: longitude,
  } = addressData;

  let branchCode = 0;

  const fullJibunAddress = `${jibunAddress} ${addressDetail}`;
  const match = / \d+-?\d+ /g.exec(fullJibunAddress);
  const destAddress = fullJibunAddress.substr(0, match.index + match[0].length - 1);
  const destAddressDetail = `${fullJibunAddress.substr(match.index + match[0].length)}` +
    ` - 주문번호 ${orderIdx}`;
  if (!!!isAddressDeliveryAvailable(destAddress)) {
    throw new Error('배달 불가 지역. 부릉은 강남구, 송파구만 가능');
  }

  if (isAddressInGu(destAddress, '송파구')) {
    branchCode = 1;
  }

  return {
    dest_address: destAddress,
    dest_address_detail: destAddressDetail,
    dest_address_road,
    dest_address_detail_road: destAddressDetail,
    dest_lat: latitude,
    dest_lng: longitude,
    branch_code: branchCode,
  };
}

function generatePaymentMethodArgument(orderMeta) {
  const payMethod = orderMeta.pay_method;
  const paymentMethod = VroongPaymentMethodMap[payMethod];

  if (!!!paymentMethod) {
    throw new ExpressError(`Unknown payMethod ${payMethod}`, 404);
  }

  return {
    payment_method: paymentMethod,
  };
}

function generatePickupTimeArgument(timeSlot) {
  const timeString = timeSlot.time_str; // HH:mm
  return {
    pickup_at: seoulMoment(timeString, 'HH:mm')
    .subtract(15, 'm')
    .format('X'),
  };
}

function requestVroong(orderIdx, memo) {
  return Promise.all([
    database.getOrderMeta(orderIdx),
    database.getOrderTimeSlot(orderIdx),
    database.getOrderAddress(orderIdx),
  ])
  .then((results) => {
    const [
      orderMeta,
      timeSlot,
      addressData,
    ] = results;

    const paymentMethodArgument = generatePaymentMethodArgument(orderMeta);
    const destinationAddressArgument = generateDestinationAddressArgument(addressData, orderIdx);
    const pickupTimeArgument = generatePickupTimeArgument(timeSlot);

    const vroongOrderRequestContent = Object.assign(
      paymentMethodArgument,
      destinationAddressArgument,
      pickupTimeArgument,
      {
        request_id: orderIdx,
        sender_name: '(주)플레이팅',
        sender_phone: platingPhoneNumber,
        recipient_phone: orderMeta.mobile,
        delivery_value: orderMeta.total_price,
        order_created_at: seoulMoment().unix(),
        order_notes: memo,
      }
    );
    const body = JSON.stringify(vroongOrderRequestContent);
    const hmacDigest = generateHMACDigest(body);
    const headers = {
      Hmac: `${apiKey}:${hmacDigest}`,
    };
    const options = {
      method: 'POST',
      body,
      headers,
    };
    console.log(seoulMoment().format('YYYY-MM-DD HH:mm:SS'));
    console.log(options);

    return fetch(`${hostURL}${apiSummitPath}`, options)
    .then(checkStatus)
    .then(response => response.json())
    .then(json => {
      if (json.result === 'ERROR') {
        throw new Error(JSON.stringify(json));
      }
      return Promise.resolve(json);
    });
  });
}

module.exports = requestVroong;
