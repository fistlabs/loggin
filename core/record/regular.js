'use strict';

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
        process: process.pid,
        context: context,
        level: level,
        date: new Date(),
        message: args
    };
};

module.exports = Record;
