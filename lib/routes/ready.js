'use strict';

function ready(router) {
  router.get('/', (req, res) => {
    res.statusCode = 200;
    res.send(getStatus());
    res.end();
  });

  return router;
}

function getStatus() {
  const status = {};
  status.response = 'OK';
  return status;
}

module.exports = {
  ready,
  getStatus,
};
