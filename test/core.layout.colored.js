/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/layout/colored', function () {
    var Colored = require('../core/layout/colored');
    var Record = require('../core/record/regular');
    var record = new Record();
    var duck = require('../core/util/duck');

    describe('Colored.stylize()', function () {
        it('Should wrap string to escape sequences', function () {
            assert.notStrictEqual(Colored.stylize('grey', 'foo'), 'foo');
        });
        it('Should not do anything if the style passed not supported', function () {
            assert.strictEqual(Colored.stylize('grey1312312', 'foo'), 'foo');
        });
    });

    describe('colored.format(vars)', function () {
        it('Should wrap some record vars in color escapes', function () {
            var vars = {
                level: 'FOO',
                message: ['foo'],
                date: new Date()
            };
            var colored = new Colored(record, {
                template: '%(date)s %(level)s %(message)s',
                dateFormat: 'foo',
                colors: {
                    FOO: 'red'
                }
            });

            assert.ok(duck.isRecord(colored.record));

            assert.strictEqual(colored.format(vars),
                 'foo ' + Colored.stylize('red', 'FOO') + ' foo');
        });
    });
});
