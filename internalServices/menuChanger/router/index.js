const express = require('express');
const router = express.Router();
const database = require('../../../database');
const moment = require('moment');

function respondWithResult(res, statusCode = 200) {
  return (entity) => {
    if (entity) {
      const result = { data: entity };
      if (res.token) result.token = res.token;
      res.status(statusCode).json(result);
    }
  };
}

function handleError(res, statusCode = 500) {
  return (err) => {
    res.status(statusCode).send(err);
  };
}

router.get('/user/mobile/:mobile', (req, res) => {
  const {
    mobile,
  } = req.params;
  database.getUserByMobile(mobile).then(results => {
    if (!!!results) {
      return res.status(404).json({
        message: `don\'t exist user at mobile is a ${mobile}.`,
      });
    }
    return res.json({
      user: results,
    });
  })
  .catch((err) => res.status(500).json(err));
});


router.get('/menu', (req, res) => (
  database.getMenu()
    .then((menu) => {
      if (!!!menu) {
        return res.status(404).json({
          message: 'menu don\'t exist.',
        });
      }
      const ret = [];
      menu.forEach(dish => {
        ret.push({
          idx: dish.idx,
          name: dish.name_menu,
          price: dish.alt_price,
          ready: dish.ready,
        });
      });

      return res.json({
        menu: ret,
      });
    })
    .catch((err) => res.status(500).json(err))
));

router.get('/menuStock/:serveDate/area/:area', (req, res) => {
  const {
    serveDate,
    area,
  } = req.params;
  database.getMenuStock(serveDate, area)
    .then((menuStocks) => {
      if (!!!menuStocks) {
        return res.status(404).json({
          message: 'menu don\'t exist.',
        });
      }

      const ret = [];
      menuStocks.forEach(menuStock => {
        ret.push({
          idx: menuStock.idx,
          menuIdx: menuStock.menu_idx,
          stock: menuStock.stock,
          ordered: menuStock.ordered,
          area: menuStock.area,
        });
      });

      return res.json({
        stock: ret,
      });
    })
    .catch((err) => res.status(500).json(err));
});

router.route('/user/:userIdx')
  .get((req, res) => {
    const {
      userIdx,
    } = req.params;
    database.getUser(userIdx).then(results => {
      if (!!!results) {
        return res.status(404).json({
          message: `don\'t exist user at orderIdx is a ${userIdx}.`,
        });
      }
      return res.json({
        user: results,
      });
    })
    .catch((err) => res.status(500).json(err));
  })
  .put((req, res) => {
    const {
      userIdx,
    } = req.params;
    const {
      point,
      reason,
    } = req.body;
    const name = req.session.passport.user.displayName;
    const query =
      {
        user_idx: userIdx,
        point,
        reason,
        name,
      };
    database.givePointToUser(query)
    .then(respondWithResult(res, 200))
    .catch(handleError(res));
  });

router.route('/order/:orderIdx')
  .get((req, res) => {
    const {
      orderIdx,
    } = req.params;
    database.getOrderInfo(orderIdx).then(results => {
      const orderedMenu = results.detail;
      const orderMeta = results.meta;

      if (!!!orderedMenu || !!!orderMeta) {
        return res.status(404).json({
          message: `don\'t exist menu or order at orderIdx is a ${orderIdx}.`,
        });
      }

      const ret = [];
      orderedMenu.forEach(dish => {
        ret.push({
          idx: dish.idx,
          menuIdx: dish.menu_idx,
          orderIdx: dish.order_idx,
          amount: dish.amount,
        });
      });

      return res.json({
        orderedMenu: ret,
        date: moment(orderMeta.request_time).format('YYYY-MM-DD'),
        totalPrice: orderMeta.total_price,
        area: orderMeta.area,
        userIdx: orderMeta.user_idx,
        pointUsed: orderMeta.point_used,
        couponIdx: orderMeta.coupon_idx,
        payMethod: orderMeta.pay_method,
      });
    })
    .catch((err) => res.status(500).json(err));
  })
  .put((req, res) => {
    const { orderIdx } = req.params;
    const {
      shouldUpdateMenu,
      shouldDeleteMenu,
      shouldInsertMenu,
      totalPrice,
      pointUsed,
      pointDelta,
      date,
      area,
      userIdx,
    } = req.body;

    return database.updateOrder(
      orderIdx,
      shouldUpdateMenu,
      shouldInsertMenu,
      shouldDeleteMenu,
      totalPrice,
      pointDelta,
      pointUsed,
      date,
      area,
      userIdx)
      .then(respondWithResult(res, 200))
      .catch(handleError(res));
  })
  .delete((req, res) => {
    const { orderIdx } = req.params;
    return database.cancelOrder(orderIdx)
    .then(respondWithResult(res, 200))
    .catch(handleError(res));
  });
module.exports = router;
