'use strict';

var Logging = require('./core/logging');

var configs = require('./configs');
var filename = (require.main || module.parent).filename;
var logging = new Logging();
var path = require('path');

logging.conf(configs);

logging.getLogger(path.basename(filename, '.js')).setup(logging);

module.exports = logging;

logging.internal('Using loggin');
