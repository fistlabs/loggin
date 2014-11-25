/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var _ = require('lodash-node');
var assert = require('assert');
var util = require('util');

describe('core/util/get', function () {
    var get = require('../core/util/get');

    describe('get.parse', function () {
        var parse = get.parse;
        var samples = [
            [
                '',
                []
            ],
            [
                '       ',
                []
            ],
            [
                ' foo ',
                [
                    {
                        type: 'STRING',
                        value: 'foo'
                    }
                ]
            ],
            [
                'foo',
                [
                    {
                        type: 'STRING',
                        value: 'foo'
                    }
                ]
            ],
            [
                '.foo',
                [
                    {
                        type: 'STRING',
                        value: 'foo'
                    }
                ]
            ],
            [
                '[42]',
                [
                    {
                        type: 'NUMBER',
                        value: 42
                    }
                ]
            ],
            [
                '  [  42  ]  ',
                [
                    {
                        type: 'NUMBER',
                        value: 42
                    }
                ]
            ],
            [
                '  [  "42"  ]  ',
                [
                    {
                        type: 'STRING',
                        value: '42'
                    }
                ]
            ],
            [
                '  [  \'42\'  ]  ',
                [
                    {
                        type: 'STRING',
                        value: '42'
                    }
                ]
            ],
            [
                '.foo[42]',
                [
                    {
                        type: 'STRING',
                        value: 'foo'
                    },
                    {
                        type: 'NUMBER',
                        value: 42
                    }
                ]
            ]
        ];

        _.forEach(samples, function (s) {
            var shouldText = util.format('Should parse %j to %j', s[0], s[1]);

            it(shouldText, function () {
                assert.deepEqual(parse(s[0]), s[1]);
            });
        });

        describe('parse errors', function () {
            var errors = [
                '.',
                '[]',
                '[\'"]',
                '["\']',
                '["foo"',
                '[',
                '1123',
                'foo-bar'
            ];

            _.forEach(errors, function (s) {
                var shouldText = util.format('Should throw SyntaxError on %j', s);

                it(shouldText, function () {
                    assert.throws(function () {
                        return parse(s);
                    });
                });
            });
        });
    });

    describe('get', function () {
        it('Should get deep property', function () {
            var obj = {foo: {bar: [{baz: 42}], zot: Object}};
            assert.strictEqual(get(obj, '.foo.bar[0].baz'), 42);
            assert.strictEqual(get(obj, '.foo.bar[1].baz'), void 0);
            assert.strictEqual(get(obj, '.foo.zot.keys'), Object.keys);
        });
    });
});
