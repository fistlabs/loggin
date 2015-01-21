'use strict';

var Logging = require('../core/logging');
var logging = new Logging();

var N = 10000000;
var i;

logging.conf({
    logLevel: 'NOTSET'
});

var err = new Error();

for (i = 0; i < N; i += 1) {
    logging.internal('foo %s', 'bar', err);
    logging.debug('foo %s', 'bar', err);
    logging.note('foo %s', 'bar', err);
    logging.info('foo %s', 'bar', err);
    logging.log('foo %s', 'bar', err);
    logging.warn('foo %s', 'bar', err);
    logging.error('foo %s', 'bar', err);
    logging.fatal('foo %s', 'bar', err);
}
