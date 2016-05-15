'use strict';

var authHelper = require('cn-auth-helper');
var Errors = require('./errors');

/**
* Returns a middleware function for authentication
* @param {String} Secret key for decoding the token
* @returns {Function} an express middleware
*/
var getAuthMiddleware = function (secret) {
  return function (req, res, next) {

    if (!(req.headers && req.headers.authorization)) {
      return res.status(401).send(Errors.NO_HEADER_FOUND);
    }

    var result = authHelper.isAuthenticated(req.headers.authorization, secret);

    if (!result.isSuccess) {
      return res.status(401).send(result.error);
    }

    req.authToken = result.payload;
    next();
  };
};

module.exports  = {
  getAuthMiddleware: getAuthMiddleware,
  Errors: Errors,
};
