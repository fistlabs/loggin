/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
var util = require('util');

describe('core/layouts/asis-layout', function () {
    var Layout = require('../core/layouts/asis-layout');
    var Record = require('../core/record/regular');

    var record = new Record();

    describe('layout.record', function () {
        it('Should taker record as first argument', function () {
            var layout = new Layout(record);
            assert.strictEqual(layout.record, record);
        });
    });

    describe('layout.params', function () {
        it('Should taker params as second argument', function () {
            var params = {};
            var layout = new Layout(record, params);
            assert.strictEqual(layout.params, params);
        });

        it('Should create empty params if omitted', function () {
            var layout = new Layout(record);
            assert.ok(layout.params);
        });
    });

    describe('layout.format(record)', function () {
        it('Should update record.message', function () {
            var layout = new Layout(record, {
                template: ''
            });
            var vars = {
                message: ['foo %s', 'bar'],
                context: []
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, 'foo bar');
        });

        it('Should specially inspect errors', function () {
            var layout = new Layout(record, {
                template: '',
                showStackTraces: true
            });
            var e = new Error();
            e.stack = 's';
            var vars = {
                message: ['%s', 'x', 1, e],
                context: []
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, 'x 1 ' + e.stack);
        });

        it('Should NOT specially inspect errors', function () {
            var layout = new Layout(record, {
                template: ''
            });
            var e = new Error();
            e.stack = 's';
            var vars = {
                message: ['%s', 'x', 1, e],
                context: []
            };
            vars = layout.format(vars);
            assert.strictEqual(vars.message, 'x 1 ' + util.inspect(e));
        });

    });
});
