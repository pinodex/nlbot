/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

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
  (function run () {
    Prompts.print(colors.gray, 'Loading class list');
    Prompts.loadingAnimation(true);

    session.getPage(Neo.urls.student_dashboard_enrolled, function(err, res, body) {
      Prompts.loadingAnimation(false);

      if (err || res.statusCode != 200) {
        Prompts.clear().println(colors.bgRed.white, 'An error occurred.');
        process.exit(1);

        return;
      }

      var $ = cheerio.load(body);
      var classes = [];
        
      $('h2.class_name').each(function (i, el) {
        var classEl = $(this);
        var _class = new Class(classEl.text());

        _class.setUrl(classEl.find('a').attr('href'));
        classes.push(_class);
      });

      done(classes);
    });
  })();

  function done (classes) {
    Neo.classes = classes;

    for (var i = 0; i < Neo.classes.length; i++) {
      Neo.classesString += '    [' + i + '] ' + Neo.classes[i].getName() + '\n';
    }

    Neo.askClass();
  }
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
  (function run () {
    if (_class.getLessons().length > 0) {
      return done();
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
      
      done();
    });
  })();

  function done () {
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
  }
};

Neo.browseClass = function (_class, classIndex) {
  var _files = [];
  var _lessons = _class.getLessons();

  function init () {
    Prompts.clear();
    Prompts.println(colors.gray, 'Process started. Input ' + colors.bgRed.white('^C') + ' to terminate.');
    Prompts.println(
      colors.bgCyan.white(' CLASS ') + colors.bold.bgWhite.blue(' ' + _class.getName() + ' ') + '\n'
    );
  }

  init();

  (function next (i) {
    if (i == _lessons.length) {
      Neo.classes[classIndex] = _class;

      return done();
    }

    Prompts.print('Preparing files for "' + _lessons[i].getName() + '"');
    Prompts.loadingAnimation(true);

    session.getPage(_lessons[i].getUrl(), function(err, res, body) {
      var $ = cheerio.load(body);
      var fileElements = $('div.materialStyle p a');
        
      fileElements.each(function (elI, el) {
        var singleFileElement = $(this);

        _files.push(new File(
          singleFileElement.text(), _lessons[i].getName(), singleFileElement.attr('href')
        ));
      });

      Prompts.loadingAnimation(false);
      Prompts.clearLine();
      
      Prompts.println(colors.gray, 
        fileElements.length + ' file(s) found for "' + _lessons[i].getName() + '"'
      );

      next(i + 1);
    });
  })(0);

  function done () {
    init();
    
    Neo.browseFiles(_files);
  }
};

Neo.browseFiles = function (files) {
  (function next (i) {
    if (i == files.length) {
      setTimeout(done, 2000);
      return;
    }
    
    var file = files[i];
    var fileName = colors.bgMagenta.white(' ' + file.getName() + ' ');
    var description = 'Browsing files for "' + file.getLessonName() + '"...\n\n' + fileName;
    
    Prompts.progressBar(i, files.length, description, i == 0);

    session.getPage(file.getUrl(), function (err, res, body) {
      i++;

      Prompts.progressBar(i, files.length, description);
      next(i);
    });
  })(0);

  function done () {
    Prompts.clear().ask('try_another', function (err, result) {
      if (result.confirm.toLowerCase() == 'y') {
        return Neo.askClass();
      }

      Prompts.println(colors.bold.red, 'Bye!');
      Prompts.println('Exiting in 5 seconds...');
      
      Prompts.exitIn(5000);
    });
  }
};

module.exports = Neo;