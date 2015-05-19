'use strict';

var fillLeft = require('../fill-left');
var fillRight = require('../fill-right');

/*eslint-disable complexity*/
function d(value, sign, fill, width, precision) {
    var pfx = '';

    value = parseInt(value, 10);

    if (value < 0) {
        // always add '-' on negative numbers
        pfx = '-';
    } else if (sign === '+') {
        // add '+' if explicitly specified
        pfx = '+';
    }

    value = String(Math.abs(value));

    if (precision) {
        value = fillLeft(value, '0', precision);
    }

    value = pfx + value;

    if (!width) {
        return value;
    }

    if (!fill) {
        fill = ' ';
    }

    if (sign === '-') {
        return fillRight(value, fill, width);
    }

    return fillLeft(value, fill, width);
}
/*eslint-enable complexity*/

module.exports = d;
