'use strict';

function fillLeft(value, fill, width) {

    while (value.length < width) {
        value = fill + value;
    }

    return value;
}

module.exports = fillLeft;
