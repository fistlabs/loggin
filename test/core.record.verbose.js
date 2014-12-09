/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/record/context', function () {
    var Record = require('../core/record/verbose');
    var record = new Record();

    describe('record.create()', function () {
        it('Should return expected object', function should() {
            var vars = record.create('foo', 'LOG', should, ['Hi %s!', 'all']);

            assert.strictEqual(vars.context, 'foo');
            assert.strictEqual(vars.level, 'LOG');
            assert.ok(vars.date instanceof Date);
            assert.deepEqual(vars.message, ['Hi %s!', 'all']);
            assert.strictEqual(vars.process, process.pid);
            assert.strictEqual(typeof vars.filename, 'string');
            assert.ok(vars.callsite);
            assert.strictEqual(typeof vars.line, 'number');
            assert.strictEqual(typeof vars.column, 'number');
        });
    });
});
