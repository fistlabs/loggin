/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/layout/layout', function () {
    var Layout = require('../core/layout/layout');
    var Colored = require('../core/layout/colored');

    describe('Colored', function () {
        it('Should throw an error if no params.colors specified', function () {
            assert.throws(function () {
                return new Colored({
                    strftime: 'foo',
                    strf: 'bar'
                });
            });
        });

        it('Should be an instance of Layout', function () {
            var colored = new Colored({
                strf: 'foo',
                strftime: 'bar',
                colors: {}
            });

            assert.ok(colored instanceof Layout);
        });
    });

    describe('Colored.stylize()', function () {
        it('Should wrap string to escape sequences', function () {
            assert.notStrictEqual(Colored.stylize('grey', 'foo'), 'foo');
        });
        it('Should not do anything if the style passed not supported', function () {
            assert.strictEqual(Colored.stylize('grey1312312', 'foo'), 'foo');
        });
    });

    describe('colored.format(record)', function () {
        it('Should wrap some record vars in color escapes', function () {
            var vars = {
                level: 'FOO',
                message: 'foo',
                asctime: new Date()
            };
            var colored = new Colored({
                strf: '%(asctime)s %(level)s %(message)s',
                strftime: 'foo',
                colors: {
                    FOO: 'red'
                }
            });

            assert.strictEqual(colored.format(vars),
                Colored.stylize('grey', 'foo') + ' ' + Colored.stylize('red', 'FOO') + ' foo');
        });
    });
});
