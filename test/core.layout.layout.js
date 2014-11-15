/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
// var util = require('util');

describe('core/layout/layout', function () {
    var Layout = require('../core/layout/layout');

    describe('layout.format(record)', function () {
        it('Should format record vars', function () {
            var layout = new Layout({
                template: '%(date)s %(message)s\n',
                dateFormat: 'foo'
            });
            var vars = {
                date: new Date(),
                message: 'bar\nbaz'
            };
            assert.strictEqual(layout.format(vars), 'foo bar\nfoo baz\n');
        });
    });
});
