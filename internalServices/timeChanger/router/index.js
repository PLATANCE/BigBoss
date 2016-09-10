'use strict';
const express = require('express');
const router = express.Router();
const database = require('../../../database');

router.get('/timeSlot', (req, res) => (
  database.getTimeSlots()
    .then((timeSlots) => {
      if (!!!timeSlots) {
        return res.status(404).json({
          message: 'no time slot',
        });
      }

      const ret = [];
      timeSlots.forEach(timeSlot => {
        ret.push({
          time: timeSlot.time_slot,
          idx: timeSlot.idx,
        });
      });

      return res.json({
        timeSlots: ret,
      });
    })
    .catch((err) => res.status(500).json(err))
));

router.route('/order/:orderIdx/timeSlot')
  .get((req, res) => {
    const {
      orderIdx,
    } = req.params;

    return database.getOrderTimeSlot(orderIdx)
      .then(timeSlot => {
        if (!!!timeSlot) {
          return res.status(404).json({
            message: 'no time slot or order',
          });
        }

        return res.json({
          time: timeSlot.time_slot,
          idx: timeSlot.idx,
        });
      })
      .catch((err) => res.status(500).json(err));
  })
  .put((req, res) => {
    const { orderIdx } = req.params;
    const {
      timeSlotIdx,
    } = req.body;

    return database.getTimeSlot(timeSlotIdx)
      .then((timeSlot) => {
        if (!!!timeSlot) {
          return res.status(404).json({
            message: 'no such time slot',
          });
        }

        return database.updateOrderMeta(orderIdx, {
          timeSlotIdx,
        })
        .then(result => res.json(result));
      })
      .catch((err) => res.status(500).json(err));
  });
module.exports = router;
