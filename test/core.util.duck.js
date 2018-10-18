/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash');
var assert = require('assert');

describe('core/util/duck', function () {
    var duck = require('../core/util/duck');

    var record = {create: function () {}};

    var noRecord1 = {};
    var noRecord2 = null;

    var layout = {format: function () {}, record: record};

    var noLayout1 = {record: record};
    var noLayout2 = {format: function () {}, record: noRecord1};
    var noLayout3 = {format: function () {}, record: noRecord2};

    var handler = {handle: function () {}, layout: layout};

    var noHandler1 = {handle: null, layout: layout};
    var noHandler2 = {handle: function () {}, layout: noLayout1};
    var noHandler3 = {handle: function () {}, layout: noLayout2};
    var noHandler4 = {handle: function () {}, layout: noLayout3};

    describe('duck.isRecord', function () {
        it('Should be a record', function () {
            assert.ok(duck.isRecord(record));
        });

        it('Should not be a record', function () {
            assert.ok(!duck.isRecord(noRecord1));
            assert.ok(!duck.isRecord(noRecord2));
        });
    });

    describe('duck.isLayout', function () {
        it('Should be a layout', function () {
            assert.ok(duck.isLayout(layout));
        });

        it('Should not be a layout', function () {
            assert.ok(!duck.isLayout(noLayout1));
            assert.ok(!duck.isLayout(noLayout2));
            assert.ok(!duck.isLayout(noLayout3));
        });
    });

    describe('duck.isHandler', function () {
        it('Should be a handler', function () {
            assert.ok(duck.isHandler(handler));
        });

        it('Should not be a handler', function () {
            assert.ok(!duck.isHandler(noHandler1));
            assert.ok(!duck.isHandler(noHandler2));
            assert.ok(!duck.isHandler(noHandler3));
            assert.ok(!duck.isHandler(noHandler4));
        });
    });

    describe('duck.isLogger', function () {
        var noLogger1 = {};
        var noLogger2 = {context: []};

        noLogger1.logging = noLogger1;
        noLogger1.context = 'foo';

        it('Should be a function', function () {
            assert.ok(_.isFunction(duck.isLogger));
        });

        it('Should be a logger', function () {
            var logger = {context: []};
            logger.logging = logger;
            assert.ok(duck.isLogger(logger));
        });

        it('Should not be a logger', function () {
            assert.ok(!duck.isLogger({}));
            assert.ok(!duck.isLogger(noLogger1));
            assert.ok(!duck.isLogger(noLogger2));
        });
    });
});
