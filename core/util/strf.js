'use strict';

var StringFormatter = require('../lib/string-formatter');
var strf = new StringFormatter();

/*eslint-disable complexity*/
strf.addType('s', function (value, sign, fill, width, precision) {
    value = String(value);

    if (precision) {
        value = value.substr(0, precision);
    }

    if (!width) {
        return value;
    }

    if (!fill) {
        fill = ' ';
    }

    if (sign === '-') {
        while (value.length < width) {
            value = value + fill;
        }
    } else {
        while (value.length < width) {
            value = fill + value;
        }
    }

    return value;
});
/*eslint-enable complexity*/

strf.addType('j', function (value, sign, fill, width, precision) {
    try {
        value = JSON.stringify(value);
    } catch (e) {
        value = '[Circular]';
    }

    return this.s(value, sign, fill, width, precision);
});

/*eslint-disable complexity*/
strf.addType('d', function (value, sign, fill, width, precision) {
    var pfx = '';

    value = parseInt(value, 10);

    if (value < 0) {
        pfx = '-';
    } else if (sign === '+') {
        pfx = '+';
    }

    value = String(Math.abs(value));

    if (precision) {
        while (value.length < precision) {
            value = '0' + value;
        }
    }

    if (!width) {
        return pfx + value;
    }

    if (!fill) {
        fill = ' ';
    }

    if (sign === '-') {
        value = pfx + value;

        while (value.length < width) {
            value += fill;
        }

        return value;
    }

    value = pfx + value;

    while (value.length < width) {
        value = fill + value;
    }

    return value;
});
/*eslint-enable complexity*/

module.exports = strf;
