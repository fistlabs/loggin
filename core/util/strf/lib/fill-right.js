'use strict';

function fillRight(value, fill, width) {

    while (value.length < width) {
        value += fill;
    }

    return value;
}

module.exports = fillRight;
