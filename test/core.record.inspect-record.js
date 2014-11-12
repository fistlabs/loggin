/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
var util = require('util');

describe('core/record/inspect-record', function () {
    var InspectRecord = require('../core/record/inspect-record');

    describe('record.getVars()', function () {
        it('Should return expected object', function () {
            var record = new InspectRecord(function () {}, 'foo', 'LOG', [{}, 42]);
            assert.deepEqual(record.getVars(), {
                name: 'foo',
                level: 'LOG',
                process: process.pid,
                asctime: record.asctime,
                message: util.inspect({}) + ' ' + util.inspect(42)
            });
        });
    });
});
