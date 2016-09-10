'use strict';

const ExtendableError = require('./ExtendableError');

class ExpressError extends ExtendableError {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

module.exports = ExpressError;
