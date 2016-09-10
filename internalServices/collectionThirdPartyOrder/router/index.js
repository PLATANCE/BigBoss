const express = require('express');
const router = express.Router()
const seoulMoment = require('../../../seoulMoment');
const database = require('../../../database');
const requestFoodfly = require('../../thirdPartyOrderService/router/requestFoodfly');
const requestVroong = require('../../thirdPartyOrderService/router/requestVroong');
const requestCollectionFoodfly = require('./requestCollectionFoodfly');
const _ = require('lodash');

router.post('/test', (req, res) => {
  const {
    orderIdxs,
  } = req.body;

  const isAllAddressEquals = arr => arr.every(v => v.address === arr[0].address);

  const isConditionValid = (orderIdxs) => new Promise((resolve, resject) => {
    return Promise.all(
      orderIdxs.map(item => database.getAddressByOrderIdx(item).then(row => row[0]).then(data => {
        console.log('Collection Foodfly getAddressIdx Data -> ', data);
        return {
          address: data.address,
          total_price: data.total_price,
          point_used: data.point_used,
        };
      }).catch(e => {
        console.log('Collection Foodfly Address Not Equals -> ', e);
        return res.send({ 'message' : '사용자가 주소를 추가하지 않았습니다. 또는 각각의 주문 번호의 주소지가 일치하지 않습니다.' });
      }))
    )
    .then(data => {
      data.filter(element => {
        if ((element.total_price + element.point_used) < 10000) {
          return res.send({ 'message': '푸드플라이 측의 최소 주문 금액은 10000원 이상입니다.' });
        }
      });

      return data;
    })
    .then(address => isAllAddressEquals(address))
    .then(isCompleted => {
      if (!!!isCompleted) {
        return res.send({ 'message': '주문 번호의 주소지가 일치하지 않습니다.' });
      } else {
        return resolve();
      }
    });
  });

  const generateMemoArgument = (orderIdxs) => new Promise((resolve, reject) => {
    return Promise.all(
      orderIdxs.map(idx => database.getAddressByOrderIdx(idx).then(row => row[0]).then(data => {
        console.log('Collection Foodfly getAddressByOrderIdx -> ', data);
        return {
          'pay_method': data.pay_method,
          'order_idx': data.idx,
          'total_price': data.total_price,
        };
      })
      .catch(err => res.send({ 'message': err  })))
    )
    .then(result => {
      let defaultMessage = '';
      let orderIdxsMessage = '';
      let price = 0;

      result.filter(orderMeta => {
        if (orderMeta.pay_method === 0) {
          return res.send({'message': 'PayMethod가 0인 것은 지원하지 않습니다.'});
        }
        orderIdxsMessage += ` ${orderMeta.order_idx}`;
        price += parseInt(orderMeta.total_price);
      });

      if (price === 0) {
        defaultMessage += '[[입금]] 주문 번호 :';
        defaultMessage += orderIdxsMessage;
      } else {
        defaultMessage += '주문 번호 :';
        defaultMessage += orderIdxsMessage;
      }

      return resolve(defaultMessage);

    });
  });

  return isConditionValid(orderIdxs)
  .then(() => generateMemoArgument(orderIdxs)
  .then(memoArgument => requestCollectionFoodfly(orderIdxs, memoArgument)
  .then(message => res.send({ 'message': message }))));

});

module.exports = router;
