/**
 * Created by limhwangyu on 2016. 8. 4..
 */
const express = require('express');
const router = express.Router();
const database = require('../../../database');

router.get('/menu/readied', (req, response) =>
  database.getMenuReadied()
    .then(menu => {
      if (!!!menu) {
        return response.status(404).json({
          message: 'no menu readied',
        });
      }
      const resBody = {
        message: menu,
      };

      return response.status(200).send(resBody);
    }));

router.get('/area/all', (req, response) =>
  database.getAreaList()
    .then(area => {
      if (!!!area) {
        return response.status(404).json({
          message: 'no menu_daily area',
        });
      }
      const resBody = {
        message: area,
      };
      return response.status(200).send(resBody);
    }));

router.get('/menu/period/:startDay/:endDay', (req, response) =>
  database.getMenuDailyInPeriod( req.params.startDay, req.params.endDay )
    .then(menu => {
      if (!!!menu) {
        return response.status(404).json({
          message: 'cannot get menu in period',
        });
      }
      const resBody = {
        message: menu,
      };

      return response.status(200).send(resBody);
    }));

router.get('/menu/insert/:menuIdx/:area/:serve_date/:stock', (req, response) =>
  database.addDailyMenu(req.params.menuIdx, req.params.area, req.params.serve_date, req.params.stock)
    .then(msg => {
      const resBody = {
        message: msg,
      };

      return response.status(200).send(resBody);
    }));

module.exports = router;
