'use strict';

/**
 * @class Regular
 * */
function Regular() {}

/**
 * @public
 * @memberOf {Regular}
 * @method
 *
 * @constructs
 * */
Regular.prototype.constructor = Regular;

/**
 * @public
 * @memberOf {Regular}
 * @method
 *
 * @returns {Object}
 * */
Regular.prototype.create = function (context, level, caller, args) {

    return {
        process: process.pid,
        context: context,
        level: level,
        date: new Date(),
        message: args
    };
};

module.exports = Regular;
