/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

//'use strict';

var colors = require('colors');
var prompt = require('prompt');

var Prompts = {};
var questions = {};
var welcomeBanner = [
  "                           ____         ______                  ",
  "  |..          | |        |    ~.     .~      ~.  `````|`````   ",
  "  |  ``..      | |        |____.'_   |          |      |        ",
  "  |      ``..  | |        |       ~. |          |      |        ",
  "  |          ``| |_______ |_______.'  `.______.'       |        ",
  "                                                                ",
  "                 Lazy-read Lessons From Your LMS                ",
  "                                                                "
];

var loadingAnimationInterval = null;
var loadingAnimationBackspaces = '\b';
var loadingAnimationFrames = [
  '[=     ]',
  '[ =    ]',
  '[  =   ]',
  '[   =  ]',
  '[    = ]',
  '[     =]',
  '[    = ]',
  '[   =  ]',
  '[  =   ]',
  '[ =    ]',
  '[=     ]',
];

prompt.message = '';
prompt.delimiter = '  ';
prompt.start();

for (var i = 0; i < welcomeBanner.length; i++) {
  welcomeBanner[i] += ' '.repeat(process.stdout.columns - welcomeBanner[i].length - 1);
}

welcomeBanner = colors.bold.bgBlue.white(welcomeBanner.join('\n'));

for (var i = 0; i < loadingAnimationFrames[0].length; i++) {
  loadingAnimationBackspaces += '\b';
}

Prompts.clear = function (noBanner) {
  process.stdout.write('\033c');

  if (!noBanner) {
    Prompts.printBanner();
  }

  return this;
};

Prompts.clearLine = function () {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  
  return this;
}

Prompts.print = function (color, message) {
    var message = message || color;

  if (typeof color === 'function') {
    message = color(message);
  }

  process.stdout.write(message || '');

  return this;
};

Prompts.println = function (color, message) {
  var message = message || color || '';

  if (typeof color === 'function') {
    message = color(message);
  }

  message += '\n';
  process.stdout.write(message);

  return this;
};

Prompts.printBanner = function () {
  console.log(welcomeBanner + '\n');

  return this;
};

Prompts.loadingAnimation = function (status) {
  var initialFrame = true;
  var currentFrame = 0;

  if (!status) {
    clearInterval(loadingAnimationInterval);

    process.stdout.write(loadingAnimationBackspaces);
    process.stdout.write('\033[K');

    return; 
  }

  loadingAnimationInterval = setInterval(function () {
    if (currentFrame == loadingAnimationFrames.length - 1) {
      currentFrame = 0;
    }

    if (!initialFrame) {
      process.stdout.write(loadingAnimationBackspaces);
    }

    process.stdout.write(' ' + loadingAnimationFrames[currentFrame]);
    initialFrame = false;

    currentFrame++;
  }, 100);

  return this;
};

Prompts.progressBar = function(completed, total, status, noClear) {
  var percent = Math.floor((completed / total) * 100);

  var barLength = process.stdout.columns - 8;
  var completedLength = barLength * (percent / 100);
  var remainingLength = barLength - completedLength;
  var bar = '';

  if (!noClear) {
    var statusLines = status.split('\n').length;

    process.stdout.write('\033[' + statusLines + 'A');
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  bar += colors.bgGreen(' '.repeat(completedLength));
  bar += colors.bgWhite(' '.repeat(remainingLength));
  bar += ' ' + percent + '%';

  process.stdout.write(status + '\n' + bar);

  return this;
};

Prompts.ask = function (question, callback) {
  if (typeof question === 'string') {
    if (!(question in questions)) {
      questions[question] = require('./questions/' + question);
    }

    question = questions[question];
  }
  
  prompt.get(question, callback);

  return this;
};

module.exports = Prompts;