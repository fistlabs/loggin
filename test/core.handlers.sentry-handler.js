/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/handlers/sentry-handler', function () {
    var Handler = require('../core/handlers/sentry-handler');
    var layout = {};

    function SpyHandler(l, params) {
        Handler.call(this, l, params);
    }

    SpyHandler.prototype = Object.create(Handler.prototype);

    SpyHandler.prototype._createClient = function (dsn, options) {
        return {
            dsn: dsn,
            options: options,
            captureError: function () {}
        };
    };

    function createHandler(params) {
        return new SpyHandler(layout, params);
    }

    describe('handler.client', function () {
        it('Should create client', function () {
            var handler = new Handler(layout, {});
        });

        it('Should create client', function () {
            var handler = createHandler({});
            assert.ok(handler.client);
        });

        it('Should call captureError()', function () {
            var handler = createHandler({});
            var spy;
            var messageObj = new Error();
            handler.client.captureError = function (message, options) {
                spy = {
                    message: message,
                    options: options
                };
            };

            handler.handle({
                message: messageObj,
                level: 'DEBUG',
                bar: 'baz'
            });

            assert.deepEqual(spy, {
                message: messageObj,
                options: {
                    level: 'debug',
                    extra: {
                        level: 'DEBUG',
                        bar: 'baz'
                    }
                }
            });
        });

        it('Should call captureMessage()', function () {
            var handler = createHandler({});
            var spy;
            var messageObj = 'foo';
            handler.client.captureMessage = function (message, options) {
                spy = {
                    message: message,
                    options: options
                };
            };

            handler.handle({
                message: messageObj,
                level: 'DEBUG',
                bar: 'baz'
            });

            assert.deepEqual(spy, {
                message: messageObj,
                options: {
                    level: 'debug',
                    extra: {
                        level: 'DEBUG',
                        bar: 'baz'
                    }
                }
            });
        });
    });
});
