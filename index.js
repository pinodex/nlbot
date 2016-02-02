/*!
 * nlbot
 *
 * @author      Raphael Marco
 * @link        http://pinodex.github.io
 * @license     MIT
 */

'use strict';

var app = require('./src/start');
var colors = require('colors/safe');

process.stdout.write('\n' + colors.bold.bgRed.white('   DISCLAIMER ') + '\n');
process.stdout.write(colors.bold.white([
  '   This application is intended for testing purposes only. The',
  '   developer holds no liabilities against damages caused by ',
  '   improper use of this application. ', '',
  '   By using this application, you agree to the terms stated',
  '   above.', '',
  '   The application will proceed in 5 seconds...',
  '   (Input ^C to terminate)'
].join('\n')));

setTimeout(app, 5000);