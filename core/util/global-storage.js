'use strict';

var _ = require('lodash-node');

function getStorage(name, version) {
    var storage = global;

    _.forEach(['cache', name, version], function (prop) {
        if (_.has(storage, prop) && storage[prop] && _.isObject(storage[prop])) {
            storage = storage[prop];
        } else {
            storage = storage[prop] = {};
        }
    });

    return storage;
}

module.exports = getStorage;
