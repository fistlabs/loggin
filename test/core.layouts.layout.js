/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/layouts/layout', function () {
    var Layout = require('../core/layouts/layout');
    var Record = require('../core/records/regular');
    var record = new Record();

    describe('layout.format(record)', function () {
        it('Should format record vars', function () {
            var layout = new Layout(record, {
                template: '%(date)s %(message)s',
                dateFormat: 'foo'
            });
            var vars = {
                date: new Date(),
                message: ['bar %s', 'baz'],
                context: []
            };
            assert.strictEqual(layout.format(vars), 'foo bar baz');
        });
    });
});
