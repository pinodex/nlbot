/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

/*
 * Load String.prototype.repeat polyfill if the
 * current version does not support it.
 */
if (!String.prototype.repeat) {
  String.prototype.repeat = require('./modules/StringRepeatPolyfill');
}

var colors = require('colors/safe');

var Session = require('./modules/Session');
var Prompts = require('./Prompts');
var Neo = require('./Neo');

var App = function () {
  
  (function login(error, message) {
    Prompts.clear();

    if (error) {
      Prompts.loadingAnimation(false);
      
      Prompts.println(colors.bold.bgRed.white, ' ' + (message || 'An error occurred') + ' ');
      Prompts.println();
    }
    
    Prompts.ask('login', function (err, data) {
      if (!data) {
        return;
      }

      Prompts.clear().print('Sending request to ' + data.host);
      Prompts.loadingAnimation(true);

      var session = new Session(data);

      session.login(function(err, res, body) {
        if (err) {
          login(true, err);
          return;
        }

        try {
          body = JSON.parse(body);
        } catch (e) {
          login(true);
        }

        if (body.status == 'problem') {
          login(true, body.text);

          return;
        }

        Prompts.loadingAnimation(false);
        Prompts.clear().println(colors.bold.white, 'You are now logged in!');

        Neo.setSession(session);
        Neo.init();
      });
    });
  })();

};

module.exports = App;