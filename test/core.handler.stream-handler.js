/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/handler/stream-handler', function () {
    var Layout = require('../core/layout/layout');
    var Handler = require('../core/handler/stream-handler');
    var layout = new Layout({
        template: 'foo\n',
        dateFormat: 'bar'
    });

    describe('handler.handle()', function () {
        it('Should write to default stream', function () {
            var spy = [];
            var handler = new Handler(layout, {
                stream: {
                    write: function (m) {
                        spy.push(m);
                    }
                }
            });
            handler.handle('foo\n');
            handler.handle('foo\n');
            assert.deepEqual(spy, ['foo\n', 'foo\n']);
        });
    });

});
