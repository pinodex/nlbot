/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

var querystring = require('querystring');
var request = require('request');
var Neo = require('../Neo');

function Session (result) {
  if (result) {
    this._host = result.host;
    this._credentials = {
      userid: result.userid,
      password: result.password
    }
  }

  this._req = request.defaults({
    jar: request.jar()
  });
};

Session.prototype.setHost = function (host) {
  this._host = host;
};

Session.prototype.getHost = function() {
  return this._host;
}

Session.prototype.setCredentials = function (credentials) {
  this.credentials = credentials;
};

Session.prototype.getCredentials = function () {
  return this._credentials;
}

Session.prototype.login = function (callback) {
  var data = {}
  
  data.uri = this._host + Neo.urls.login_form_submit;
  data.body = querystring.stringify(this._credentials);

  this._req.post(data, callback);
};

Session.prototype.getPage = function (url, callback) {
  this._req(this._host + url, callback);
};

module.exports = Session;