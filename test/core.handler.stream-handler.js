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
            var handler = new Handler({
                stream: {
                    write: function (m) {
                        spy.push(m);
                    }
                },
                layout: layout
            });
            handler.handle({level: 'LOG', message: 'xyz'});
            handler.handle({level: 'INFO', message: 'xyz'});
            assert.deepEqual(spy, ['foo\n', 'foo\n']);
        });
    });

});
