/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/record/trace-record', function () {
    var TraceRecord = require('../core/record/trace-record');

    describe('record.getVars()', function () {
        it('Should return expected object', function () {
            function f() {}
            var error = new Error();
            error.name = '';
            Error.captureStackTrace(error, f);
            var record = new TraceRecord(f, 'foo', 'LOG', ['bar']);
            assert.deepEqual(record.getVars(), {
                name: 'foo',
                level: 'LOG',
                process: process.pid,
                asctime: record.asctime,
                message: 'Trace: bar' + error.stack
            });
        });
    });
});
