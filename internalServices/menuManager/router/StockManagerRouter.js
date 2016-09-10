const express = require('express');
const router = express.Router();
const database = require('../../../database');

router.get('/menu/:date', (req, response) =>
  database.getMenuDaily(req.params.date, 'menu_daily.priority')
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
    }));

// TODO - 디비업데이트가 성공했는지 실패했는지 검사하는 방법?
router.get('/update/:menuIdx/:area/:type/:value/:date', (req, response) => {
  const { menuIdx, area, type, value, date } = req.params;
  return database.addMenuDaily(menuIdx, area, type, value, date)
    .then(result => {
      if(result) {
        response.status(404).send({ message: 'update Stock Fail' });
      }
      else response.status(200).send({ message: 'success' });
    });
});

router.get('/update/priority/:menuIdx/:newPriority/:date', (req, response) => {
  const { menuIdx, newPriority, date } = req.params;
  return database.updateMenuDailyPriority(menuIdx, newPriority, date)
    .then(result => {
      if(result) {
        response.status(404).send({ message: 'update Priority Fail' });
      }
      else response.status(200).send({ message: 'success' });
    });
});


module.exports = router;
