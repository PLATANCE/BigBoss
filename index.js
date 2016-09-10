const express = require('express');
const passport = require('./passport');
const morgan = require('morgan');
const session = require('express-session');
const config = require('getconfig');
const routes = require('./router');
const path = require('path');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const ExpressError = require('./error/ExpressError');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; // for foodfly https error.

const app = express();

app.use(morgan('common', {
  skip: (req) => ((req.originalUrl === '/health') || (req.url === '/health')),
}));
app.engine('html', ejs.renderFile);
app.set('views', path.join(__dirname, 'public'));

// required for passport
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.json()); // for parsing application/json

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use((req, res, next) => {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return express.static(path.join(__dirname, 'public'))(req, res, next);
  }
  return next();
});

// routes ======================================================================

app.get('/health', (req, res) => {
  res.send(new Buffer(JSON.stringify({
    pid: process.pid,
    memory: process.memoryUsage(),
    uptime: process.uptime(),
  })));
});

app.use(routes);

// Error Handling ==============================================================

app.use((err, req, res, next) => {
  if (err instanceof ExpressError) {
    return res.status(err.status).json(err.message);
  }
  console.error(err.stack);
  return res.status(500).send('Something broke!');
});

// launch ======================================================================
const port = process.env.NODE_ENV === 'production'
  ? process.env.PORT || 8080
  : process.env.PORT || 7777;

app.listen(port, () => console.log(`The magic happens on port ${port}`));
