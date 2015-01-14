/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
// var util = require('util');

describe('core/layout/strf-layout', function () {
    var Layout = require('../core/layout/strf-layout');
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
                message: ['foo %s', 'bar']
            };
            assert.strictEqual(layout.format(vars), 'foo bar');
        });
    });
});
