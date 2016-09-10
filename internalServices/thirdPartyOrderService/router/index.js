const express = require('express');
const router = express.Router();
const seoulMoment = require('../../../seoulMoment');
const requestVroong = require('./requestVroong');
const requestFoodfly = require('./requestFoodfly');
const database = require('../../../database');

router.post('/order/:orderIdx/foodfly', (req, res) => {
  const {
    orderIdx,
  } = req.params;

  let message = `푸플 | 시간 : ${seoulMoment().format('HH:mm')} | 주문번호: ${orderIdx} | `;

  return requestFoodfly(orderIdx)
  .then((result) => {
    console.log(result);
    message += `-> 접수에 성공하였습니다.`;
  })
  .catch((error) => {
    console.log(error);
    message += `-> 접수에 실패하였습니다.`;
  })
  .then(() => {
    console.log(`[${seoulMoment().format('MM-DD HH:mm:ss')}] thirdPartyOrder\n${message}`);
    return database.insertThirdPartyDelevieryLog({
      order_idx: orderIdx,
      'message': message,
      company: 'foodfly',
    })
    .then(() => res.send({ message }))
  });
});

router.post('/order/:orderIdx/vroong', (req, res) => {
  const {
    orderIdx,
  } = req.params;

  let message = `부릉 | 시간 : ${seoulMoment().format('HH:mm')} | 주문번호: ${orderIdx} | `;

  //message += `부릉 배송 요청 실패.\n에러 메시지 : ${error} 이며 접수에 실패하였습니다.\n\n`;
  //message += `부릉 배송요청 성공\n 부릉자체배송번호 : ${result.delivery_id} 이며 접수에 성공하였습니다. \n`;

  return requestVroong(orderIdx)
  .then((result) => {
    console.log(result);
    message += `-> 접수에 성공하였습니다.`;
  })
  .catch((error) => {
    console.log(error);
    message += `-> 접수에 실패하였습니다.`;
  })
  .then(() => {
    console.log(`[${seoulMoment().format('MM-DD HH:mm:ss')}] thirdPartyOrder\n${message}`);
    return database.insertThirdPartyDelevieryLog({
      order_idx: orderIdx,
      'message': message,
      company: 'vroong',
    })
    .then(() => res.send({ message }));
  });
});

router.post('/order/:orderIdx', (req, res) => {
  const {
    orderIdx,
  } = req.params;

  let message = `주문번호: ${orderIdx}\n`;

  const requestFoodflyBlock = () => requestFoodfly(orderIdx)
  .then((result) => {
    message += `푸플 접수 메시지 : ${JSON.stringify(result)}\n`;
  })
  .catch((error) => {
    // TODO Log the error
    message += `푸플 접수 실패.\n에러 메시지 : ${error}`;
  });

  return requestVroong(orderIdx)
  .then((result) => {
    message += `부릉 배송요청 성공\n 부릉자체배송번호 : ${result.delivery_id}\n`;
  })
  .catch((error) => {
    message += `부릉 배송 요청 실패.\n에러 메시지 : ${error}\n\n`
      + '푸플 주문 요청 시작';

    return requestFoodflyBlock();
  })
  .then(() => {
    console.log(`[${seoulMoment().format('MM-DD HH:mm:ss')}] thirdPartyOrder\n${message}`);
    return res.json({ message });
  });
});
module.exports = router;
