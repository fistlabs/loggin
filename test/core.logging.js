/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/logging', function () {
    var Layout = require('../core/layouts/layout');
    var Logger = require('../core/logger');
    var Handler = /** @type Handler */ require('../core/handlers/stream-handler');
    var StdLogging = /** @type Logging */ require('../core/logging');

    function Logging() {
        StdLogging.apply(this, arguments);
    }

    Logging.prototype = Object.create(StdLogging.prototype);

    function SpyLayout() {
        this.record = {
            create: function (context, level, caller, args) {
                return args[0];
            }
        };
    }

    SpyLayout.prototype = Object.create(Layout.prototype);

    SpyLayout.prototype.format = function (vars) {
        return vars;
    };

    function SpyHandler(layout) {
        this.spy = [];
        this.layout = layout;
    }

    SpyHandler.prototype = Object.create(Handler.prototype);

    SpyHandler.prototype.handle = function (message) {
        this.spy.push(message);
    };

    describe('new Logging()', function () {
        it('Should be an instance of Logging', function () {
            var logging = new Logging();
            assert.ok(logging instanceof Logging);
        });

        it('Should be an instance of Logger', function () {
            var logging = new Logging();
            assert.ok(logging instanceof Logger);
        });
    });

    describe('logging.enabledLevels', function () {
        it('Should have all disabled by default', function () {
            var logging = new Logging();
            var enabledLevels = logging.enabledLevels;
            assert.ok(!enabledLevels.INTERNAL);
            assert.ok(!enabledLevels.DEBUG);
            assert.ok(!enabledLevels.NOTE);
            assert.ok(!enabledLevels.INFO);
            assert.ok(!enabledLevels.LOG);
            assert.ok(!enabledLevels.WARNING);
            assert.ok(!enabledLevels.ERROR);
            assert.ok(!enabledLevels.FATAL);
        });

        it('Should rebuild enabledLevels by setting logLevel', function () {
            var logging = new Logging();
            var enabledLevels = logging.enabledLevels;

            logging.logLevel = 'INTERNAL';

            assert.ok(enabledLevels.INTERNAL);
            assert.ok(enabledLevels.DEBUG);
            assert.ok(enabledLevels.NOTE);
            assert.ok(enabledLevels.INFO);
            assert.ok(enabledLevels.LOG);
            assert.ok(enabledLevels.WARNING);
            assert.ok(enabledLevels.ERROR);
            assert.ok(enabledLevels.FATAL);

            logging.logLevel = 'DEBUG';

            assert.ok(!enabledLevels.INTERNAL);
            assert.ok(enabledLevels.DEBUG);
            assert.ok(enabledLevels.NOTE);
            assert.ok(enabledLevels.INFO);
            assert.ok(enabledLevels.LOG);
            assert.ok(enabledLevels.WARNING);
            assert.ok(enabledLevels.ERROR);
            assert.ok(enabledLevels.FATAL);

            logging.logLevel = 'LOG';

            assert.ok(!enabledLevels.INTERNAL);
            assert.ok(!enabledLevels.DEBUG);
            assert.ok(!enabledLevels.NOTE);
            assert.ok(!enabledLevels.INFO);
            assert.ok(enabledLevels.LOG);
            assert.ok(enabledLevels.WARNING);
            assert.ok(enabledLevels.ERROR);
            assert.ok(enabledLevels.FATAL);

            logging.logLevel = 'FATAL';

            assert.ok(!enabledLevels.INTERNAL);
            assert.ok(!enabledLevels.DEBUG);
            assert.ok(!enabledLevels.NOTE);
            assert.ok(!enabledLevels.INFO);
            assert.ok(!enabledLevels.LOG);
            assert.ok(!enabledLevels.WARNING);
            assert.ok(!enabledLevels.ERROR);
            assert.ok(enabledLevels.FATAL);

            logging.logLevel = 'SILENT';

            assert.ok(!enabledLevels.INTERNAL);
            assert.ok(!enabledLevels.DEBUG);
            assert.ok(!enabledLevels.NOTE);
            assert.ok(!enabledLevels.INFO);
            assert.ok(!enabledLevels.LOG);
            assert.ok(!enabledLevels.WARNING);
            assert.ok(!enabledLevels.ERROR);
            assert.ok(!enabledLevels.FATAL);
        });
    });

    describe('logging.record', function () {

        it('Should return level match result', function f() {
            var logging = new Logging();
            logging.logLevel = 'INFO';
            assert.ok(!logging.record('foo', 'DEBUG', f, []));
            assert.ok(logging.record('foo', 'INFO', f, []));
        });

        it('Should handle record if level match only', function () {
            var logger = new Logging();
            logger.logLevel = 'INFO';
            var handler = new SpyHandler(new SpyLayout());
            logger.configs.enabled = ['foo'];
            logger.handlers.foo = handler;

            assert.ok(!logger.debug('1'));
            assert.ok(logger.info('2'));
            assert.ok(!logger.internal('3'));
            assert.ok(logger.error('4'));

            assert.deepEqual(handler.spy, ['2', '4']);
        });

        it('Should ignore handlers which minLevel higher than record level', function () {
            var logger = new Logging();
            var spy = [];
            logger.logLevel = 'INFO';
            logger.configs.enabled = ['foo'];
            logger.handlers.foo = {
                minLevel: 'LOG',
                handle: function (message) {
                    spy.push(message);
                },
                layout: new SpyLayout()
            };

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
                        record: {create: function () {}},
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
                        Class: './layouts/layout',
                        record: 'r',
                        kwargs: {
                            template: 'foox'
                        }
                    }
                },
                records: {
                    r: {create: function () {}}
                }
            });
            assert.strictEqual(logging.layouts.foo.template, 'foox');
        });

        it('Should add layouts by Class', function () {
            var logging = new Logging();
            logging.conf({
                layouts: {
                    foo: {
                        Class: function (record, params) {
                            this.record = record;
                            this.template = params.template + 'x';
                            this.format = function () {};
                        },
                        record: 'r',
                        kwargs: {
                            template: 'foo'
                        }
                    }
                },
                records: {
                    r: {create: function () {}}
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
                        handle: function () {},
                        layout: new SpyLayout()
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
                        format: function () {},
                        record:  {create: function () {}}
                    }
                },
                handlers: {
                    bar: {
                        Class: './handlers/stream-handler',
                        layout: 'foo'
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
                        format: function () {},
                        record: {create: function () {}}
                    }
                },
                handlers: {
                    bar: {
                        Class: function (layout) {
                            this.layout = layout;
                            this.handle = function () {};
                        },
                        layout: 'foo',
                        kwargs: {}
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
                handle: function () {},
                layout: new SpyLayout()
            };
            logging.conf({
                enabled: ['foo', 'foo'],
                handlers: {
                    foo: handler
                }
            });

            assert.strictEqual(logging.configs.enabled[0], 'foo');
            assert.deepEqual(logging.configs.enabled, ['foo']);

            logging.conf({
                enabled: 'foo'
            });

            assert.strictEqual(logging.configs.enabled[0], 'foo');
            assert.deepEqual(logging.configs.enabled, ['foo']);
        });

        it('Should set logLevel', function () {
            var logging = new Logging();
            logging.conf({
                logLevel: 'XYZ'
            });
            assert.strictEqual(logging.logLevel, 'XYZ');
        });

        it('Should throw on invalid record definition', function () {
            assert.throws(function () {
                return new Logging().conf({
                    records: {x: 42}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    records: {x: {Class: 'foo'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    records: {x: {Class: './core/logging'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    records: {x: {Class: function () {}}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    records: {x: {Class: 'util'}}
                });
            });
        });

        it('Should throw on invalid layout definitions', function () {
            assert.throws(function () {
                return new Logging().conf({
                    layouts: {x: 42}
                });
            });
            assert.throws(function () {
                return new Logging().conf({
                    layouts: {x: {Class: 'foo'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    layouts: {x: {Class: 'util'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    layouts: {x: {Class: function () {}, record: 'foo'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    layouts: {x: {Class: function () {}, record: 'foo'}},
                    records: {foo: {create: function () {}}}
                });
            });
        });

        it('Should throw on invalid handler definition', function () {
            assert.throws(function () {
                return new Logging().conf({
                    handlers: {x: 42}
                });
            });
            assert.throws(function () {
                return new Logging().conf({
                    handlers: {x: {Class: 'foo'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    handlers: {x: {Class: 'util'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    handlers: {x: {Class: function () {}, layout: 'foo'}}
                });
            });

            assert.throws(function () {
                return new Logging().conf({
                    handlers: {x: {Class: function () {}, layout: 'foo'}},
                    layouts: {foo: {format: function () {}, record: {create: function () {}}}}
                });
            });
        });

        it('Should throw on invalid enabled cofiguration', function () {

            assert.throws(function () {
                return new Logging().conf({
                    enabled: ['foo']
                });
            });
        });
    });

    it('Should not log anything if logLevel unknown', function () {
        var logging = new Logging();
        logging.logLevel = 'FOOBAR';
        assert.ok(!logging.internal());
    });
});
