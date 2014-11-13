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

    function getLevel() {
        return Logging.getStorage().logLevel;
    }

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
        'info', 'log', 'warn', 'error', 'fatal', 'note'];
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
        assert.strictEqual(typeof loggin.setLevel, 'function');

        loggin.setLevel('NOTE');
        assert.strictEqual(getLevel(), 'NOTE');
        loggin.setLevel('INTERNAL');
        assert.strictEqual(getLevel(), 'INTERNAL');
        loggin.setLevel('NOTE');
        assert.strictEqual(getLevel(), 'NOTE');
    });

    it('Should not set DEFAULT_LOG_LEVEL if set', function () {
        delete require.cache[require.resolve('../loggin')];
        Logging.setLevel('SILENT');
        loggin = require('../loggin');
        assert.strictEqual(getLevel(), 'SILENT');
    });

});
