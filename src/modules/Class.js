/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

function Class (name) {
  this._name = name;
  this._url = null;
  this._lessons = [];
};

Class.prototype.setName = function (name) {
  this._name = name;
}

Class.prototype.getName = function () {
  return this._name;
};

Class.prototype.setUrl = function (url) {
  this._url = url;
};

Class.prototype.getUrl = function () {
  return this._url;
};

Class.prototype.addLesson = function (lesson) {
  this._lessons.push(lesson);
};

Class.prototype.setLessons = function (lessons) {
  this._lessons = lessons;
}

Class.prototype.getLessons = function () {
  return this._lessons;
};

Class.prototype.getLesson = function (i) {
  return this._lessons[i];
};

module.exports = Class;