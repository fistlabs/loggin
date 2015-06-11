/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash-node');
var assert = require('assert');

describe('core/layouts/raven-layout', function () {
    var Layout = require('../core/layouts/raven-layout');
    var Record = require('../core/record/regular');

    describe('layout.format(record)', function () {
        it('Should update record.message if the message is not an error', function () {
            var layout = new Layout(new Record(), {
                template: ''
            });
            var vars = {
                message: ['foo %s', 'bar'],
                context: []
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, 'foo bar');
        });

        it('Should not touch message if the message is Error instance', function () {
            var error = new Error();
            var layout = new Layout(new Record(), {
                template: ''
            });
            var vars = {
                message: [error],
                context: []
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, error);
        });

        it('Should use all the rest arguments as meta data if first argument is Error', function () {
            var error = new Error();
            var layout = new Layout(new Record(), {
                template: ''
            });
            var vars = {
                zot: 1,
                message: [error, {foo: 42}, {bar: 11}, {zot: 100500}],
                context: []
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, error);
            assert.strictEqual(vars.foo, 42);
            assert.strictEqual(vars.bar, 11);
            assert.strictEqual(vars.zot, 1);
        });

        it('Should not extend vars with strings', function () {
            var error = new Error();
            var layout = new Layout(new Record(), {
                template: ''
            });
            var vars = {
                message: [error, 'asd', {foo: 42}],
                context: []
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, error);
            assert.strictEqual(vars.foo, 42);
            assert.ok(!_.has(vars, 0));
            assert.ok(!_.has(vars, 1));
            assert.ok(!_.has(vars, 2));
        });

        it('Should extend vars with last arg', function should(done) {
            var layout = new Layout(new Record(), {
                template: ''
            });
            layout._formatRecord = function (vars) {
                assert.strictEqual(vars.foo, 42);
                done();
            };

            layout.format({
                message: ['Some message', {foo: 42}],
                context: []
            });
        });

        it('Should not overwrite built-in record attributes', function should(done) {
            var layout = new Layout(new Record(), {
                template: ''
            });
            layout._formatRecord = function (vars) {
                assert.notStrictEqual(vars.message, 42);
                assert.strictEqual(vars.foo, 11);
                done();
            };
            layout.format({
                message: ['Some message', {message: 42, foo: 11}],
                context: []
            });
        });
    });
});
