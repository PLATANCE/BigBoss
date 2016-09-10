const express = require('express');
const router = express.Router();
const seoulMoment = require('../../../seoulMoment');
const database = require('../../../database');
const fetch = require('node-fetch');

router.post('/', (req, res) => {

  const userIdx = 1;

  const {
    address,
    addressDetail,
    mobile,
    menuDailyIndex,
    orderAmount,
    timeSlot,
  } = req.body;

  // 주소가 Valid한지 체크 -> 데이터베이스에 주소를 박음 -> 박은 주소의 Area를 tasting-1로 수정함 -> 그리고 주문을 넣음.
  return fetch('https://address.plating.co.kr/?query=' + encodeURI(address))
  .then(response => response.json())
  .then(json => json[0])
  .then(addressData => {
    const body = {
      user_idx: userIdx,
      address: addressData.jibunAddress,
      road_name_address: addressData.roadNameAddress,
      address_detail: addressDetail,
      delivery_available: addressData.available,
      area: 'tasting-1',
      lat: addressData.latitude,
      lon: addressData.longitude,
    };

    return database.saveAreaToTastingArea(body)
    .then(addressIdx => addressIdx[0]);
  })
  .then(addressIdx => {
    const body = JSON.stringify({
      user_idx: userIdx,
      time_slot: timeSlot,
      menu_d_idx: menuDailyIndex,
      order_amount: orderAmount,
      mobile: mobile,
      address_idx: addressIdx,
    });

     //menu_idx, address_idx
    return fetch('http://api.plating.co.kr/place_order/tasting', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    })
    .then(response => response.json())
    .then(json => res.send(json));
  })
  .catch(e => res.send({ 'message': e }));
});

module.exports = router;