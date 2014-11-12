/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/config', function () {
    var Config = require('../core/config');
    var Layout = require('../core/layout/layout');
    var Handler = require('../core/handler/stream-handler');
    var StdLogging = /** @type Logging*/ require('../core/logging');

    function Logging() {
        StdLogging.apply(this, arguments);
    }

    Logging.prototype = Object.create(StdLogging.prototype);

    Logging.prototype.getLevel = function () {
        return this._level;
    };

    Logging.prototype.getLevels = function () {
        return this._levels;
    };

    var layoutClassPath = './layout/layout';
    var layoutParams = {strf: '', strftime: ''};
    var layout = new Layout(layoutParams);
    var layoutPathDecl = {
        Class: layoutClassPath,
        params: layoutParams
    };
    var layoutClassDecl = {
        Class: Layout,
        params: layoutParams
    };
    var handlerClassPath = './handler/stream-handler';
    var handlerParams = {
        stream: {write: function () {}},
        streams: {}
    };
    var handler = new Handler(handlerParams, layout);
    var handlerClassDecl = {
        Class: Handler,
        params: handlerParams,
        layout: 'layout'
    };
    var handlerPathDecl = {
        Class: handlerClassPath,
        params: handlerParams,
        layout: 'layout'
    };
    var loggingClassPath = './logging';
    var loggingClassDecl = {
        Class: Logging,
        level: 'DEBUG',
        levels: {
            DEBUG: 1
        },
        handlers: ['handler'],
        records: {
            debug: {
                level: 'DEBUG',
                Class: require('../core/record/sprintf-record')
            }
        }
    };
    var loggingPathDecl = {
        Class: loggingClassPath,
        level: 'DEBUG',
        levels: {
            DEBUG: 1
        },
        handlers: ['handler'],
        records: {
            debug: {
                level: 'DEBUG',
                Class: './record/sprintf-record'
            }
        }
    };
    var logging = new Logging();

    describe('config.addLayouts', function () {
        it('Should add layouts by instances', function () {
            var config = new Config();
            var layout = new Layout({strf: '', strftime: ''});
            config.addLayouts({
                foo: layout,
                bar: layout
            });

            assert.strictEqual(config.layouts.foo, layout);
            assert.strictEqual(config.layouts.bar, layout);
        });

        it('Should add layouts by Class+params', function () {
            var config = new Config();
            config.addLayouts({
                foo: layoutClassDecl,
                bar: layoutClassDecl
            });

            assert.ok(config.layouts.foo instanceof Layout);
            assert.ok(config.layouts.bar instanceof Layout);
        });

        it('Should add layouts by path+params', function () {
            var config = new Config();
            config.addLayouts({
                foo: layoutPathDecl,
                bar: layoutPathDecl
            });

            assert.ok(config.layouts.foo instanceof Layout);
            assert.ok(config.layouts.bar instanceof Layout);
        });
    });

    describe('config.addHandlers', function () {
        it('Should add handlers by instances', function () {
            var config = new Config();
            config.addHandlers({
                foo: handler,
                bar: handler
            });
            assert.strictEqual(config.handlers.foo, handler);
            assert.strictEqual(config.handlers.bar, handler);
        });
        it('Should add handlers by Class+params', function () {
            var config = new Config();
            config.addLayouts({
                layout: layout
            });
            config.addHandlers({
                foo: handlerClassDecl,
                bar: handlerClassDecl
            });
            assert.ok(config.handlers.foo instanceof Handler);
            assert.ok(config.handlers.bar instanceof Handler);
        });
        it('Should add handler by path+params', function () {
            var config = new Config();
            config.addLayouts({
                layout: layout
            });
            config.addHandlers({
                foo: handlerPathDecl,
                bar: handlerPathDecl
            });
            assert.ok(config.handlers.foo instanceof Handler);
            assert.ok(config.handlers.bar instanceof Handler);
        });
    });

    describe('config.addLoggings', function () {
        it('Should add loggings by instances', function () {
            var config = new Config();
            config.addLoggings({
                foo: logging,
                bar: logging
            });
            assert.strictEqual(config.loggings.foo, logging);
            assert.strictEqual(config.loggings.bar, logging);
        });
        it('Should add loggings by Class+params', function () {
            var config = new Config();
            config.addHandlers({
                handler: handler
            });
            config.addLoggings({
                foo: loggingClassDecl,
                bar: loggingClassDecl
            });
            assert.ok(config.loggings.foo instanceof StdLogging);
            assert.ok(config.loggings.bar instanceof StdLogging);
            assert.strictEqual(typeof config.loggings.foo.Logger.prototype.debug, 'function');
            assert.strictEqual(typeof config.loggings.bar.Logger.prototype.debug, 'function');
            assert.strictEqual(config.loggings.bar.getLevel(), 'DEBUG');
            assert.deepEqual(config.loggings.bar.getLevels(), {
                DEBUG: 1
            });
        });
        it('Should add loggings by path+params', function () {
            var config = new Config();
            config.addHandlers({
                handler: handler
            });
            config.addLoggings({
                foo: loggingPathDecl,
                bar: loggingPathDecl
            });
            assert.ok(config.loggings.foo instanceof StdLogging);
            assert.ok(config.loggings.bar instanceof StdLogging);
            assert.strictEqual(typeof config.loggings.foo.Logger.prototype.debug, 'function');
            assert.strictEqual(typeof config.loggings.bar.Logger.prototype.debug, 'function');
        });
    });

    describe('config.configure', function () {
        it('Should merge configs', function () {
            function write() {}
            var config = new Config();
            config.configure({
                loggings: {
                    foo: {
                        Class: Logging,
                        level: 'FOO',
                        levels: {
                            FOO: 42
                        },
                        handlers: ['foo']
                    }
                },
                handlers: {
                    foo: {
                        Class: Handler,
                        params: {
                            stream: {write: write},
                            streams: {}
                        },
                        layout: 'foo'
                    }
                },
                layouts: {
                    foo: {
                        Class: Layout,
                        params: {
                            strf: '',
                            strftime: ''
                        }
                    }
                }
            });
            assert.deepEqual(config.configs, {
                loggings: {
                    foo: {
                        Class: Logging,
                        level: 'FOO',
                        levels: {
                            FOO: 42
                        },
                        handlers: ['foo']
                    }
                },
                handlers: {
                    foo: {
                        Class: Handler,
                        params: {
                            stream: {write: write},
                            streams: {}
                        },
                        layout: 'foo'
                    }
                },
                layouts: {
                    foo: {
                        Class: Layout,
                        params: {
                            strf: '',
                            strftime: ''
                        }
                    }
                }
            });
            assert.ok(config.loggings.foo instanceof Logging);
            assert.ok(config.handlers.foo instanceof Handler);
            assert.ok(config.layouts.foo instanceof Layout);
            config.configure({
                layouts: {
                    bar: {
                        Class: Layout,
                        params: {
                            strf: '',
                            strftime: ''
                        }
                    }
                }
            });
            assert.ok(config.loggings.foo instanceof Logging);
            assert.ok(config.handlers.foo instanceof Handler);
            assert.ok(config.layouts.foo instanceof Layout);
            assert.ok(config.layouts.bar instanceof Layout);
        });
    });
});
