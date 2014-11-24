/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash-node');
var assert = require('assert');

describe('loggin', function () {
    var loggin = require('../loggin');
    var Logging = require('../core/logging');

    it('Should be an instance on Logging', function () {
        assert.ok(loggin instanceof Logging);
    });

    it('Should have "stdout" handler', function () {
        assert.ok(loggin.handlers.stdout);
        assert.strictEqual(typeof loggin.handlers.stdout, 'object');
        assert.strictEqual(typeof loggin.handlers.stdout.handle, 'function');
    });

    it('Should have "stderr" handler', function () {
        assert.ok(loggin.handlers.stderr);
        assert.strictEqual(typeof loggin.handlers.stderr, 'object');
        assert.strictEqual(typeof loggin.handlers.stderr.handle, 'function');
    });

    it('Should have "pretty" layout', function () {
        assert.ok(loggin.layouts.verbose);
        assert.strictEqual(typeof loggin.layouts.verbose, 'object');
        assert.strictEqual(typeof loggin.layouts.verbose.format, 'function');
    });

    it('Should have "colored" layout', function () {
        assert.ok(loggin.layouts.colored);
        assert.strictEqual(typeof loggin.layouts.colored, 'object');
        assert.strictEqual(typeof loggin.layouts.colored.format, 'function');
    });

    it('Should have "stddev" enabled', function () {
        assert.strictEqual(loggin.configs.enabled[0], 'stddev');
    });

    var recorders = ['internal', 'debug', 'info', 'log', 'warn', 'error', 'fatal', 'note'];
    _.forEach(recorders, function (name) {
        it('Should have "' + name + '" recorder', function () {
            assert.strictEqual(typeof loggin[name], 'function');
        });
    });

});
