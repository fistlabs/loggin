'use strict';

var resolve = require.resolve;

module.exports = {
    logLevel: 'NOTE',
    enabled: ['stdoutColorRegular', 'stderrColorRegular', 'stderrColorVerbose'],
    handlers: {
        //  development regular logs
        stdoutColorRegular: {
            Class: resolve('./core/handlers/stream-handler'),
            layout: 'colorRegular',
            kwargs: {
                maxLevel: 'LOG',
                stream: process.stdout
            }
        },
        // development warnings
        stderrColorRegular: {
            Class: resolve('./core/handlers/stream-handler'),
            layout: 'colorRegular',
            kwargs: {
                minLevel: 'WARNING',
                maxLevel: 'WARNING',
                stream: process.stderr
            }
        },
        //  development errors
        stderrColorVerbose: {
            Class: resolve('./core/handlers/stream-handler'),
            layout: 'colorVerbose',
            kwargs: {
                minLevel: 'ERROR',
                stream: process.stderr
            }
        },
        //  production regular log
        stdoutCleanRegular: {
            Class: resolve('./core/handlers/stream-handler'),
            layout: 'cleanRegular',
            kwargs: {
                stream: process.stdout
            }
        },
        // production warnings
        stderrCleanRegular: {
            Class: resolve('./core/handlers/stream-handler'),
            layout: 'cleanRegular',
            kwargs: {
                minLevel: 'WARNING',
                maxLevel: 'WARNING',
                stream: process.stderr
            }
        },
        //  production errors
        stderrCleanVerbose: {
            Class: resolve('./core/handlers/stream-handler'),
            layout: 'cleanVerbose',
            kwargs: {
                minLevel: 'ERROR',
                stream: process.stderr
            }
        }
    },
    layouts: {
        cleanRegular: {
            Class: resolve('./core/layouts/layout'),
            record: 'regular',
            kwargs: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '[%(date)s] %(process)5s %(level)-8s ' +
                    '%(context)s — %(message)s\n'
            }
        },
        cleanVerbose: {
            Class: resolve('./core/layouts/layout'),
            record: 'verbose',
            kwargs: {
                showStackTraces: true,
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '[%(date)s] %(process)5s %(level)-8s ' +
                    '%(filename)s:%(line)d:%(column)d %(context)s — %(message)s\n'
            }
        },
        colorRegular: {
            Class: resolve('./core/layouts/colored'),
            record: 'regular',
            kwargs: {
                dateFormat: '%H:%M:%S.%L',
                template: '\x1B[90m[%(date)s]\x1B[0m %(process)5s %(level)-17s ' +
                    '%(context)s — %(message)s\n'
            }
        },
        colorVerbose: {
            Class: resolve('./core/layouts/colored'),
            record: 'verbose',
            kwargs: {
                showStackTraces: true,
                dateFormat: '%H:%M:%S.%L',
                template: '\x1B[90m[%(date)s]\x1B[0m %(process)5s %(level)-17s ' +
                    '%(module)s:%(line)d:%(column)d %(context)s — %(message)s\n'
            }
        }
    },
    records: {
        //  regular record
        regular: {
            Class: resolve('./core/records/regular')
        },
        //  regular record + context data
        verbose: {
            Class: resolve('./core/records/verbose')
        }
    }
};
