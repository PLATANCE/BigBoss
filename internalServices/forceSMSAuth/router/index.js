'use strict';
const express = require('express');
const router = express.Router();
const database = require('../../../database');

router.get('/authInfo/:phoneNumber', (req, res) => {
  const {
    phoneNumber,
  } = req.params;
  return Promise.all([
    database.getAuthInfoWithPhoneNumber(phoneNumber),
    database.getUsersWhoHaveMobile(phoneNumber),
  ]).then((results) => res.json({
    authInfos: results[0],
    users: results[1],
  }));
});

router.get('/address/:addressDetail', (req, res) => {
  const {
    addressDetail,
  } = req.params;
  return database.getAddressesWithAddressDetail(addressDetail)
  .then(result => res.json(result));
});

router.post('/user/:userIdx/auth/:phoneNumber', (req, res) => {
  const {
    userIdx,
    phoneNumber,
  } = req.params;
  console.log(req.params);
  return database.getUsersWhoHaveMobile(phoneNumber)
  .then((users) => {
    if (users.length > 0) {
      return res.status(400).json({
        message: '이미 그 번호로 인증된 회원이 있습니다.',
      });
    }
    return database.setUserMobile(userIdx, phoneNumber)
    .then(() => res.json({
      message: 'success',
    }));
  });
});
module.exports = router;
