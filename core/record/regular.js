'use strict';

var _ = require('lodash-node');

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

    return _.extend({
        process: process.pid,
        context: context,
        level: level,
        date: new Date(),
        message: args
    }, args[args.length - 1]);
};

module.exports = Regular;
