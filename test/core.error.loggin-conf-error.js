/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/error/loggin-conf-error', function () {
    var LogginConfError = require('../core/error/loggin-conf-error');
    it('Should be an instance of LogginConfError', function () {
        assert.ok(new LogginConfError() instanceof LogginConfError);
    });

    it('Should have name "LogginConfError"', function () {
        var e = new LogginConfError();
        assert.strictEqual(e.name, 'LogginConfError');
    });

    it('Should have a message', function () {
        var e = new LogginConfError('foo');
        assert.strictEqual(e.message, 'foo');
    });

    it('Should have a stack', function () {
        var e = new LogginConfError('foo');
        assert.strictEqual(typeof e.stack, 'string');
    });

    it('Should be an instance of Error', function () {
        assert.ok(new LogginConfError() instanceof Error);
    });
});
