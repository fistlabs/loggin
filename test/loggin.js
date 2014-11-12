/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash-node');
var assert = require('assert');

describe('loggin', function () {
    var loggin = require('../loggin');
    var Config = require('../core/config');
    var Logging = require('../core/logging');
    var Handler = require('../core/handler/stream-handler');
    var Layout = require('../core/layout/layout');
    var Colored = require('../core/layout/colored');

    it('Should be an instance on Config', function () {
        assert.ok(loggin instanceof Config);
    });

    it('Should have "global" logging', function () {
        assert.ok(loggin.loggings.global instanceof Logging);
    });

    it('Should have "console" handler', function () {
        assert.ok(loggin.handlers.console instanceof Handler);
    });

    it('Should have "pretty" layout', function () {
        assert.ok(loggin.layouts.pretty instanceof Layout);
    });

    it('Should have "colored" layout', function () {
        assert.ok(loggin.layouts.colored instanceof Colored);
    });

    var recorders = ['internal', 'debug',
        'info', 'log', 'warn', 'error', 'fatal', 'temp'];
    _.forEach(recorders, function (name) {
        it('Should have "' + name + '" recorder', function () {
            assert.strictEqual(typeof loggin[name], 'function');
            assert.strictEqual(typeof loggin.loggings.global.Logger.prototype[name], 'function');
        });
    });

    it('Should have "getLogger" method', function () {
        assert.strictEqual(typeof loggin.getLogger, 'function');
        assert.ok(loggin.getLogger() instanceof loggin.loggings.global.Logger);
    });

    it('Should have "setLevel" method', function () {
        loggin.loggings.global.getLevel = function () {
            return this._level;
        };
        assert.strictEqual(typeof loggin.setLevel, 'function');
        assert.strictEqual(loggin.loggings.global.getLevel(), 'DEBUG');
        loggin.setLevel('INTERNAL');
        assert.strictEqual(loggin.loggings.global.getLevel(), 'INTERNAL');
        loggin.setLevel('DEBUG');
        assert.strictEqual(loggin.loggings.global.getLevel(), 'DEBUG');
    });

});
