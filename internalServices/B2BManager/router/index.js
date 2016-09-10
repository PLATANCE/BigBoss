const express = require('express');
const router = express.Router();
const database = require('../../../database');
const moment = require('moment');

router.get('/menuDaily', (req, response) => {
  const today = moment().format('YYYY-MM-DD');
  return database.getMenuDaily(today, 'menu_daily.stock', 'desc')
    .then(menuDaily => {
      if (!!!menuDaily) {
        return response.status(404).json({
          message: 'no menuDaily',
        });
      }
      const resBody = {
        message: menuDaily,
      };
      return response.status(200).send(resBody);
    });
});

router.get('/setFeatured/:idx', (req, response) => {
  const { idx } = req.params;
  return database.menuDailySetFeatured(idx, 1)
    .then(() => response.status(200).send({ message: 'success' }))
    .catch(() => response.status(400).send({ message: 'error' }));
});

router.get('/cancleFeatured/:idx', (req, response) => {
  const { idx } = req.params;
  return database.menuDailySetFeatured(idx, 0)
    .then(() => response.status(200).send({ message: 'success' }))
    .catch(() => response.status(400).send({ message: 'error' }));
});

module.exports = router;
