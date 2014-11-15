'use strict';

var Logging = require('./core/logging');

var logging = new Logging();
var configs = require('./configs');

logging.conf(configs);

logging.getLogger('default').setup(logging);

module.exports = logging;
