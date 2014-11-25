'use strict';

var hasColor = Number(require('has-color'));
var resolve = require.resolve;

module.exports = {
    logLevel: 'NOTE',
    enabled: ['stddev'],
    handlers: {
        //  development case
        stddev: {
            Class: resolve('./core/handler/stream-handler'),
            layout: ['verbose', 'colored'][hasColor],
            kwargs: {
                stream: process.stdout
            }
        },
        //  production, regular
        stdout: {
            Class: resolve('./core/handler/stream-handler'),
            layout: 'compact',
            kwargs: {
                stream: process.stdout
            }
        },
        //  production, warnings
        stderr: {
            Class: resolve('./core/handler/stream-handler'),
            layout: 'verbose',
            kwargs: {
                level: 'WARNING',
                stream: process.stderr
            }
        }
    },
    layouts: {
        //  compact layout, production case
        compact: {
            Class: resolve('./core/layout/layout'),
            record: 'regular',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '[%(date)s] %(context)s: ' +
                    '%(level)s - %(message)s\n'
            }
        },
        //  verbose, ideal for production error formatting
        verbose: {
            Class: resolve('./core/layout/layout'),
            record: 'context',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '[%(date)s] %(context)s: ' +
                    '%(module)s:%(line)d:%(column)d %(level)s - %(message)s\n'
            }
        },
        //  verbose colored layout, only tty-s, development
        colored: {
            Class: resolve('./core/layout/colored'),
            record: 'context',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '\x1B[90m[%(date)s]\x1B[0m %(context)s: ' +
                    '%(module)s:%(line)d:%(column)d %(level)s - %(message)s\n',
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
    },
    records: {
        //  regular record
        regular: {
            Class: resolve('./core/record/regular')
        },
        //  regular record + caller info
        context: {
            Class: resolve('./core/record/context')
        }
    }
};
