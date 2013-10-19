'use strict';

var Default = require('../class/Default');
var Writable = require('./util/Writable');

var logger = new Default();
var writable = new Writable();

logger.logLevel = 0;

module.exports = {

    'Default.prototype': [
        function (test) {

            logger.levels.DBG.stream = writable;
            logger.levels.INF.stream = writable;
            logger.levels.LOG.stream = writable;
            logger.levels.WRN.stream = writable;
            logger.levels.ERR.stream = writable;
            logger.levels.FATAL.stream = writable;

            writable.on('finish', function () {
                test.strictEqual(writable.pends.length, 7);

                writable.pends.forEach(function (message) {
                    message = String(message).split('\n')[0];
                    test.strictEqual(message.indexOf('hi, all'),
                        message.length - 'hi, all'.length);
                });

                test.done();
            });

            logger.trace('hi, %s', 'all');
            logger.debug('hi, %s', 'all');
            logger.info('hi, %s', 'all');
            logger.log('hi, %s', 'all');
            logger.warn('hi, %s', 'all');
            logger.error('hi, %s', 'all');
            logger.fatal('hi, %s', 'all');

            writable.end();
        }
    ],

    'Default.prototype.dir': [
        function (test) {

            var stream = new Writable();

            logger.levels.DBG.stream = stream;

            stream.on('finish', function () {
                test.strictEqual(stream.pends.length, 1);

                stream.pends.forEach(function (message) {
                    message = String(message);
                    test.strictEqual(message.indexOf('hi all'),
                        message.length - 'hi, all'.length - 1);
                });

                test.done();
            });

            logger.dir('hi all');

            stream.end();
        }
    ]

};
