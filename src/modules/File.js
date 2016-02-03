/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

function File (name, lessonName, url) {
  this._name = name;
  this._lessonName = lessonName;
  this._url = url;
};

File.prototype.setName = function (name) {
  this._name = name;
}

File.prototype.getName = function () {
  return this._name;
};

File.prototype.setLessonName = function (lessonName) {
  this._lessonName = lessonName;
}

File.prototype.getLessonName = function () {
  return this._lessonName;
};

File.prototype.setUrl = function (url) {
  this._url = url;
};

File.prototype.getUrl = function () {
  return this._url;
};

module.exports = File;