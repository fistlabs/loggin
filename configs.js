'use strict';

var resolve = require.resolve;

module.exports = {
    logLevel: 'NOTE',
    enabled: ['stdoutColorRegular', 'stderrColorVerbose'],
    handlers: {
        //  development regular logs
        stdoutColorRegular: {
            Class: resolve('./core/handler/stream-handler'),
            layout: 'colorRegular',
            kwargs: {
                maxLevel: 'LOG',
                stream: process.stderr
            }
        },
        //  development errors
        stderrColorVerbose: {
            Class: resolve('./core/handler/stream-handler'),
            layout: 'colorVerbose',
            kwargs: {
                minLevel: 'WARNING',
                stream: process.stderr
            }
        },
        //  production regular log
        stdoutCleanRegular: {
            Class: resolve('./core/handler/stream-handler'),
            layout: 'cleanRegular',
            kwargs: {
                stream: process.stdout
            }
        },
        //  production warnings+
        stderrCleanVerbose: {
            Class: resolve('./core/handler/stream-handler'),
            layout: 'cleanVerbose',
            kwargs: {
                minLevel: 'WARNING',
                stream: process.stderr
            }
        }
    },
    layouts: {
        cleanRegular: {
            Class: resolve('./core/layout/layout'),
            record: 'regular',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '[%(date)s] %(process)d %(level)-8s ' +
                    '%(context)s — %(message)s\n'
            }
        },
        cleanVerbose: {
            Class: resolve('./core/layout/layout'),
            record: 'verbose',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '[%(date)s] %(process)d %(level)-8s ' +
                    '%(filename)s:%(line)d:%(column)d %(context)s — %(message)s\n'
            }
        },
        colorRegular: {
            Class: resolve('./core/layout/colored'),
            record: 'regular',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '\x1B[90m[%(date)s]\x1B[0m %(process)d %(level)-17s ' +
                    '%(context)s — %(message)s\n'
            }
        },
        colorVerbose: {
            Class: resolve('./core/layout/colored'),
            record: 'verbose',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '\x1B[90m[%(date)s]\x1B[0m %(process)d %(level)-17s ' +
                    '%(filename)s:%(line)d:%(column)d  %(context)s — %(message)s\n'
            }
        }
    },
    records: {
        //  regular record
        regular: {
            Class: resolve('./core/record/regular')
        },
        //  regular record + context data
        verbose: {
            Class: resolve('./core/record/verbose')
        }
    }
};
