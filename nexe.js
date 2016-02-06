var nexe = require('nexe');

nexe.compile({
    input: 'index.js',
    output: 'nlbot.exe',
    nodeVersion: '0.12.9',
    nodeTempDir: 'node_src',
    framework: 'nodejs',
    flags: false
}, function(err) {
    err && console.log(err);
});