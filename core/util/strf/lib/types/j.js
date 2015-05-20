'use strict';

var s = require('./s');
var safeJsonStringify = require('safe-json-stringify');

function j(value, sign, fill, width, precision) {
    value = safeJsonStringify(value);
    return s(value, sign, fill, width, precision);
}

module.exports = j;
