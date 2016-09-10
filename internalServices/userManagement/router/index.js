const express = require('express');
const router = express.Router();
const seoulMoment = require('../../../seoulMoment');
const database = require('../../../database');

router.delete('/', (req, res) => {
  const {
    userIdx,
  } = req.body;

  return database.goodbyeUser(userIdx)
  .then(result => res.send({ 'message': `유저 번호가 ${userIdx}인 분이 ${result}` }));

});

router.get('/:userCode', (req, res) => {
  const {
    userCode,
  } = req.params;

  return database.getUserIdxByCode(userCode)
  .then(row => row[0])
  .then(data => res.send({ 'message': `코드가 ${userCode}이신 분의 유저 번호는 ${data.idx} 입니당` }));
});

router.get('/recommend/:userCode', (req, res) => {
  const {
    userCode,
  } = req.params;

  return database.getRecommendedList(userCode)
  .then(message => res.send({ message }));

});

router.get('/userCard/:userIdx', (req, res) => {
  const {
    userIdx,
  } = req.params;

  // return database.deleteUserCardInfo(userIdx);
});

router.put('/point', (req, res) => {
  const {
    userIdx,
    point,
  } = req.body;

  return database.decreaseUserPoint(userIdx, point)
  .then(() => res.send({ 'message': `${userIdx}의 포인트를 ${point}만큼 차감하였습니다.` }))
  .catch(e => res.send({ 'errorMessage': e }));
});

module.exports = router;
