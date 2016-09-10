const config = require('getconfig');
const moment = require('moment');
const Promise = require('bluebird');

function defaultFuntionsWithKnexObject(knex) {
  return {
    getOrderList: () => {
      return knex.raw(`SELECT order_meta.idx
     , user.nickname 
     , CONCAT(user_address.address ,' ', user_address.address_detail ) as addr_no
     , (SELECT GROUP_CONCAT(menu.name_menu SEPARATOR ',') as menu_name 
          FROM order_detail 
             , menu
         WHERE order_detail.order_idx = order_meta.idx 
           AND menu.idx               = order_detail.menu_idx ) AS MENU_NAME
     , time_slot.time_slot
  FROM order_meta
     , user 
     , user_address
     , time_slot
 WHERE user.idx                 = order_meta.user_idx
   AND user_address.user_idx    = order_meta.user_idx
   AND user_address.idx         = order_meta.address_idx
   AND time_slot.idx            = order_meta.time_slot
   AND DATE_FORMAT(order_meta.request_time,'%Y%m%d') = '20160816' 
 ORDER
    BY time_slot.time_str, order_meta.request_time
;`)
      // return knex('order_meta')
      //   .join('user', 'user.idx', 'order_meta.user_idx')
      //   .join('user_address', 'user_address.idx', 'order_meta.address_idx')
      //   .join('order_detail', 'order_detail.order_idx', 'order_meta.idx')
      //   .join('menu', 'menu.idx', 'order_detail.menu_idx')
      //   .join('time_slot', 'time_slot.idx', 'order_meta.time_slot')
      //   .select([
      //     "order_meta.idx",
      //     "user.nickname",
      //     "user_address.address",
      //     "user_address.address_detail",
      //     "menu.name_menu",
      //     "time_slot.time_str",
      //     knex('order_detail')
      //       .join('menu', 'order_detail.order_idx', 'menu.idx')
      //       .select(knex.raw('GROUP_CONCAT(menu.name_menu SEPARATOR ",") as menu_name)'))
      //       .where('order_detail.order_idx', 'order_meta.idx')
      //   ])
      //   .where('user_address.user_idx', 'order_meta.user_idx')
    },

    insertOrderDetail: (row) =>
      knex('order_detail')
        .insert(row),

    insertOrderDetailChangeLog: (row) =>
      knex('order_detail_change_log')
        .insert(row),

    insertOrderMetaChangeLog: (row) =>
      knex('order_meta_change_log')
        .insert(row),

    insertPointLog: (row) =>
      knex('point_change_log')
        .insert(row),

    getOrderDetailChangeLog: (userIdx) =>
      knex('order_detail_change_log')
      .where({
        user_idx: userIdx,
      })
      .select(),

    getOrderMetaChangeLog: (orderIdx) =>
      knex('order_meta_change_log')
      .where({
        order_idx: orderIdx,
      })
      .select(),

    /*
     * @param {Number} idx
     * @returns {Object} promise, with order on resolve.
     */
    getOrderMeta: (idx) =>
      knex('order_meta')
        .where({
          idx,
        })
        .select()
        .then(rows => rows[0]),

    getTimeSlots: () =>
      knex('time_slot')
        .where({
          available: 1,
        })
        .select([
          'idx',
          'time_slot',
        ])
        .then(rows => rows),

    /*
     * @param {Number} time_slot idx
     */
    getTimeSlot: (idx) =>
      knex('time_slot')
        .where({
          available: 1,
          idx,
        })
        .select([
          'time_slot',
        ])
        .then(rows => rows[0]),

    /*
     * @param {number} order idx
     */
    getOrderTimeSlot: (orderIdx) =>
      knex('time_slot')
        .join('order_meta', 'order_meta.time_slot', 'time_slot.idx')
        .whereRaw(`order_meta.idx = ${orderIdx}`)
        .select([
          'time_slot.idx',
          'time_slot.time_slot',
          'time_slot.time_str',
        ])
        .then(rows => rows[0]),

    /*
     * @param {number} address idx
     */
    getAddress: (idx) =>
      knex('user_address')
        .where({
          idx,
        })
        .select()
        .then(rows => rows[0]),

    /*
     * @param {number} address idx
     */
    getOrderAddress: (idx) =>
      knex('user_address')
        .join('order_meta', 'order_meta.address_idx', 'user_address.idx')
        .whereRaw(`order_meta.idx = ${idx}`)
        .select('user_address.*')
        .then((rows) => rows[0]),

    /*
     * @param {number} order idx
     */
    getOrderUser: (orderIdx) =>
      knex('user')
        .join('order_meta', 'order_meta.user_idx', 'user.idx')
        .whereRaw(`order_meta.idx = ${orderIdx}`)
        .select('user.*')
        .then(rows => rows[0]),

    getUser: (idx) =>
      knex('user')
        .where({
          idx,
        })
        .select('*')
        .then(rows => rows[0]),

    getUserByMobile: (mobile) =>
      knex('user')
        .where({
          mobile,
        })
        .select('*')
        .then(rows => rows[0]),

    /*
     * @param {number} userIdx
     * @param {string} address
     * @param {string} addressDetail
     * @returns {Object} promise, with created address's idx on resolve.
     */

    addNewAddress: (userIdx, address, addressDetail) =>
      knex('user_address')
        .insert({
          user_idx: userIdx,
          address,
          address_detail: addressDetail,
          in_use: 0,
          delivery_available: 1,
        })
        .then((idx) => idx),

    /*
     * @param {number} address idx
     * @param {string} jibunAddress
     * @param {string} roadNameAddress
     * @param {string} addressDetail
     * @param {number} latitude
     * @param {number} longitude
     * @param {bool} available
     */
    // TODO 위 param 더 채워넣기.
    updateAddress: ({
      idx,
      jibunAddress,
      roadNameAddress,
      addressDetail,
      latitude,
      longitude,
      available,
      }) =>
      knex('user_address')
        .where({
          idx,
        })
        .update({
          address: jibunAddress,
          road_name_address: roadNameAddress,
          address_detail: addressDetail,
          delivery_available: available,
          lat: latitude,
          lon: longitude,
        }),

    /*
     * @param {number} idx
     * @param {Object} key: column's camelCaseName, value: value
     */
    updateOrderMeta: (idx, options) =>
      knex('order_meta')
        .where({
          idx,
        })
        .update({
          // If a key to be updated has value undefined it is ignored.
          address_idx: options.addressIdx,
          time_slot: options.timeSlotIdx,
        }),

    updateOrderDetailAmount: (idx, amount) =>
      knex('order_detail')
        .where({
          idx,
        })
        .update({
          // If a key to be updated has value undefined it is ignored.
          amount,
        }),

    updateTotalPrice: (idx, totalPrice, pointUsed) =>
      knex('order_meta')
        .where({
          idx,
        })
        .update({
          total_price: totalPrice,
          point_used: pointUsed,
        }),

    /*
     * @param {number} orderIdx
     */
    getOrderDetails: (orderIdx) =>
      knex('order_detail')
        .where({
          order_idx: orderIdx,
        })
        .select(),

    /*
     * @param {number} orderIdx
     */
    getOrderMenus: (orderIdx) =>
      knex('order_detail')
        .join('menu', 'order_detail.menu_idx', 'menu.idx')
        .whereRaw(`order_detail.order_idx = ${orderIdx}`)
        .select([
          'order_detail.amount',
          'menu.*',
        ]),

    /*
     * @param {string} served date
     * @param {number} idx of menu
     * @param {number} quantity
     */
    rollbackOrderedMenu: (serveDate, idx, quantity, area) =>
      knex('menu_daily')
        .where({
          serve_date: serveDate,
          menu_idx: idx,
          area,
        })
        .decrement('ordered', quantity),

    /*
     * @param {number} idx of user
     * @param {number} point
     */
    refundPoint: (idx, point) =>
      knex('user')
        .where({
          idx,
        })
        .increment('point', point),

    /*
     * @param {number} idx of user
     * @param {number} coupon idx
     */
    refundCoupon: (userIdx, couponIdx) =>
      knex('coupon_txn')
        .where({
          user_idx: userIdx,
          coupon_idx: couponIdx,
        })
        .update({
          is_used: 0,
          use_date: null,
        }),

    /*
     * @param {number} idx of user
     */
    resetFirstOrderingStatus: (userIdx) =>
      knex('user')
        .where({
          idx: userIdx,
        })
        .update({
          purchased: 0,
        }),

    /*
     * @param {number} idx of user
     */
    deleteReferTemp: (orderIdx) =>
      knex('refer_temp')
        .where({
          order_idx: orderIdx,
        })
        .del(),

    /*
     * @param {number} idx of order
     */
    deleteOrderMeta: (idx) =>
      knex('order_meta')
        .where({
          idx,
        })
        .del(),

    /*
     * @param {number} idx of order
     */
    deleteOrderDetail: (idx) =>
      knex('order_detail')
        .where({
          idx,
        })
        .del(),

    /*
     * @param {number} phoneNumber
     */
    getAuthInfoWithPhoneNumber: (phoneNumber) =>
      knex
        .select()
        .from('sms_auth')
        .where({
          phone_number: phoneNumber,
        }),

    /*
     * @param {number} mobile
     */
    getUsersWhoHaveMobile: (mobile) =>
      knex('user')
        .select()
        .where({
          mobile,
        }),

    /*
     * @param {number} user idx
     * @param {number} mobile
     */
    setUserMobile: (idx, mobile) =>
      knex('user')
        .update({
          mobile,
        })
        .where({
          idx,
        }),

    getAddressesWithAddressDetail: (addressDetail) =>
      knex
        .select()
        .from('user_address')
        .where('address_detail', 'like', `%${addressDetail}%`),

    getMenuDaily: (serveDate, orderby, way = 'asc') =>
      knex('menu_daily')
        .select('menu.name_menu', 'menu.foodfly_name', 'menu_daily.*')
        .join('menu', 'menu.idx', 'menu_daily.menu_idx')
        .where({
          serve_date: serveDate,
        })
        .orderBy('menu_daily.area', 'asc')
        .orderBy(orderby, way),

    getMenuReadied: () =>
      knex('menu')
        .select('menu.*')
        .where({
          ready: 1,
        })
        .orderBy('menu.idx', 'asc'),

    updateMenuAmount: (serveDate, menuIdx, amount) =>
      knex('menu_daily')
        .where({
          serve_date: serveDate,
          menu_idx: menuIdx,
        })
        .update('ordered', amount),

    addMenuAmount: (serveDate, menuIdx, amount, area) =>
      knex('menu_daily')
        .where({
          serve_date: serveDate,
          menu_idx: menuIdx,
          area,
        })
        .increment('ordered', amount),

    getMenu: () =>
      knex
        .select([
          'idx',
          'name_menu',
          'alt_price',
          'ready',
        ])
        .from('menu'),

    getMenuStock: (serveDate, area) =>
      knex('menu_daily')
        .where({
          serve_date: serveDate,
          area,
        })
        .select(),

    getOrderMetaWithArea: (idx) =>
      knex.select('*')
        .from('order_meta')
        .join('user_address', 'order_meta.address_idx', 'user_address.idx')
        .whereRaw(`order_meta.idx = ${idx}`)
        .then(rows => rows[0]),

    increaseUserPoint: (userIdx, point) =>
      knex('user')
        .where({
          idx: userIdx,
        })
        .increment('point', point),

    decreaseUserPoint: (userIdx, point) =>
      knex('user')
        .where({
          idx: userIdx,
        })
        .decrement('point', point),
  };
}

const knex = require('knex')(config.database);

function getOrderInfo(orderIdx) {
  return knex.transaction((trx) => {
    const transactingFunctions = defaultFuntionsWithKnexObject(trx);
    const {
      getOrderMetaWithArea,
      getOrderDetails,
      } = transactingFunctions;

    return getOrderDetails(orderIdx)
      .then(details => {
        const detail = details;
        return getOrderMetaWithArea(orderIdx)
          .then(meta => {
            const results = {
              detail,
              meta,
            };
            return results;
          });
      });
  });
}

function givePointToUser(query) {
  return knex.transaction((trx) => {
    const {
      user_idx,
      point,
      } = query;
    const transactingFunctions = defaultFuntionsWithKnexObject(trx);
    return transactingFunctions.increaseUserPoint(user_idx, point)
      .then(() => (
        transactingFunctions.insertPointLog(query)
      ));
  });
}

function getAddressByOrderIdx(orderIdx) {
  return knex('user_address')
  .joinRaw('inner join order_meta on user_address.idx = order_meta.address_idx')
  .where('order_meta.idx', orderIdx)
  .select();
}

function getOrderMetaByOrderIdx(orderIdx) {
  return knex('order_meta')
  .where('idx', orderIdx)
  .select()
  .then(rows => rows[0])
  .then(data => data.idx);
}

/*
 * @param {number} idx of order
 * @param {string} address
 * @param {string} address detail
 */
function changeOrderAddress(orderIdx, address, addressDetail) {
  return knex.transaction((trx) => {
    const transactingFunctions = defaultFuntionsWithKnexObject(trx);

    return transactingFunctions.addNewAddress(address, addressDetail)
      .then(addressIdx => (
        transactingFunctions.updateOrderMeta(orderIdx, {
          addressIdx,
        })
      ));
  });
}

function getUserOrderLog(userIdx) {
  return knex.raw(`select distinct Detail.order_idx, Meta.user_idx, Meta.request_time, Meta.cancel_time, Detail.menu_idx, menu.name_menu, menu.price
from order_meta_change_log Meta JOIN (order_detail_change_log Detail JOIN menu ON Detail.menu_idx = menu.idx) ON Meta.order_idx = Detail.order_idx
where Meta.user_idx=${userIdx};`);
}

function getUserAddress(userIdx) {
  return knex('user_address')
  .where({
    'user_idx': userIdx,
    'delivery_available': 1
  })
  .select();

}

function saveAreaToTastingArea(object) {
  return knex('user_address')
  .insert(object);
}

function insertThirdPartyDelevieryLog(row) {
  return knex('third_party_delivery_log')
    .insert(row);
}

function updateOrder(
  orderIdx,
  shouldUpdateMenu,
  shouldInsertMenu,
  shouldDeleteMenu,
  totalPrice,
  pointDelta,
  pointUsed,
  date,
  area,
  userIdx
) {
  const transactingFunctions = defaultFuntionsWithKnexObject(knex);
  const {
    updateOrderDetailAmount,
    addMenuAmount,
    rollbackOrderedMenu,
    insertOrderDetail,
    deleteOrderDetail,
    updateTotalPrice,
    decreaseUserPoint,
    } = transactingFunctions;

  function updateMenu() {
    if (shouldUpdateMenu.length === 0) {
      return Promise.resolve();
    }
    return Promise.map(shouldUpdateMenu, dish => (
      updateOrderDetailAmount(dish.orderDetailIdx, dish.amount)
        .then(() => {
          return addMenuAmount(date, dish.menuIdx, dish.delta, area);
        })
    ));
  }

  function insertMenu() {
    if (shouldInsertMenu.length === 0) {
      return Promise.resolve();
    }
    return Promise.map(shouldInsertMenu, dish => {
      const row = {
        order_idx: orderIdx,
        menu_idx: dish.menuIdx,
        amount: dish.amount,
      };
      return insertOrderDetail(row)
        .then(() => {
          return addMenuAmount(date, row.menu_idx, row.amount, area);
        });
    });
  }

  function deleteMenu() {
    if (shouldDeleteMenu.length === 0) {
      return Promise.resolve();
    }
    return Promise.map(shouldDeleteMenu, (dish) => {
      return deleteOrderDetail(dish.orderDetailIdx)
        .then(() => {
          return rollbackOrderedMenu(date, dish.menuIdx, dish.amount, area);
        });
    });
  }

  return updateTotalPrice(orderIdx, totalPrice, pointUsed)
    .then(updateMenu)
    .then(insertMenu)
    .then(deleteMenu)
    .then(() => (decreaseUserPoint(userIdx, pointDelta)));
}

function getUserIdxByCode(userCode) {
  return knex('user')
  .where({
    'user_code': userCode
  })
  .select();
}

function goodbyeUser(userIdx) {
  // const transactingFunctions = defaultFuntionsWithKnexObject(knex);
  return knex.transaction(trx => {
    return knex('user')
    .transacting(trx)
    .where({
      idx: userIdx,
    })
    .select()
    .then(row => row[0])
    .then(user => knex('deleted_user').insert(user)
      .then(resp => knex('user').where({ idx: userIdx }).del()
      .then(trx.commit()))
    );
  })
  .then(() => '삭제가 완료되었습니다.')
  .catch(e => trx.rollback());
}

function getRecommendedList(userCode) {
  return knex('user')
  .where({
    'user_code': userCode,
  })
  .select()
  .then(row => row[0])
  .then(data => data.idx)
  .then(userIdx => {
    return knex('user')
    .where({
      'ref_user_idx': userIdx,
    })
    .select()
    .then(row => {

      let message = `해당 추천인 코드는 ${userIdx}님의 것입니다   \n`;
      // return getRecommenedUserPaidPoint(userIdx);
      row.map(item => {
        if (item.purchased === 0) {
          message += `${item.idx}인 분은 아직 결제를 안하셨어여 \n`;
        } else {
          message += `${item.idx}인 분은 결제하셨어여 \n`;
        }
      });

      return message;
    })
    .then(resultMessage => {
      return getRecommenedUserPaidPoint(userIdx)
      .then(paid => {
        let isPaidMessage = '';

        paid.map(item => {
          if (item.rewarded === 'REWARDED') {
            isPaidMessage += `${item.user_idx}님은 포인트가 지급됬어여`;
          } else {
            isPaidMessage  += `${item.user_idx}님은 포인트가 지급안됬어여`;
          }
        });

        resultMessage += ' ' + isPaidMessage;

        return resultMessage;
      });
    });
  });
}

function getRecommenedUserPaidPoint(userIdx) {
  return knex('refer_temp')
  .where({
    'ref_user_idx': userIdx,
  })
  .select()
  .then(row => row);
}

function deleteUserCardInfo(userIdx) {
  return knex.transaction(trx => {
    return knex('user_card')
    .transacting(trx)
    .where({
      'user_idx': userIdx,
    })
    .select()
    .then(row => row[0])
    .then(userCard => console.log(userCard));
  });
}

function putCurrentPoint(userIdx, point) {
  return knex('user')
  .where({
    idx: userIdx,
  })
  .update({
    point,
  });
}

/*
 * 주문을 취소하는 메소드
 * 흐름도는 다음의 url에서 참고하실 수 있습니다.
 * http://www.gliffy.com/go/publish/10259463
 */
function cancelOrder(orderIdx) {
  return knex.transaction((trx) => {
    const transactingFunctions = defaultFuntionsWithKnexObject(trx);
    const {
      getOrderMetaWithArea,
      getOrderDetails,
      rollbackOrderedMenu,
      refundPoint,
      refundCoupon,
      resetFirstOrderingStatus,
      insertOrderDetailChangeLog,
      insertOrderMetaChangeLog,
      deleteReferTemp,
      deleteOrderMeta,
      deleteOrderDetail,
      } = transactingFunctions;

    return getOrderMetaWithArea(orderIdx)
      .then(orderMeta => {
        const userIdx = orderMeta.user_idx;
        const payMethod = parseInt(orderMeta.pay_method, 10);
        const point = orderMeta.point_used;
        const couponIdx = orderMeta.coupon_idx;
        const totalPrice = orderMeta.total_price;
        const area = orderMeta.area;
        const isFirstOrder = (parseInt(orderMeta.purchased, 10) === 0);
        const serveDate = moment(orderMeta.request_time).format('YYYY-MM-DD');

        //  결제 수단이 온라인 카드인가 ?
        if (payMethod === 1) {
          console.log(`${moment.tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss')}
          카드 취소 - user idx : ${userIdx} - 가격 -  ${totalPrice}`);
        }

        // status가 1일 경우 삭제를 의미한다.
        return transactingFunctions.insertOrderMetaChangeLog({
          order_idx: orderIdx,
          user_idx: userIdx,
          address_idx: orderMeta.address_idx,
          mobile: orderMeta.mobile,
          status: 1,
          admin_status: orderMeta.admin_status,
          paid: orderMeta.paid,
          total_price: orderMeta.total_price,
          time_slot: orderMeta.time_slot,
          coupon_idx: couponIdx,
          credit_used: orderMeta.credit_used,
          point_used: orderMeta.point_used,
          pay_method: orderMeta.pay_method,
          purchased: orderMeta.purchased,
          include_cutlery: orderMeta.include_cutlery,
          review: orderMeta.review,
          request_time: orderMeta.request_time,
        })
          .then(res => getOrderDetails(orderIdx).map(orderDetail => {
            return rollbackOrderedMenu(serveDate, orderDetail.menu_idx, orderDetail.amount, area)
              .then(() => insertOrderDetailChangeLog({
                order_idx: orderDetail.order_idx,
                menu_idx: orderDetail.menu_idx,
                amount: orderDetail.amount,
                rating: orderDetail.rating,
                comment: orderDetail.comment,
                best_review: orderDetail.best_review,
                rated_time: moment(orderMeta.rated_time).format('YYYY-MM-DD')
              }))
              .then(() => deleteOrderDetail(orderDetail.idx));
          })
            .then(() => {
              if (point > 0) {
                return refundPoint(userIdx, point);
              }
              return Promise.resolve()
            })
            .then(() => {
              if (couponIdx > 0) {
                return refundCoupon(userIdx, couponIdx);
              }
              return Promise.resolve();
            })
            .then(() => {
              if (isFirstOrder) {
                return resetFirstOrderingStatus(userIdx)
                  .then(() => deleteReferTemp(orderIdx));
              }
              return Promise.resolve();
            })
            .then(() => deleteOrderMeta(orderIdx)));
      });
  });
}


/*
 * served_date 가 특정 구간 안에 있는 daily_menu 불러오기
 */

function getMenuDailyInPeriod(beginServeDate, endServeDate) {
  return knex('menu_daily')
    .select('*')
    .whereBetween('serve_date', [beginServeDate, endServeDate]);
}

/*
 * 메뉴 데일리 테이블에서 생산량이나 주문량을 변겯한다
 * 가져 온 데이터에 인자로 온 수를 더하여 업데이트 한다.
 */

function addMenuDaily(menuIdx, area, type, value, date) {
  return knex('menu_daily')
    .where({
      'menu_idx' : menuIdx,
      'area' : area,
      'serve_date' : date
    })
    .select(type)
    .then(row => {
      return row[0][type];
    })
    .then((originalValue) => {
      const updateRow = {};
      updateRow[type] = parseInt(originalValue) + parseInt(value);

      return knex('menu_daily')
        .where({
          'menu_idx': menuIdx,
          'area': area,
          'serve_date': date
        })
        .update(updateRow)
        .then(() => Promise.resolve());
    });
}

function addDailyMenu(menuIdx, area, serve_date, stock) {
  return knex('menu_daily')
    .where({
      'menu_idx' : menuIdx,
      'area' : area,
      'serve_date' : serve_date,
    })
    .select('*')
    .then(row => {

      if(row.length === 0) { // not exists : insert
        return knex('menu_daily')
          .insert({
            serve_date: serve_date,
            menu_idx: menuIdx,
            stock: stock,
            ordered: 0,
            is_event: 0,
            is_new: 0,
            area: area,
            priority: 0,
          })
          .then(() => Promise.resolve());
      }
      else { // update
        return knex('menu_daily')
          .where({
            'menu_idx': menuIdx,
            'area': area,
            'serve_date': serve_date
          })
          .update({stock: stock})
          .then(() => Promise.resolve());
      }
      return Promise.resolve();
    });
}

/*
 * 메뉴 데일리 테이블에서 menuidx 값을 참조한다.
 * 같은 메뉴는 하나의 priority를 같는 것으로 개발하였다.
 */

function updateMenuDailyPriority(menuIdx, newPriority, date) {
  return knex('menu_daily')
    .where({
      'menu_idx': menuIdx,
      'serve_date': date,
    })
    .update({priority: newPriority})
    .then(() => Promise.resolve());
}

/*
 * MenuDaily에 존재하는 모든 지역 리스트를 가져온다.
 */

function getAreaList() {
  return knex('menu_daily')
    .select('menu_daily.area')
    .groupBy('menu_daily.area');
}

/*
 * MenuDaily에서 B2B관련 속성을 컨트롤한다.
 */

function menuDailySetFeatured(idx, isB2BFeatured) {
  console.log(idx, isB2BFeatured);
  return knex('menu_daily')
    .where({
      'idx': idx,
    })
    .update({ is_b2b_featured: isB2BFeatured });
}

module.exports = Object.assign({
  cancelOrder,
  changeOrderAddress,
  getOrderInfo,
  updateOrder,
  insertThirdPartyDelevieryLog,
  givePointToUser,
  getUserOrderLog,
  saveAreaToTastingArea,
  getUserAddress,
  getAddressByOrderIdx,
  getOrderMetaByOrderIdx,
  getMenuDailyInPeriod,
  addMenuDaily,
  updateMenuDailyPriority,
  getAreaList,
  addDailyMenu,
  goodbyeUser,
  getUserIdxByCode,
  getRecommendedList,
  deleteUserCardInfo,
  putCurrentPoint,
  menuDailySetFeatured,
}, defaultFuntionsWithKnexObject(knex));