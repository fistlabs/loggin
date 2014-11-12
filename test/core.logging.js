/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/logging', function () {
    var Layout = require('../core/layout/layout');
    var Handler = /** @type Handler */ require('../core/handler/stream-handler');
    var StdLogging = /** @type Logging */ require('../core/logging');

    function Logging() {
        StdLogging.apply(this, arguments);
    }

    Logging.prototype = Object.create(StdLogging.prototype);

    Logging.prototype.getHandlers = function () {
        return this._handlers;
    };

    Logging.prototype.getLevel = function () {
        return this._level;
    };

    Logging.prototype.getLevels = function () {
        return this._levels;
    };

    Logging.prototype.doRecord = function () {
        return this._record.apply(this, arguments);
    };

    describe('new Logging()', function () {
        it('Should create public class Logging', function () {
            var logging = new Logging();
            assert.strictEqual(typeof logging.Logger, 'function');
        });
    });

    describe('logging.addHandler', function () {

        it('Should throw an Error if not a handler passed', function () {
            var logging = new Logging();
            assert.throws(function () {
                logging.addHandler();
            });
            assert.throws(function () {
                logging.addHandler({});
            });
        });

        it('Should add handler', function () {
            var logging = new Logging();
            var layout = new Layout({
                strf: 'Test: %(message)',
                strftime: ''
            });
            var handler = new Handler({
                stream: {
                    write: function () {}
                },
                streams: {}
            }, layout);
            logging.addHandler(handler);
            assert.strictEqual(logging.getHandlers().length, 1);
            assert.strictEqual(logging.getHandlers()[0], handler);
        });
    });

    describe('logging.setHandlers', function () {
        it('Should throw an error if not an Array passed', function () {
            var logging = new Logging();
            assert.throws(function () {
                logging.setHandlers(42);
            });
        });
        it('Should set all handlers', function () {
            var logging = new Logging();
            var layout = new Layout({
                strf: 'Test: %(message)',
                strftime: ''
            });
            var handler = new Handler({
                stream: {
                    write: function () {}
                },
                streams: {}
            }, layout);
            logging.addHandler(handler);
            assert.strictEqual(logging.getHandlers().length, 1);
            assert.strictEqual(logging.getHandlers()[0], handler);
            logging.setHandlers([]);
            assert.strictEqual(logging.getHandlers().length, 0);
            logging.addHandler(handler);
            assert.strictEqual(logging.getHandlers().length, 1);
            assert.strictEqual(logging.getHandlers()[0], handler);
        });
    });

    describe('logging.addLevel', function () {
        it('Should be a valid log level', function () {
            var logging = new Logging();
            assert.throws(function () {
                logging.addLevel();
            });
            assert.throws(function () {
                logging.addLevel('FOO', {});
            });
            assert.throws(function () {
                logging.addLevel({}, 42);
            });
        });
        it('Should add log level', function () {
            var logging = new Logging();
            logging.addLevel('FOO', 42);
            assert.deepEqual(logging.getLevels(), {
                FOO: 42
            });
        });
    });

    describe('logging.setLevel', function () {
        it('Should be an existing log level', function () {
            var logging = new Logging();
            assert.throws(function () {
                logging.setLevel('FOO');
            });
        });

        it('Should set log level', function () {
            var logging = new Logging();
            logging.addLevel('FOO', 42);
            logging.setLevel('FOO');
            assert.strictEqual(logging.getLevel(), 'FOO');
        });
    });

    describe('logging.addRecord', function () {
        it('Should accept only valid params', function () {
            var logging = new Logging();
            logging.addLevel('FOO', 42);
            function Record() {}
            assert.throws(function () {
                logging.addRecord(42, 'FOO', Record);
            });
            assert.throws(function () {
                logging.addRecord('log', 42, Record);
            });
            assert.throws(function () {
                logging.addRecord('log', 'BAR', Record);
            });
            assert.throws(function () {
                logging.addRecord('log', 'FOO', 42);
            });
            assert.doesNotThrow(function () {
                logging.addRecord('log', 'FOO', Record);
            });
        });

        it('Should add recorder', function () {
            var logging = new Logging();
            logging.addLevel('FOO', 42);
            logging.addRecord('log', 'FOO', function () {});
            assert.strictEqual(typeof logging.Logger.prototype.log, 'function');
        });
    });

    describe('logging.getLogger()', function () {
        it('Should return logger', function () {
            var logging = new Logging();
            assert.ok(logging.getLogger() instanceof logging.Logger);
        });
        it('Should return logger with passed name', function () {
            var logging = new Logging();
            var logger = logging.getLogger('foo');
            assert.strictEqual(logger.name, 'foo');
        });
    });

    describe('logging._record', function () {

        function SpyLayout() {}

        SpyLayout.prototype = Object.create(Layout.prototype);

        SpyLayout.prototype.format = function (vars) {
            return vars;
        };

        function SpyHandler(layout) {
            this.spy = [];
            this._layout = layout;
        }

        SpyHandler.prototype = Object.create(Handler.prototype);

        SpyHandler.prototype.handle = function (vars) {
            this.spy.push(vars);
        };

        function SpyRecord(a, b, args) {
            this.args = [].slice.call(args, 0);
        }

        SpyRecord.prototype.getVars = function () {
            return this.args;
        };

        it('Should return level match result', function () {
            var logging = new Logging();
            logging.addLevel('FOO', 0);
            logging.addLevel('BAR', 42);
            logging.setLevel('BAR');
            logging.addHandler(new SpyHandler(new SpyLayout()));
            assert.ok(!logging.doRecord(SpyRecord, 'FOO', 'foo', []));
            assert.ok(logging.doRecord(SpyRecord, 'BAR', 'foo', []));
        });

        it('Should handle record if level match only', function () {
            var logging = new Logging();
            logging.addLevel('FOO', 0);
            logging.addLevel('BAR', 42);
            logging.setLevel('BAR');
            var handler = new SpyHandler(new SpyLayout());
            logging.addHandler(handler);
            logging.addRecord('foo', 'FOO', SpyRecord);
            logging.addRecord('bar', 'BAR', SpyRecord);
            var logger = logging.getLogger('xyz');
            assert.ok(!logger.foo(1));
            assert.ok(logger.bar(2));
            assert.ok(!logger.foo(3));
            assert.ok(logger.bar(4));

            assert.deepEqual(handler.spy, [
                [2],
                [4]
            ]);
        });
    });
});
