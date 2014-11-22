/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
var st = require('stack-trace');
var path = require('path');
var main = require('../core/util/main');

describe('core/record', function () {
    var Record = require('../core/record');

    describe('record.getVars()', function () {
        it('Should return expected object', function should() {

            function createRecord() {

                return new Record('foo', 'LOG', should, ['Hi %s!', 'all']);
            }

            var record = createRecord();
            var vars = record.getVars();

            assert.strictEqual(typeof vars.module, 'function');

            assert.deepEqual(vars, {
                context: 'foo',
                level: 'LOG',
                date: record.date,
                message: 'Hi all!',
                module: vars.module
            });

            assert.strictEqual(typeof vars.module(), 'string');
            assert.strictEqual(vars.module(),
                path.relative(main.dirname, st.get(should)[0].getFileName()));
        });
    });
});
