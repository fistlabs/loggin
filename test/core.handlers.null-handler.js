/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/handlers/null-handler', function () {
    var NullHandler = require('../core/handlers/null-handler');
    var layout = {};

    describe('handler.layout', function () {
        it('Should take layout as first argument', function () {
            var handler = new NullHandler(layout);
            assert.strictEqual(handler.layout, layout);
        });
    });

    describe('handler.params', function () {
        it('Should take params as second argument', function () {
            var params = {};
            var handler = new NullHandler(layout, params);
            assert.strictEqual(handler.params, params);
        });

        it('Should create empty params if omitted', function () {
            var handler = new NullHandler(layout);
            assert.ok(handler.params);
        });
    });

    describe('handler.minLevel', function () {
        it('Should taker minLevel from params', function () {
            var handler = new NullHandler(layout, {minLevel: 'LOG'});
            assert.strictEqual(handler.minLevel, 'LOG');
        });
    });

    describe('handler.maxLevel', function () {
        it('Should taker maxLevel from params', function () {
            var handler = new NullHandler(layout, {maxLevel: 'LOG'});
            assert.strictEqual(handler.maxLevel, 'LOG');
        });
    });

    describe('handler.handle', function () {
        it('Should do nothing', function () {
            var handler = new NullHandler(layout);
            assert.strictEqual(handler.handle(), void 0);
        });
    });
});
