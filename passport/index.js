'use strict';
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const config = require('getconfig');


passport.serializeUser((profile, done) => {
  done(null, profile);
});

passport.deserializeUser((profile, done) => {
  done(null, profile);
});

// =========================================================================
// FACEBOOK ================================================================
// =========================================================================
const facebookStrategyConfig = {
  clientID: config.facebookAuth.clientID,
  clientSecret: config.facebookAuth.clientSecret,
  callbackURL: config.facebookAuth.callbackURL,
};
const facebookStrategy = new FacebookStrategy(facebookStrategyConfig,
  (token, refreshToken, profile, done) => done(null, profile)
);
passport.use(facebookStrategy);

module.exports = passport;
