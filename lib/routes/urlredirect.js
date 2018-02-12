'use strict';

const _ = require('underscore');
const validate = require('express-validation');
const urlCtrl = require('../controllers/url/urlCtrl');

validate.options({
  status: 400,
  statusText: '',
  allowUnknownBody: false,
  allowUnknownQuery: false
});

function route(router) {
  router.get('/:short', _.partial(urlCtrl.getUrl));
  return router;
}

module.exports = route;
