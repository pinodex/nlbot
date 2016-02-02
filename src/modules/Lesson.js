/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

function Lesson (name) {
  this._name = name;
  this._url = null;
  this._files = [];
};

Lesson.prototype.setName = function (name) {
  this._name = name;
}

Lesson.prototype.getName = function () {
  return this._name;
};

Lesson.prototype.setUrl = function (url) {
  this._url = url;
};

Lesson.prototype.getUrl = function () {
  return this._url;
};

Lesson.prototype.addFile = function (file) {
  this._files.push(file);
};

Lesson.prototype.getFiles = function () {
  return this._files;
};

Lesson.prototype.getFile = function (i) {
  return this._files[i];
}

module.exports = Lesson;