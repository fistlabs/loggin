/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash-node');
var assert = require('assert');
var f = require('util').format;

describe('core/logger', function () {
    var Logger = require('../core/logger');
    var recorders = ['internal', 'debug', 'note', 'info', 'log', 'warn', 'error', 'fatal'];

    it('Should have recorders', function () {
        var logger = new Logger();
        recorders.forEach(function (r) {
            assert.strictEqual(typeof logger[r], 'function');
        });
    });

    describe('logger.<recorder>', function () {
        var levels = {
            internal: 'INTERNAL',
            debug: 'DEBUG',
            note: 'NOTE',
            info: 'INFO',
            log: 'LOG',
            warn: 'WARNING',
            error: 'ERROR',
            fatal: 'FATAL'
        };

        _.forEach(recorders, function (recorder) {
            it(f('logger.%s should create correct args', recorder), function () {
                var logger = new Logger(recorder + '_context');
                var expectedCaller = logger[recorder];
                var spy = 0;
                logger.logging = {
                    record: function (context, level, caller, args) {
                        assert.strictEqual(context, logger.context);
                        assert.strictEqual(level, levels[recorder]);
                        assert.strictEqual(caller, expectedCaller);
                        assert.deepEqual(args, [recorder, level]);
                        spy += 1;
                    }
                };
                logger[recorder](recorder, levels[recorder]);
                assert.strictEqual(spy, 1);
            });
        });
    });

    describe('logger.name', function () {
        it('Should be a passed name', function () {
            var logger = new Logger({}, ['foo']);
            assert.ok(logger.context);
            assert.deepEqual(logger.context, ['foo']);
        });
    });

    describe('logger.bind', function () {
        it('Should bind context', function () {
            var logger = new Logger({}, ['foo']);
            assert.ok(logger.context);
            assert.deepEqual(logger.context, ['foo']);
            var logger2 = logger.bind('bar');
            assert.deepEqual(logger2.context.sort(), ['foo', 'bar'].sort());
        });
    });

    describe('logger.setup', function () {
        it('Should set up to any object', function () {
            var logger = new Logger();
            var obj = {};
            logger.setup(obj);
            recorders.forEach(function (r) {
                assert.strictEqual(typeof obj[r], 'function');
            });
        });
    });
});
