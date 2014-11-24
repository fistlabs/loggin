'use strict';

var format = require('./../util/format');

/**
 * @class Record
 * */
function Record() {}

/**
 * @public
 * @memberOf {Record}
 * @method
 *
 * @constructs
 * */
Record.prototype.constructor = Record;

/**
 * @public
 * @memberOf {Record}
 * @method
 *
 * @returns {Object}
 * */
Record.prototype.create = function (context, level, caller, args) {

    return {
        context: context,
        level: level,
        date: new Date(),
        message: format(args)
    };
};

module.exports = Record;
