'use strict';

var Logger = require('../class/Logger');
var Writable = require('./util/Writable');

var logger = new Logger();
var writable = new Writable();

module.exports = {

    'Logger.prototype': [
        function (test) {

            logger.levels.DBG.stream = writable;
            logger.levels.INF.stream = writable;
            logger.levels.LOG.stream = writable;
            logger.levels.WRN.stream = writable;
            logger.levels.ERR.stream = writable;
            logger.levels.FATAL.stream = writable;

            test.strictEqual( 'number', typeof (logger.logLevel = 3) );

            writable.on('finish', function () {
                test.strictEqual(writable.pends.length, 3);

                writable.pends.forEach(function (message) {
                    message = String(message);
                    test.strictEqual(message.indexOf('hi, all\n'),
                        message.length - 'hi, all\n'.length);
                });

                test.done();
            });

            logger.debug('hi, %s', 'all');
            logger.info('hi, %s', 'all');
            logger.log('hi, %s', 'all');
            logger.warn('hi, %s', 'all');
            logger.error('hi, %s', 'all');
            logger.fatal('hi, %s', 'all');

            writable.end();
        }
    ]

};
