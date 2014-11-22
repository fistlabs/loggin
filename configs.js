'use strict';

var hasColor = Number(require('has-color'));
var path = require('path');

function resolve(s) {
    return path.join(__dirname, s);
}

module.exports = {
    logLevel: 'NOTE',
    enabled: ['stdout'],
    handlers: {
        stdout: {
            Class: resolve('./core/handler/stream-handler'),
            params: {
                layout: ['pretty', 'colored'][hasColor],
                stream: process.stdout
            }
        },
        stderr: {
            Class: resolve('./core/handler/stream-handler'),
            params: {
                level: 'WARNING',
                layout: 'pretty',
                stream: process.stderr
            }
        }
    },
    layouts: {
        pretty: {
            Class: resolve('./core/layout/layout'),
            params: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '[%(date)s] %(context)s: %(module)s %(level)s - %(message)s\n'
            }
        },
        colored: {
            Class: resolve('./core/layout/colored'),
            params: {
                dateFormat: '%d/%b/%Y:%H:%M:%S %z',
                template: '\x1B[90m[%(date)s]\x1B[0m %(context)s: %(module)s %(level)s - %(message)s\n',
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
