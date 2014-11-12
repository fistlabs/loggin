/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/record/sprintf-record', function () {
    var SprintfRecord = require('../core/record/sprintf-record');

    describe('record.getVars()', function () {
        it('Should return expected object', function () {
            var record = new SprintfRecord(function () {}, 'foo', 'LOG', ['Hi %s!', 'all']);
            assert.deepEqual(record.getVars(), {
                name: 'foo',
                level: 'LOG',
                process: process.pid,
                asctime: record.asctime,
                message: 'Hi all!'
            });
        });
    });
});
