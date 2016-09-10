'use strict';
const express = require('express');
const router = express.Router();
const database = require('../../../database');

router.get('/order/:orderIdx/address', (req, res) => {
  const { orderIdx } = req.params;

  return database.getOrderAddress(orderIdx)
    .then((addressData) => {
      if (!!!addressData) {
        return res.status(404).json({
          message: "no such order or order's address",
        });
      }
      const idx = addressData.idx;
      const jibunAddress = addressData.address;
      const addressDetail = addressData.address_detail;
      const roadNameAddress = addressData.road_name_address;
      return res.json({
        idx,
        jibunAddress,
        addressDetail,
        roadNameAddress,
      });
    })
    .catch((err) => res.status(500).json(err));
});

router.put('/address/:addressIdx', (req, res) => {
  const { addressIdx } = req.params;
  const {
    jibunAddress,
    roadNameAddress,
    addressDetail,
    latitude,
    longitude,
    available,
  } = req.body;
  return database.updateAddress({
    idx: addressIdx,
    jibunAddress,
    roadNameAddress,
    addressDetail,
    latitude,
    longitude,
    available,
  })
  .then(result => res.json(result))
  .catch(err => res.status(500).json(err));
});

module.exports = router;
