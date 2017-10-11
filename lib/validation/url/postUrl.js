'use strict';

const Joi = require('joi');

module.exports = {
  body: {
    url_code: Joi.string().alphanum().required()
  }
};
