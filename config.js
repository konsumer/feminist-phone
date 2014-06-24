// shared config system
var fs = require('fs'), path = require('path');
if (fs.existsSync(path.join(__dirname, '.env'))) {
    var env = require('node-env-file');
    env('.env');
}