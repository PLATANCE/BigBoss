const express = require('express');
const router = express.Router();
const seoulMoment = require('../../../seoulMoment');
const database = require('../../../database');

router.get('/user/:userIdx', (req, res) => {
  const {
    userIdx,
  } = req.params;

  return database.getUserOrderLog(userIdx)
  .then(response => response[0])
  .then(obj => res.send({ obj }));
});

module.exports = router;