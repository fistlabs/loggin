/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
var util = require('util');

describe('core/layouts/strf-layout', function () {
    var Layout = require('../core/layouts/strf-layout');
    var Record = require('../core/record/regular');
    var record = new Record();

    describe('layout.template', function () {
        it('Should take template from params', function () {
            var layout = new Layout(record, {
                template: 'foo'
            });
            assert.strictEqual(layout.template, 'foo');
        });
    });

    describe('layout.format(record)', function () {
        it('Should format record vars according to template', function () {
            var layout = new Layout(record, {
                template: '%(message)s'
            });
            var vars = {
                message: ['foo %s', 'bar'],
                context: []
            };
            assert.strictEqual(layout.format(vars), 'foo bar');
        });

        it('Should support inspect extra args', function () {
            var layout = new Layout(record, {
                template: '42'
            });
            var vars = {
                message: ['foo', 'bar'],
                context: []
            };
            assert.strictEqual(layout.format(vars), '42 ' + util.inspect(vars));
        });
    });
});
