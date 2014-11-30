/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/util/strf', function () {
    var strf = require('../core/util/strf');
    describe('strf.format.s', function () {
        var s = strf.format.s;
        it('Should format value as string', function () {
            assert.strictEqual(s('foo'), 'foo');
            assert.strictEqual(s({}), String({}));
        });

        it('Should support precision', function () {
            assert.strictEqual(s('foobar', void 0, void 0, '3'), 'foo');
        });

        it('Should support width', function () {
            assert.strictEqual(s('foo', void 0, '5'), '  foo');
        });

        it('Should support "-" sign', function () {
            assert.strictEqual(s('foo', '-', '5'), 'foo  ');
        });
    });

    describe('strf.format.j', function () {
        var j = strf.format.j;

        it('Should stringify JSON', function () {
            assert.strictEqual(j({}), '{}');
        });

        it('Should not fail on circular JSON', function () {
            var o = {};
            o.o = o;
            assert.strictEqual(j(o), '[Circular]');
        });

        it('Should support sign, width, precision like "s"', function () {
            assert.strictEqual(j({foo: 'bar'}, '-', '5', '3'), '{"f  ');
        });
    });

    describe('strf.format.d', function () {
        var d = strf.format.d;

        it('Should format as Number', function () {
            assert.strictEqual(d('5'), '5');
        });

        it('Should add "-" to negative numbers', function () {
            assert.strictEqual(d('-5'), '-5');
        });

        it('Should support "+" sign', function () {
            assert.strictEqual(d('-5', '+'), '-5');
            assert.strictEqual(d('-5', '-'), '-5');
            assert.strictEqual(d('5', '+'), '+5');
        });

        it('Should support precision', function () {
            assert.strictEqual(d('5', void 0, void 0, '3'), '005');
        });

        it('Should support "-" sign for width', function () {
            assert.strictEqual(d('5', '-', '3', void 0), '5  ');
        });

        it('Should left padded by "0" if width starts with "0"', function () {
            assert.strictEqual(d('5', '+', '03', void 0), '+05');
            assert.strictEqual(d('5', void 0, '03', void 0), '005');
        });

        it('Should left padded by " " according to width', function () {
            assert.strictEqual(d('5', void 0, '3', void 0), '  5');
        });

        it('Precision should not be trimmed by width', function () {
            assert.strictEqual(d('5', void 0, '3', '5'), '00005');
        });
    });

    describe('strf.format', function () {
        var format = strf.format;

        it('Should interpret "%%" sequences as "%"', function () {
            assert.strictEqual(format(['%%%%']), '%%');
        });

        it('Should interpret single unmatched "%" as "%"', function () {
            assert.strictEqual(format(['%']), '%');
            assert.strictEqual(format(['foo%']), 'foo%');
        });

        it('Should format placeholders according to type', function () {
            assert.strictEqual(format(['%s, %d, %j, %%s', 'foo', 42, {}]), 'foo, 42, {}, %s');
        });

        it('Should support kwargs', function () {
            assert.strictEqual(format(['%s, %d, %(foo)s, %%s', 'foo', 42, {foo: 'bar'}]), 'foo, 42, bar, %s');
        });

        it('Should not skip undefined values', function () {
            assert.strictEqual(format(['%s, %s, %(foo)s', 'foo', void 0, {}]), 'foo, undefined, undefined');
        });

        it('Should skip unsupported types', function () {
            assert.strictEqual(format(['%h']), '%h');
        });

        it('Should inspect extra args', function () {
            assert.strictEqual(format(['%s', 'foo', 'bar']), 'foo bar');
            assert.strictEqual(format(['%s', 'foo', {}]), 'foo {}');
            assert.strictEqual(format([{}, 'foo', {}]), '{} foo {}');
        });

        it('Should specially inspect errors', function () {
            var e = new Error();
            e.stack = 's';
            assert.strictEqual(format([e]), 's');
            assert.strictEqual(format([e, e, 1, e, 2]), 's\ns\n1\ns\n2');
            assert.strictEqual(format([e, e, {}]), 's\ns\n{}');
        });

        it('Should do nothing if no arguments passed', function () {
            assert.strictEqual(format([]), '');
        });

        it('Should not inspect kwargs as extra argument', function () {
            assert.strictEqual(format(['%(foo)s', 'bar', {foo: 'foo'}]), 'foo bar');
        });
    });

    describe('strf', function () {
        it('Should give format arguments separately', function () {
            assert.strictEqual(strf('%(foo)s', {foo: 'foo'}), 'foo');
        });

        it('Should support deep kwargs', function () {
            assert.strictEqual(strf('Hello, %(who[1])s!', {who: ['nobody', 'golyshevd']}), 'Hello, golyshevd!');
            assert.strictEqual(strf('Hello, %(["who"][1])s!', {who: ['nobody', 'golyshevd']}), 'Hello, golyshevd!');
        });
    });

});
