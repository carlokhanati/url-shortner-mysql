const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('../utils/jwt').jwtMiddleware;
const validate = require('express-validation');

validate.options({
  status: 400,
  statusText: '',
  allowUnknownBody: false,
  contextRequest: true,
});

const DefaultRouter = function () {
  const router = new express.Router({ mergeParams: true });
  router.use(cors());
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json({ limit: '5mb' }));
  router.use(express.static('./static'));
  router.use(auth);

  return router;
};

module.exports = DefaultRouter;
