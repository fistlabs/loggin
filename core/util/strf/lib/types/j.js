'use strict';

var s = require('./s');

function j(value, sign, fill, width, precision) {
    try {
        value = JSON.stringify(value);
    } catch (e) {
        value = '[Circular]';
    }

    return s(value, sign, fill, width, precision);
}

module.exports = j;
