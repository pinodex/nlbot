/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

function File (name, url) {
  this._name = name;
  this._url = url;
};

File.prototype.setName = function (name) {
  this._name = name;
}

File.prototype.getName = function () {
  return this._name;
};

File.prototype.setUrl = function (url) {
  this._url = url;
};

File.prototype.getUrl = function () {
  return this._url;
};

module.exports = File;