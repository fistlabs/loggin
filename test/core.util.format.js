/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');
var util = require('util');

describe('core/util/format', function () {
    var format = require('../core/util/format');

    it('Should format message as sprintf', function () {
        assert.strictEqual(format(['Hi %s!', 'foo']), 'Hi foo!');
    });

    it('Should append extra args at end of result', function () {
        assert.strictEqual(format(['Hi %s!', 'foo', 'bar']), 'Hi foo! bar');
    });

    it('Should inspect extra args if object', function () {
        assert.strictEqual(format(['Hi %s!', 'foo', {bar: 'zot'}]),
            'Hi foo! ' + util.inspect({bar: 'zot'}));
    });

    it('Should inspect all args if no pattern specified', function () {
        assert.strictEqual(format([{foo: 'bar'}, {zot: 'xyz'}]),
            util.inspect({foo: 'bar'}) + ' ' + util.inspect({zot: 'xyz'}));
    });

    it('Should do nothing if no args passed', function () {
        assert.strictEqual(format([]), '');
    });

    it('Should print stack instead of error object', function () {
        var actual = format([new Error()]);
        assert.ok(/^Error\b[\s\S]+$/.test(actual));
    });

    it('Should correctly print errors in different positions', function () {
        var actual;
        actual = format([new Error(), 'foo', new Error()]);
        assert.ok(/^Error\b[\s\S]+\nfoo\nError\b[\s\S]+$/.test(actual));
        actual = format([new Error(), 'foo', 'bar', new Error(), 'zot']);
        assert.ok(/^Error\b[\s\S]+\nfoo\s+bar\nError\b[\s\S]+\nzot$/.test(actual));
        actual = format([new Error(), new Error()]);
        assert.ok(/^Error\b[\s\S]+\nError\b[\s\S]+$/.test(actual));
        actual = format([new Error(), {}]);
        assert.ok(/^Error\b[\s\S]+\n\{}$/.test(actual));
    });
});
