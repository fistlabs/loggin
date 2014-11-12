/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/handler/stream-handler', function () {
    var Layout = require('../core/layout/layout');
    var Handler = require('../core/handler/stream-handler');
    var layout = new Layout({
        strf: 'foo\n',
        strftime: 'bar'
    });
    var writable = {
        write: function () {}
    };
    describe('new Handler()', function () {
        it('Should throw an Error if layout is not set', function () {
            assert.throws(function () {
                return new Handler({}, 'NOT A Layout instance');
            });
        });

        it('Should throw an Error if params.stream has no Writable interface', function () {
            assert.throws(function () {
                return new Handler({}, layout);
            });

            assert.throws(function () {
                return new Handler({stream: {}}, layout);
            });

            assert.throws(function () {
                return new Handler({stream: {write: 1}}, layout);
            });
        });

        it('Should throw an error if params.streams has not Writable interfaces', function () {
            assert.throws(function () {
                return new Handler({stream: writable}, layout);
            });
            assert.throws(function () {
                return new Handler({stream: writable, streams: {LOG: 1}}, layout);
            });
            assert.throws(function () {
                return new Handler({stream: writable, streams: {LOG: {}}}, layout);
            });
            assert.throws(function () {
                return new Handler({stream: writable, streams: {LOG: {write: 1}}}, layout);
            });
        });
    });

    describe('handler.handle()', function () {
        it('Should write to default stream', function () {
            var spy = [];
            var handler = new Handler({
                stream: {
                    write: function (m) {
                        spy.push(m);
                    }
                },
                streams: {}
            }, layout);
            handler.handle({level: 'LOG', message: 'xyz'});
            handler.handle({level: 'INFO', message: 'xyz'});
            assert.deepEqual(spy, ['foo\n', 'foo\n']);
        });

        it('Should write to stream by level', function () {
            var spy1 = [];
            var spy2 = [];
            var spy3 = [];
            var handler = new Handler({
                stream: {
                    write: function (m) {
                        spy1.push(m);
                    }
                },
                streams: {
                    LOG: {
                        write: function (m) {
                            spy2.push(m);
                        }
                    },
                    INFO: {
                        write: function (m) {
                            spy3.push(m);
                        }
                    }
                }
            }, new Layout({
                strftime: 't',
                strf: '%(message)s\n'
            }));
            handler.handle({level: 'LOG', message: 'x'});
            handler.handle({level: 'INFO', message: 'y'});
            handler.handle({level: 'DEBUG', message: 'z'});
            assert.deepEqual(spy1, ['z\n']);
            assert.deepEqual(spy3, ['y\n']);
            assert.deepEqual(spy2, ['x\n']);
        });
    });

});
