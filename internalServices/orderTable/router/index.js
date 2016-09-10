'use strict';
const express = require('express');
const router = express.Router();
const database = require('../../../database');

router.get('/list', (req, res) => {
  database.getOrderList().then(results => {
    if (!results) {
      return res.status(404).json({
        message: `don\'t exist user at mobile is a ${mobile}.`,
      });
    }
    return res.json({
      orders: results,
    });
  })
})

module.exports = router;
