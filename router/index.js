'use strict';
const authRouter = require('./authRouter');
const express = require('express');
const request = require('request');
const config = require('getconfig');

const router = express.Router();

// 인증 필요하지 않은 Router
router.use('/auth', authRouter);

/*
 * 이 아래로는 인증이 필요한 Router들.
 * use 함수 안에 isLoggedIn 를 넣는다.
 */

function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next();
  }
  // if they aren't redirect them to the home page
  const {
    session,
  } = req;
  session.returnTo = req.originalUrl;
  return res.redirect('/auth/facebook');
}

const internalServiceNames = config.internalServiceNames;
internalServiceNames.forEach(serviceName => {
  router.use(`/${serviceName}`, isLoggedIn, require(`../internalServices/${serviceName}/router`));
});

const subServers = config.subServers;
subServers.forEach(subServer => {
  const {
    path,
    serverURL,
  } = subServer;
  router.use(`/${path}/*`, isLoggedIn, (req, res) => {
    const relativeUrl = req.originalUrl.substring(path.length + 1);
    return req.pipe(request(`${serverURL}${relativeUrl}`)).pipe(res);
  });
});


// default
router.get('*', isLoggedIn, (req, res) => {
  res.render('index.html');
});



module.exports = router;
