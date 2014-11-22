/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/logging', function () {
    var Layout = require('../core/layout/layout');
    var Logger = require('../core/logger');
    var Handler = /** @type Handler */ require('../core/handler/stream-handler');
    var StdLogging = /** @type Logging */ require('../core/logging');

    function Logging() {
        StdLogging.apply(this, arguments);
    }

    Logging.prototype = Object.create(StdLogging.prototype);

    describe('logging.getLogger()', function () {
        it('Should return logger with global context', function () {
            var logging = new Logging();
            var logger = logging.getLogger();
            assert.ok(logger instanceof Logger);
            assert.strictEqual(String(logger.context), String(process.pid));
        });

        it('Should return logger with specified context', function () {
            var logging = new Logging();
            var logger = logging.getLogger('foo');
            assert.ok(logger instanceof Logger);
            assert.deepEqual(String(logger.context).split(/\W+/), [String(process.pid), 'foo']);
        });
    });

    describe('logging.record', function () {

        function SpyLayout() {}

        SpyLayout.prototype = Object.create(Layout.prototype);

        SpyLayout.prototype.format = function (vars) {
            return vars;
        };

        function SpyHandler(layout) {
            this.spy = [];
            this.layout = layout;
        }

        SpyHandler.prototype = Object.create(Handler.prototype);

        SpyHandler.prototype.handle = function (vars) {
            this.spy.push(vars.message);
        };

        function SpyRecord(a, b, c, args) {
            this.args = [].slice.call(args, 0);
        }

        SpyRecord.prototype.getVars = function () {
            return this.args;
        };

        it('Should return level match result', function f() {
            var logging = new Logging();
            logging.logLevel = 'INFO';
            assert.ok(!logging.record('foo', 'DEBUG', f, []));
            assert.ok(logging.record('foo', 'INFO', f, []));
        });

        it('Should handle record if level match only', function () {
            var logging = new Logging();
            logging.logLevel = 'INFO';
            var handler = new SpyHandler(new SpyLayout());
            logging.enabled = [handler];

            var logger = logging.getLogger();

            assert.ok(!logger.debug('1'));
            assert.ok(logger.info('2'));
            assert.ok(!logger.internal('3'));
            assert.ok(logger.error('4'));

            assert.deepEqual(handler.spy, ['2', '4']);
        });

        it('Should ignore handlers which level higher than record level', function () {
            var logging = new Logging();
            var logger = logging.getLogger();
            var spy = [];
            logging.logLevel = 'INFO';
            logging.enabled = [
                {
                    level: 'LOG',
                    handle: function (vars) {
                        spy.push(vars.message);
                    }
                }
            ];
            logger.info('foo');
            logger.log('bar');
            logger.warn('zot');
            logger.note('xyz');

            assert.deepEqual(spy, ['bar', 'zot']);
        });
    });

    describe('logging.conf', function () {
        it('Should add layouts by instance', function () {
            var logging = new Logging();
            logging.conf({
                layouts: {
                    foo: {
                        template: 'foox',
                        format: function () {}
                    }
                }
            });
            assert.strictEqual(logging.layouts.foo.template, 'foox');
        });

        it('Should add layouts by Class path', function () {
            var logging = new Logging();
            logging.conf({
                layouts: {
                    foo: {
                        Class: './layout/layout',
                        params: {
                            template: 'foox'
                        }
                    }
                }
            });
            assert.strictEqual(logging.layouts.foo.template, 'foox');
        });

        it('Should add layouts by Class', function () {
            var logging = new Logging();
            logging.conf({
                layouts: {
                    foo: {
                        Class: function (params) {
                            this.template = params.template + 'x';
                        },
                        params: {
                            template: 'foo'
                        }
                    }
                }
            });
            assert.strictEqual(logging.layouts.foo.template, 'foox');
        });

        it('Should add handlers by instance', function () {
            var logging = new Logging();
            logging.conf({
                handlers: {
                    foo: {
                        x: 42,
                        handle: function () {}
                    }
                }
            });
            assert.strictEqual(logging.handlers.foo.x, 42);
        });

        it('Should add handlers by Class path', function () {
            var logging = new Logging();
            logging.conf({
                layouts: {
                    foo: {
                        x: 42,
                        format: function () {}
                    }
                },
                handlers: {
                    bar: {
                        Class: './handler/stream-handler',
                        params: {
                            layout: 'foo'
                        }
                    }
                }
            });
            assert.strictEqual(logging.layouts.foo.x, 42);
            assert.strictEqual(logging.handlers.bar.layout.x, 42);
        });

        it('Should add handlers by Class', function () {
            var logging = new Logging();
            logging.conf({
                layouts: {
                    foo: {
                        x: 42,
                        format: function () {
                        }
                    }
                },
                handlers: {
                    bar: {
                        Class: function (params) {
                            this.layout = params.layout;
                        },
                        params: {
                            layout: 'foo'
                        }
                    }
                }
            });
            assert.strictEqual(logging.layouts.foo.x, 42);
            assert.strictEqual(logging.handlers.bar.layout.x, 42);
        });

        it('Should set enabled handlers', function () {
            var logging = new Logging();
            var handler = {
                x: 42,
                handle: function () {}
            };
            logging.conf({
                enabled: ['foo', 'foo'],
                handlers: {
                    foo: handler
                }
            });

            assert.strictEqual(logging.enabled[0], handler);
            assert.deepEqual(logging.configs.enabled, ['foo']);
        });

        it('Should set logLevel', function () {
            var logging = new Logging();
            logging.conf({
                logLevel: 'XYZ'
            });
            assert.strictEqual(logging.logLevel, 'XYZ');
        });
    });

    it('Should not log anything if logLevel unknown', function () {
        var logging = new Logging();
        logging.logLevel = 'FOOBAR';
        assert.ok(!logging.getLogger().internal());
    });
});
