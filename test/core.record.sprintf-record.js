/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/record', function () {
    var Record = require('../core/record');

    describe('record.getVars()', function () {
        it('Should return expected object', function () {
            var record = new Record('foo', 'LOG', ['Hi %s!', 'all']);
            assert.deepEqual(record.getVars(), {
                name: 'foo',
                level: 'LOG',
                process: process.pid,
                date: record.date,
                message: 'Hi all!'
            });
        });
    });
});
