'use strict';

const _ = require('underscore');
const validate = require('express-validation');
const urlCtrl = require('../controllers/url/urlCtrl');
const userCtrl = require('../controllers/user/userCtrl');

validate.options({
  status: 400,
  statusText: '',
  allowUnknownBody: false,
  allowUnknownQuery: false
});

function route(router) {
  router.get('/:short', _.partial(urlCtrl.getUrl));
  router.post('/authenticate', _.partial(userCtrl.authenticateUser));
  return router;
}

module.exports = route;
