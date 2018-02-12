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
  router.get('/', _.partial(urlCtrl.getUrlCode));
  router.get('/test', _.partial(urlCtrl.getUrlTestCode));
  router.get('/upload', _.partial(urlCtrl.prepareUrlUpload));
  router.get('/file/latest', _.partial(urlCtrl.getLatestUrlUpload));
  router.post('/upload', _.partial(urlCtrl.handleUrlUpload));

  router.post('/new', _.partial(urlCtrl.createUrl));
  
  return router;
}

module.exports = route;
