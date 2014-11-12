/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
// var util = require('util');

describe('core/layout/layout', function () {
    var Layout = require('../core/layout/layout');

    describe('Layout', function () {

        it('Should throw an error if no params.strf specified', function () {
            assert.throws(function () {
                return new Layout({
                    strftime: 'foo'
                });
            });
        });

        it('Should throw an error if no params.strftime specified', function () {
            assert.throws(function () {
                return new Layout({
                    strf: 'foo'
                });
            });
        });

        describe('layout.params', function () {
            it('Should be an object', function () {
                var layout = new Layout({
                    strf: 'foo',
                    strftime: 'foo'
                });
                assert.ok(layout.params);
                assert.strictEqual(typeof layout.params, 'object');
            });
        });
    });

    describe('layout.format(record)', function () {
        it('Should format record vars', function () {
            var layout = new Layout({
                strf: '%(asctime)s %(message)s\n',
                strftime: 'foo'
            });
            var vars = {
                asctime: new Date(),
                message: 'bar\nbaz'
            };
            assert.strictEqual(layout.format(vars), 'foo bar\nfoo baz\n');
        });
    });
});
