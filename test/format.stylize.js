'use strict';

var s = require('../format/stylize');
var c = s.styles;

module.exports = {

    'format.stylize': [
        function (test) {

            var str;

            str = 'Hello';

            test.strictEqual(
                s(['black', 'underline', 'dotted'], str),

                '\x1B[' + c.underline[0] + 'm' +
                    '\x1B[' + c.black[0] + 'm' +
                    str +
                    '\x1B[' + c.black[1] + 'm' +
                    '\x1B[' + c.underline[1] + 'm'
            );

            test.done();
        }
    ]
};
