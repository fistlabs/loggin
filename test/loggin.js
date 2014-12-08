/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash-node');
var assert = require('assert');
var f = require('util').format;

describe('loggin', function () {
    var loggin = require('../loggin');
    var Logging = require('../core/logging');

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

});
