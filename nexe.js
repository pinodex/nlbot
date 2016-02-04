var nexe = require('nexe');
var path = require('path');
var fs = require('fs');

var winstonLib = path.dirname(require.resolve('winston'));
var bundleFile = path.resolve(winstonLib, 'winston', 'nexe-bundle.js');
var bundleContent = [
  "/**",
  " * Written automatically for nexe.js",
  " * to workaround dynamic requires.",
  " */",
  "",
  "require('./transports/console');",
  "require('./transports/daily-rotate-file');",
  "require('./transports/file');",
  "require('./transports/http');",
  "require('./transports/memory');",
  "require('./transports/transport');",
  "require('./transports/webhook');"
].join('\n');

fs.writeFileSync(bundleFile, bundleContent);

nexe.compile({
    input: 'index.js',
    output: 'nlbot.exe',
    nodeVersion: '5.5.0',
    nodeTempDir: 'node_src',
    framework: 'node',
    python: 'C:\\Python27\\python.exe'
}, function(err) {
    err && console.log(err);
});