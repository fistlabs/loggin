/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/layout/raven-layout', function () {
    var Layout = require('../core/layout/raven-layout');
    var Record = require('../core/record/regular');
    var record = new Record();

    describe('layout.format(record)', function () {
        it('Should update record.message if the message is not an error', function () {
            var layout = new Layout(record, {
                template: ''
            });
            var vars = {
                message: ['foo %s', 'bar']
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, 'foo bar');
        });

        it('Should not touch message if the message is Error instance', function () {
            var error = new Error();
            var layout = new Layout(record, {
                template: ''
            });
            var vars = {
                message: [error]
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, error);
        });

        it('Should use all the rest arguments as meta data if first argument is Error', function () {
            var error = new Error();
            var layout = new Layout(record, {
                template: ''
            });
            var vars = {
                zot: 1,
                message: [error, {foo: 42}, {bar: 11}, {zot: 100500}]
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, error);
            assert.strictEqual(vars.foo, 42);
            assert.strictEqual(vars.bar, 11);
            assert.strictEqual(vars.zot, 1);
        });
    });
});
