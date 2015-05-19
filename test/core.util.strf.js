/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/util/strf', function () {
    var strf = require('../core/util/strf');

    describe('%s', function () {
        var s = strf._types.s.bind(strf._types);

        it('Should format value as string', function () {
            assert.strictEqual(s('foo'), 'foo');
            assert.strictEqual(s({}), String({}));
        });

        it('Should support precision', function () {
            assert.strictEqual(s('foobar', void 0, void 0, void 0, '3'), 'foo');
        });

        it('Should support width', function () {
            assert.strictEqual(s('foo', void 0, void 0, '5'), '  foo');
        });

        it('Should support fill', function () {
            assert.strictEqual(s('foo', void 0, 'x', '5'), 'xxfoo');
            assert.strictEqual(s('foo', void 0, '0', '5'), '00foo');
            assert.strictEqual(s('foo', void 0, ':', '5'), '::foo');
        });

        it('Should support "-" sign', function () {
            assert.strictEqual(s('foo', '-', ' ', '5'), 'foo  ');
        });
    });

    describe('%j', function () {
        var j = strf._types.j.bind(strf._types);

        it('Should stringify JSON', function () {
            assert.strictEqual(j({}), '{}');
        });

        it('Should not fail on circular JSON', function () {
            var o = {};
            o.o = o;
            assert.strictEqual(j(o), '[Circular]');
        });

        it('Should support sign, width, precision like "s"', function () {
            assert.strictEqual(j({foo: 'bar'}, '-', ' ', '5', '3'), '{"f  ');
        });
    });

    describe('%d', function () {
        var d = strf._types.d.bind(strf._types);

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
            assert.strictEqual(d('5', void 0, void 0, void 0, '3'), '005');
        });

        it('Should support "-" sign for width', function () {
            assert.strictEqual(d('5', '-', ' ', '3', void 0), '5  ');
        });

        it('Should support fill', function () {
            assert.strictEqual(d('5', '+', 'x', '3', void 0), 'x+5');
        });

        it('Should left padded by " " according to width', function () {
            assert.strictEqual(d('5', void 0, ' ', '3', void 0), '  5');
        });

        it('Precision should not be trimmed by width', function () {
            assert.strictEqual(d('5', void 0, void 0, '3', '5'), '00005');
        });
    });

    describe('strf.format', function () {
        var format = strf.format.bind(strf);

        it('Should interpret "%%" sequences as "%"', function () {
            assert.strictEqual(format('%%%%'), '%%');
        });

        it('Should interpret single unmatched "%" as "%"', function () {
            assert.strictEqual(format('%'), '%');
            assert.strictEqual(format('foo%'), 'foo%');
        });

        it('Should format placeholders according to type', function () {
            assert.strictEqual(format('%s, %d, %j, %%s', 'foo', 42, {}), 'foo, 42, {}, %s');
        });

        it('Should support kwargs', function () {
            assert.strictEqual(format('%s, %d, %(foo)s, %%s', 'foo', 42, {foo: 'bar'}), 'foo, 42, bar, %s');
        });

        it('Should use the last argument as kwargs', function () {
            assert.strictEqual(format('%s %(foo)s %s', 1, 2, 3, 4, {foo: 'bar'}), '1 bar 2 3 4');
        });

        it('Should correctly choose kwargs argument', function () {
            assert.strictEqual(format('%y %(foo)s', {foo: 'bar'}), '%y bar');
        });

        it('Should not skip undefined values', function () {
            assert.strictEqual(format('%s, %s, %(foo)s', 'foo', void 0, {}), 'foo, undefined, undefined');
        });

        it('Should skip unsupported types', function () {
            assert.strictEqual(format('%h'), '%h');
        });

        it('Should inspect extra args', function () {
            assert.strictEqual(format('%s', 'foo', 'bar'), 'foo \'bar\'');
            assert.strictEqual(format('%s', 'foo', 1, 2), 'foo 1 2');
            assert.strictEqual(format('%s %s', 1, 2, 3, 4), '1 2 3 4');
            assert.strictEqual(format('%s', 'x', 1, 2), 'x 1 2');
            assert.strictEqual(format('%y %s', 'foo', 'bar'), '%y foo \'bar\'');
            assert.strictEqual(format('%s', 'foo', {}), 'foo {}');
            assert.strictEqual(format({}, 'foo', {}), '{} \'foo\' {}');
        });

        it('Should do nothing if no arguments passed', function () {
            assert.strictEqual(format(), '');
        });

        it('Should not inspect kwargs', function () {
            assert.strictEqual(format('%s %(foo)s', 12, {foo: 'foo'}), '12 foo');
        });

        it('Should not fail on undefined kwargs', function () {
            assert.strictEqual(format('%s %(foo)s', 12), '12 undefined');
            assert.strictEqual(format('%(foo)s'), 'undefined');
        });

        it('Should support functional args', function () {
            assert.strictEqual(format('%s', function () {
                return 'foo';
            }), 'foo');
        });

        it('Should ignore bad kwarg patterns', function () {
            assert.strictEqual(format('%( %s', 42), '%( 42');
        });

        it('Should support deep kwargs', function () {
            assert.strictEqual(format('Hello, %(who[1])s!', {who: ['nobody', 'golyshevd']}), 'Hello, golyshevd!');
            assert.strictEqual(format('Hello, %(["who"][1])s!', {who: ['nobody', 'golyshevd']}), 'Hello, golyshevd!');
        });

        it('Should ignore undefined types', function () {
            assert.strictEqual(format('%y %s', 1), '%y 1');
        });

        it('Should not use kwargs as positional arg', function () {
            assert.strictEqual(format('%(name)s %j', {name: 'Foo'}), 'Foo undefined');
        });
    });
});
