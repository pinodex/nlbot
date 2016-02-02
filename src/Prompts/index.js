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
  "        _ _           _      ",
  "        | | |         | |    ",
  "   _ __ | | |__   ___ | |_   ",
  "  | '_ \\| | '_ \\ / _ \\| __|  ",
  "  | | | | | |_) | (_) | |_   ",
  "  |_| |_|_|_.__/ \\___/ \\__|  ",
  "  Make reading lessons quick ",
  "                             "
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
  var padSize = process.stdout.columns - welcomeBanner[i].length - 1;

  for (var x = 0; x < padSize; x++) {
    welcomeBanner[i] += ' ';
  }
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

Prompts.printsl = function (color, message) {
  var message = message || color || '';

  if (typeof color === 'function') {
    message = color(message);
  }

  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  process.stdout.write(message);

  return this;
}

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
};

Prompts.progressBar = function(percent, status, noClear) {
  if (percent < 0) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);

    return;
  }

  percent = Math.floor(percent);

  var barLength = process.stdout.columns - 8;
  var completedLength = barLength * (percent / 100);
  var remainingLength = barLength - completedLength;
  var bar = '';

  if (!noClear) {
    process.stdout.write('\033[1A');
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
  }

  bar += colors.bgGreen(' '.repeat(completedLength));
  bar += colors.bgWhite(' '.repeat(remainingLength));
  bar += ' ' + percent + '%';

  process.stdout.write(status + '\n' + bar);
};

Prompts.printBanner = function() {
  console.log(welcomeBanner + '\n');

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
};

module.exports = Prompts;