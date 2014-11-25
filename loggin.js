'use strict';

var Logging = require('./core/logging');

var configs = require('./configs');
var logging = new Logging();

logging.conf(configs);

logging.getLogger('default').setup(logging);

module.exports = logging;
