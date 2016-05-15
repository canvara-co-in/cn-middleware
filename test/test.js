var cnMiddlewares = require('../src');
var Errors = require('../src/errors');
var authHelper = require('cn-auth-helper');

var expect = require('chai').expect;
var should = require('chai').should();

var SECRET = 'SECRET';
var token = 'Bearer ' + authHelper.encodeToken(
  { user: 'user', roles: ['admin', 'staff'] }, SECRET);

// Poor man's mock of express request and response
var req = { headers: { authorization: token } };
var invalidReq = { headers: { authorization: '' } };
var createResponse = function (expectedError) {
  return {
    status: function (code) {
      expect(code).to.equal(401);
      return this;
    },

    send: function (message) {
      if (expectedError) {
        expect(message.code).to.equal(expectedError);
        expect(message).to.be.a('object');
      }

      return this;
    },
  };
};

var next = function () {};

describe('Middlewares', function () {
  describe('all', function () {

    it('Should return a function', function () {
      var authMW = cnMiddlewares.getAuthMiddleware(SECRET);
      expect(authMW).to.be.a('function');
    });

    it('Should decode a proper header', function (done) {
      var authMW = cnMiddlewares.getAuthMiddleware(SECRET);

      expect(authMW).to.be.a('function');
      authMW(req, createResponse(), next);
      done();
    });

    it('Should send 401 for improper header', function (done) {
      var authMW = cnMiddlewares.getAuthMiddleware(SECRET);
      expect(authMW).to.be.a('function');
      authMW({}, createResponse(Errors.NO_HEADER_FOUND.code), next);
      done();
    });

    it('Should send 401 for improper secret', function (done) {
      var authMW = cnMiddlewares.getAuthMiddleware('INVALID_SECRET');
      expect(authMW).to.be.a('function');
      authMW({ headers:{ authorization: invalidReq } },
        createResponse(authHelper.Errors.INVALID_TOKEN.code), next);
      done();
    });
  });
});
