/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash-node');
var assert = require('assert');
var f = require('util').format;

describe('loggin', function () {
    var Logger = require('../core/logger');
    var Logging = require('../core/logging');

    var loggin = require('../loggin');

    it('Should be an instance on Logging', function () {
        assert.ok(loggin instanceof Logging);
    });

    var handlers = [
        'stdoutColorRegular',
        'stderrColorVerbose',
        'stdoutCleanRegular',
        'stderrCleanVerbose'
    ];

    _.forEach(handlers, function (handler) {
         var shouldText = 'Should have "%s" handler';
        it(f(shouldText, handler), function () {
            assert.ok(loggin.handlers[handler]);
            assert.strictEqual(typeof loggin.handlers[handler], 'object');
            assert.strictEqual(typeof loggin.handlers[handler].handle, 'function');
        });
    });

    var layouts = [
        'colorRegular',
        'colorVerbose',
        'cleanRegular',
        'cleanVerbose'
    ];

    _.forEach(layouts, function (layout) {
        var shouldText = 'Should have "%s" layout';
        it(f(shouldText, layout), function () {
            assert.ok(loggin.layouts[layout]);
            assert.strictEqual(typeof loggin.layouts[layout], 'object');
            assert.strictEqual(typeof loggin.layouts[layout].format, 'function');
        });
    });

    var enabled = [
        'stdoutColorRegular',
        'stderrColorVerbose'
    ];
    _.forEach(enabled, function (handler) {
        var shouldText = 'Should have "%s" handler enabled';
        it(f(shouldText, handler), function () {
            assert.notStrictEqual(loggin.configs.enabled.indexOf(handler), -1);
        });
    });

    describe('loggin.getLogger()', function () {
        it('Should have getLogger function', function () {
            assert.ok(typeof loggin.getLogger, 'function');
        });

        it('Should create named logger', function () {
            var logger = loggin.getLogger('foo');
            assert.ok(loggin instanceof Logger);
            assert.ok(loggin instanceof Logging);
            assert.strictEqual(logger.context, 'foo');
        });

        it('Should give default name to logger if no specified', function () {
            var logger = loggin.getLogger();
            assert.strictEqual(logger.context, 'default');
        });

        it('Should cache loggers', function () {
            var logger = loggin.getLogger('foo');
            assert.strictEqual(logger, loggin.getLogger('foo'));
        });
    });
});
