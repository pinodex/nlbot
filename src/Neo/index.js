/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

var async = require('async');
var colors = require('colors');
var cheerio = require('cheerio');
var keypress = require('keypress');

var Prompts = require('../Prompts');
var Class = require('../modules/Class');
var Lesson = require('../modules/Lesson');
var File = require('../modules/File');

var session = null;

var Neo = {
  urls: require('./urls'),
  classes: [/**/],
  classesString: ''
};

Neo.setSession = function (sessionObject) {
  session = sessionObject;
};

Neo.init = function () {
  async.series([
    function (callback) {
      Prompts.print(colors.gray, 'Loading class list');
      Prompts.loadingAnimation(true);

      session.getPage(Neo.urls.student_dashboard_enrolled, function(err, res, body) {
        var $ = cheerio.load(body);
        var classes = [];
        
        $('h2.class_name').each(function (i, el) {
          var classEl = $(this);
          var _class = new Class(classEl.text());

          _class.setUrl(classEl.find('a').attr('href'));
          classes.push(_class);
        });

        callback(null, classes);
      });
    }
  ],

  function (err, results) {
    Prompts.loadingAnimation(false);

    Neo.classes = results[0];

    for (var i = 0; i < Neo.classes.length; i++) {
      Neo.classesString += '    [' + i + '] ' + Neo.classes[i].getName() + '\n';
    }

    Neo.askClass();
  });
};

Neo.askClass = function () {
  Prompts.clear().println(colors.bold.bgWhite.black, '    CLASS LIST \n');
  Prompts.println(colors.white, Neo.classesString);
  
  Prompts.ask('ask_class', function (err, result) {
    if (!result) {
      return;
    }

    if (result.confirm.toLowerCase() == 'y') {
      if (result.classNumber < 0 || result.classNumber > Neo.classes.length - 1) {
        Prompts.println(colors.bold.bgRed.white, 'Invalid class number. Please try again.');

        setTimeout(function () {
          Neo.askClass();
        }, 2000);

        return;
      }

      return Neo.loadLessons(Neo.classes[result.classNumber], result.classNumber);
    }

    Neo.askClass();
  });
};

Neo.loadLessons = function (_class, classIndex) {
  async.series([
    function (callback) {
      if (_class.getLessons().length > 0) {
        return callback(null, null);
      }

      Prompts.clear().print(colors.gray, 'Loading lessons from "' + _class.getName() + '"');
      Prompts.loadingAnimation(true);

      session.getPage(_class.getUrl(), function(err, res, body) {
        var $ = cheerio.load(body);
        
        $('tr.lesson td a').each(function (i, el) {
          var lessonEl = $(this);
          var lessonName = lessonEl.text().trim();

          if (lessonName.length == 0) {
            return true;
          }

          var lesson = new Lesson(lessonName);

          lesson.setUrl(lessonEl.attr('href'));
          _class.addLesson(lesson);
        });

        Neo.classes[classIndex] = _class;
        callback(null, null);
      });
    }
  ],

  function (err, results) {
    Prompts.loadingAnimation(false);

    Prompts.clear();
    Prompts.println(_class.getLessons().length + ' lessons loaded from "' + _class.getName() + '"');
    Prompts.println(colors.gray, [
      'The app will now browse each lesson in this class.',
      'This might take time depending on your internet connection.',
      'Please ensure a stable internet connection to avoid interruptions.\n'
    ].join('\n'));

    Prompts.ask('confirm_browse', function (err, result) {
      if (!result) {
        return;
      }

      if (result.confirm.toLowerCase() == 'y') {
        return Neo.browseClass(Neo.classes[classIndex], classIndex);
      }

      Neo.askClass();
    });
  });
};

Neo.browseClass = function (_class, classIndex) {
  var tasks = [];
  var _lessons = _class.getLessons();

  Prompts.clear();
  Prompts.println(colors.gray, 'Process started. Input ' + colors.bgRed.white('^C') + ' to terminate.');
  Prompts.println(
    colors.bgCyan.white(' CLASS ') + colors.bold.bgWhite.blue(' ' + _class.getName() + ' ') + '\n'
  );

  var done = function () {
    Neo.browseFiles(_class);
  };

  (function next (i) {
    if (i == _lessons.length) {
      Neo.classes[classIndex] = _class;

      return done();
    }

    Prompts.print('Preparing files for "' + _lessons[i].getName() + '"');
    Prompts.loadingAnimation(true);

    session.getPage(_lessons[i].getUrl(), function(err, res, body) {
      var $ = cheerio.load(body);
      var files = $('div.materialStyle p a');
        
      files.each(function (elI, el) {
        var fileEl = $(this);

        _lessons[i].addFile(new File(
          fileEl.text(),
          fileEl.attr('href')
        ));
      });

      Prompts.loadingAnimation(false);
      Prompts.clearLine();
      Prompts.println(colors.gray, files.length + ' file(s) found for "' + _lessons[i].getName() + '"');
        
      _class.setLessons(_lessons);
      next(i + 1);
    });
  })(0);
};

Neo.browseFiles = function (_class) {
  (function next (i) {
    if (i == _class.getLessons().length) {
      Prompts.clear().ask('try_another', function (err, result) {
        if (!result) {
          return;
        }

        if (result.confirm.toLowerCase() == 'y') {
          return Neo.askClass();
        }

        Prompts.println(colors.bold.red, 'Bye!');
      });

      return;
    }

    var lesson = _class.getLesson(i);
    var files = lesson.getFiles();

    Prompts.clear();
    Prompts.println(colors.gray, 'Process started. Input ' + colors.bgRed.white('^C') + ' to terminate.');
    Prompts.println(
      colors.bgCyan.white(' CLASS ') + colors.bold.bgWhite.blue(' ' + _class.getName() + ' ') + '\n'
    );

    Prompts.println('Browsing files for "' + lesson.getName() + '"...\n');

    (function nextB (x) {
      if (x == files.length) {
        return next(i + 1);
      }

      var file = files[x];
      var fileName = colors.bgMagenta.white(' ' + file.getName() + ' ');
      
      Prompts.progressBar((x / files.length) * 100, fileName, x == 0);

      session.getPage(file.getUrl(), function (err, res, body) {
        x++;

        Prompts.progressBar((x / files.length) * 100, fileName);

        setTimeout(function () {
          nextB(x);
        }, 1000);
      });
    })(0);
  })(0);
};

module.exports = Neo;