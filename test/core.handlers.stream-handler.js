/*eslint max-nested-callbacks: 0*/
/*global describe, it*/
'use strict';

var assert = require('assert');

describe('core/handlers/stream-handler', function () {
    var Layout = require('../core/layouts/layout');
    var Handler = require('../core/handlers/stream-handler');
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
