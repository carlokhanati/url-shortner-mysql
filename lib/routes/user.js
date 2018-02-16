'use strict';

const _ = require('underscore');
const validate = require('express-validation');

const userCtrl = require('../controllers/user/userCtrl');

validate.options({
  status: 400,
  statusText: '',
  allowUnknownBody: false,
  allowUnknownQuery: false
});

function route(router) {
  router.get('/', _.partial(userCtrl.getUsers));
  router.post('/', _.partial(userCtrl.addUser));
  router.get('/:UserName', _.partial(userCtrl.getUser));
  router.put('/:UserName', _.partial(userCtrl.updateUser));
  router.delete('/:UserName', _.partial(userCtrl.deleteUser));
  router.put('/:UserName/updatepassword', _.partial(userCtrl.updatePassword));

  return router;
}

module.exports = route;
