'use strict';

var _ = require('lodash-node');

exports.isRecord = function (obj) {
    return _.isObject(obj) && _.isFunction(obj.create);
};

exports.isLayout = function (obj) {
    return _.isObject(obj) && _.isFunction(obj.format) && exports.isRecord(obj.record);
};

exports.isHandler = function (obj) {
    return _.isObject(obj) && _.isFunction(obj.handle) && exports.isLayout(obj.layout);
};
