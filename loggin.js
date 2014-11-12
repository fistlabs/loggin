'use strict';

var Config = require('./core/config');

var _ = require('lodash-node');
var config = new Config();
var hasColor = require('has-color');
var path = require('path');

function resolve(s) {
    return path.join(__dirname, s);
}

config.configure({
    loggings: {
        global: {
            Class: resolve('./core/logging'),
            levels: {
                INTERNAL: -Infinity,
                DEBUG: 0,
                INFO: 20000,
                LOG: 35000,
                WARNING: 45000,
                ERROR: 50000,
                FATAL: Infinity
            },
            level: 'DEBUG',
            handlers: ['console'],
            records: {
                internal: {
                    level: 'INTERNAL',
                    Class: resolve('./core/record/sprintf-record')
                },
                debug: {
                    level: 'DEBUG',
                    Class: resolve('./core/record/sprintf-record')
                },
                info: {
                    level: 'INFO',
                    Class: resolve('./core/record/sprintf-record')
                },
                log: {
                    level: 'LOG',
                    Class: resolve('./core/record/sprintf-record')
                },
                warn: {
                    level: 'WARNING',
                    Class: resolve('./core/record/sprintf-record')
                },
                error: {
                    level: 'ERROR',
                    Class: resolve('./core/record/sprintf-record')
                },
                fatal: {
                    level: 'FATAL',
                    Class: resolve('./core/record/sprintf-record')
                },
                trace: {
                    level: 'DEBUG',
                    Class: resolve('./core/record/trace-record')
                },
                dir: {
                    level: 'DEBUG',
                    Class: resolve('./core/record/inspect-record')
                }
            }
        }
    },
    handlers: {
        console: {
            Class: resolve('./core/handler/stream-handler'),
            layout: ['pretty', 'colored'][Number(hasColor)],
            params: {
                stream: process.stdout,
                streams: {
                    WARNING: process.stderr,
                    ERROR: process.stderr,
                    FATAL: process.stderr
                }
            }
        }
    },
    layouts: {
        pretty: {
            Class: resolve('./core/layout/layout'),
            params: {
                strftime: '[%d/%b/%Y:%H:%M:%S %z]',
                strf: '%(asctime)s %(process)s:%(name)s %(level)s - %(message)s\n'
            }
        },
        colored: {
            Class: resolve('./core/layout/colored'),
            params: {
                strftime: '[%d/%b/%Y:%H:%M:%S %z]',
                strf: '%(asctime)s %(process)s:%(name)s %(level)s - %(message)s\n',
                colors: {
                    INTERNAL: 'fuchsia',
                    DEBUG: 'blue',
                    INFO: 'aqua',
                    LOG: 'lime',
                    WARNING: 'yellow',
                    ERROR: 'red',
                    FATAL: 'maroon'
                }
            }
        }
    }
});

var logger = config.loggings.global.getLogger();

_.forOwn(config.loggings.global.Logger.prototype, function (val, k) {
    config[k] = val.bind(logger);
});

config.getLogger = function (name) {
    return this.loggings.global.getLogger(name);
};

config.setLevel = function (level) {
    return this.loggings.global.setLevel(level);
};

module.exports = config;
