const express = require('express');
const database = require('../database');
const moment = require('moment');
const router = express.Router();

router.route('/menu/')
  .get((req, res) => {
    let {
      date,
      callback,
    } = req.query;
    date = moment(date).format('YYYY-MM-DD');
    return database.getMenuDaily(date)
      .then(menuDaily => {
        if (!!!menuDaily) {
          return res.status(404).json({
            message: 'no menuDaily',
          });
        }
        const ret = [];
        menuDaily.forEach(menu => {
          ret.push({
            serve_date: moment(menu.serve_date).format('YYYY-MM-DD'),
            idx: menu.idx,
            name_menu: menu.name_menu,
            menu_idx: menu.menu_idx,
            stock: menu.stock,
            ordered: menu.ordered,
            area: menu.area,
          });
        });
        callback = callback.toString();
        const s = callback.concat('(', JSON.stringify(ret), ')');
        return res.send(s);
      })
      .catch((err) => res.status(500).json(err));
  }
);


router.route('/change_ordered/')
  .get((req, res) => {
    let {
      callback,
    } = req.query;
    const { ordered } = req.query;
    const array = JSON.parse('['.concat(ordered.slice(0, -1), ']'));
    let date = array.shift();
    date = moment(date.toString()).format('YYYY-MM-DD');
    return database.getMenuDaily(date, 'menu_idx.idx')
      .then(menuDaily => {
        if (!!!menuDaily) {
          return res.status(404).json({
            message: 'no menuDaily',
          });
        }
        let amount;
        const promises = [];
        menuDaily.forEach((menu, index) => {
          amount = array[index];
          promises.push(database.updateMenuAmount(date, menu, amount));
        });
        return Promise.all(promises).then(() => {
          callback = callback.toString();
          const s = callback.concat('(', ')');
          return res.send(s);
        });
      })
      .catch((err) => res.status(500).json(err));
  }
);

module.exports = router;
