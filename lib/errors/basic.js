// Server errors.
const logger = require('../../lib/utils/logger').Logger;

const BasicErrorResponse = function (err, req, res, next) {
  res.status(err.status || 500).send(err.message);
  next(err);
};

const ErrorDiscreteResponse = function (err, req, res) {
  res.status(err.status || 500).send(err.message || '');
};

// Catch-All errors.
const LoginError = function (err, req, res, next) {
  logger.error(`${err}`); // we identify our self in the network and log.
  logger.error(`Error (stacktrace) >${err.stack}`); // using wiston.js or another logger API.
  next(err);
};

module.exports = {
  discrete: ErrorDiscreteResponse,
  basic: BasicErrorResponse,
  log: LoginError
};
