/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/record/context', function () {
    var Record = require('../core/record/context');
    var record = new Record();

    describe('record.create()', function () {
        it('Should return expected object', function should() {
            var vars = record.create('foo', 'LOG', should, ['Hi %s!', 'all']);

            assert.deepEqual(vars, {
                context: 'foo',
                level: 'LOG',
                date: vars.date,
                message: ['Hi %s!', 'all'],
                filename: vars.filename,
                module: vars.module,
                callsite: vars.callsite,
                line: vars.line,
                column: vars.column
            });
        });
    });
});
