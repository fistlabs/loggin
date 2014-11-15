/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/logger', function () {
    var Logger = require('../core/logger');
    var recorders = ['internal', 'debug', 'note', 'info', 'log', 'warn', 'error', 'fatal'];
    it('Should have recorders', function () {
        var logger = new Logger();
        recorders.forEach(function (r) {
            assert.strictEqual(typeof logger[r], 'function');
        });
    });

    describe('logger.name', function () {
        it('Should be a passed name', function () {
            var logger = new Logger({}, 'foo');
            assert.ok(logger.name);
            assert.strictEqual(logger.name, 'foo');
        });
    });

    describe('logger.bind', function () {
        it('Should bind context', function () {
            var logger = new Logger({}, 'foo');
            assert.ok(logger.name);
            assert.strictEqual(logger.name, 'foo');
            var logger2 = logger.bind('bar');
            assert.strictEqual(logger2.name, 'foo:bar');
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
