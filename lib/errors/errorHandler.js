'use strict';

// Mapping function handler.
const Handler = function (errorList) {
  return function (app) {
    for (const i in errorList) {
      if ({}.hasOwnProperty.call(errorList, i)) {
        app.use(errorList[i]);
      }
    }
    return app;
  };
};

module.exports = Handler;
