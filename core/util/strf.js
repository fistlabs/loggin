'use strict';

var StringFormatter = require('../lib/string-formatter');
var strf = new StringFormatter();

strf.addType('s', function (value, sign, width, precision) {
    value = String(value);

    if (precision) {
        value = value.substr(0, precision);
    }

    if (!width) {
        return value;
    }

    if (sign === '-') {
        while (value.length < width) {
            value += ' ';
        }
    } else {
        while (value.length < width) {
            value = ' ' + value;
        }
    }

    return value;
});

strf.addType('j', function (value, sign, width, precision) {
    try {
        value = JSON.stringify(value);
    } catch (e) {
        value = '[Circular]';
    }

    return this.s(value, sign, width, precision);
});

strf.addType('d', function (value, sign, width, precision) {
    /*eslint complexity: 0*/
    var pad = ' ';
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

    if (sign === '-') {
        value = pfx + value;

        while (value.length < width) {
            value += pad;
        }

        return value;
    }

    if (width.length > 1 && width.charAt(0) === '0') {
        pad = '0';
        width = width.substr(1);

        while ((pfx + value).length < width) {
            value = pad + value;
        }

        return pfx + value;
    }

    value = pfx + value;

    while (value.length < width) {
        value = pad + value;
    }

    return value;
});

module.exports = strf;
