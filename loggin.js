'use strict';

var NOTE = 'NOTE';

var LEVELS = [
    'INTERNAL',
    'DEBUG',
    NOTE,
    'INFO',
    'LOG',
    'WARNING',
    'ERROR',
    'FATAL',
    'SILENT'
];

var Config = require('./core/config');
var Logging = require('./core/logging');

var _ = require('lodash-node');
var config = new Config();
var defaultConfig = require('./default-config');

function init(logLevels, defaultLevel) {
    var storage = Logging.getStorage();

    storage.levels = {};

    _.forEachRight(logLevels, function (level, i, levels) {
        var last = levels.length - 1;
        var c;
        var m;
        var y;

        level = levels[last - i];

        if (i === 0) {
            y = Infinity;
        } else if (i === last) {
            y = -Infinity;
        } else {
            i -= 1;
            last -= 2;
            c = (Math.pow(5, 0.5) + 1) / 2;
            m = last * Math.pow(c, last);
            y = -(i * Math.pow(c, i) - m) / m * 2 - 1;
        }

        storage.levels[level] = y * Number.MAX_VALUE;
    });

    if (!_.has(storage.levels, storage.logLevel)) {
        Logging.setLevel(defaultLevel);
    }
}

function bindLogger(name, target) {
    var logger = config.getLogger(name);

    _.forOwn(config.loggings.global.Logger.prototype, function (val, k) {
        target[k] = val.bind(logger);
    });
}

config.getLogger = function (name) {
    return this.loggings.global.getLogger(name);
};

config.setLevel = function (level) {
    return Logging.setLevel(level);
};

init(LEVELS, NOTE);

config.conf(defaultConfig);

bindLogger('default', config);

module.exports = config;
