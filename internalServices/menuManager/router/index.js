/**
 * Created by limhwangyu on 2016. 8. 3..
 */
const express = require('express');
const router = express.Router();
const StockManagerRouter = require('./StockManagerRouter');
const DailyMenuAdderRouter = require('./DailyMenuAdderRouter');

router.use(DailyMenuAdderRouter);
router.use(StockManagerRouter);

module.exports = router;
