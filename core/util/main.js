'use strict';

var path = require('path');

function getMainFileName() {
    var current = module;

    while (current.parent) {
        current = current.parent;
    }

    return current.filename;
}

exports.filename = getMainFileName();
exports.dirname = path.dirname(exports.filename);
