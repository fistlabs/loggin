'use strict';

var S_DEFAULT_NAME = 'default';

var Logging = require('./core/logging');

var _ = require('lodash-node');
var configs = require('./configs');
var loggings = {};
var logging = getLogger();

function getLogger(name) {
    if (!name) {
        name = S_DEFAULT_NAME;
    }

    if (!_.has(loggings, name)) {
        loggings[name] = new Logging(name).conf(configs);
    }

    return loggings[name];
}

logging.getLogger = getLogger;

module.exports = logging;
