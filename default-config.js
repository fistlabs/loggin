'use strict';

var hasColor = require('has-color');
var path = require('path');

function resolve(s) {
    return path.join(__dirname, s);
}

module.exports = {
    loggings: {
        global: {
            Class: resolve('./core/logging'),
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
                note: {
                    level: 'NOTE',
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
                strf: '%(asctime)s %(process)s %(name)s %(level)s - %(message)s\n'
            }
        },
        colored: {
            Class: resolve('./core/layout/colored'),
            params: {
                strftime: '[%d/%b/%Y:%H:%M:%S %z]',
                strf: '%(asctime)s %(process)s %(name)s %(level)s - %(message)s\n',
                colors: {
                    INTERNAL: 'white',
                    DEBUG: 'fuchsia',
                    NOTE: 'blue',
                    INFO: 'aqua',
                    LOG: 'lime',
                    WARNING: 'yellow',
                    ERROR: 'red',
                    FATAL: 'maroon'
                }
            }
        }
    }
};
