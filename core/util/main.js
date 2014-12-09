'use strict';

var m = module;

while (m.parent) {
    m = m.parent;
}

module.exports = m.filename;
