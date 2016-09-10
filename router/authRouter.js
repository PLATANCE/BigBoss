const express = require('express');
const passport = require('../passport');

const router = express.Router();

// =====================================
// FACEBOOK ROUTES =====================
// =====================================
// route for facebook authentication and login
router.get('/facebook', passport.authenticate('facebook'));
router.get('/login', (req, res) => (
  res.send('<a href="auth/facebook">login</a>')
));


// handle the callback after facebook has authenticated the user
router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
  }), (req, res) => {
    let redirectURL = '/';
    if (req.session.returnTo) {
      redirectURL = req.session.returnTo;
    }
    res.redirect(redirectURL);
  }
);

module.exports = router;
