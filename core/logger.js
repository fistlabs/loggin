'use strict';

var _ = require('lodash-node');
var recorders = {
    internal: 'INTERNAL',
    debug: 'DEBUG',
    note: 'NOTE',
    info: 'INFO',
    log: 'LOG',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'FATAL'
};

/**
 * @class Logger
 *
 * @param {Logging} logging
 * @param {String} context
 * */
function Logger(logging, context) {

    /**
     * @public
     * @memberOf {Logger}
     * @property
     * @type {String}
     * */
    this.context = context;

    /**
     * @public
     * @memberOf {Logger}
     * @property
     * @type {Logging}
     * */
    this.logging = logging;
}

Logger.prototype = /** @Lends Logger.prototype */ {

    /**
     * @public
     * @memberOf {Logger}
     * @method
     *
     * @constructs
     * */
    constructor: Logger,

    /**
     * @public
     * @memberOf {Logger}
     * @method
     *
     * @param {String} name
     *
     * @returns {Object}
     * */
    bind: function (name) {
        return new this.constructor(this.logging, this.context + '/' + name);
    },

    /**
     * @public
     * @memberOf {Logger}
     * @method
     *
     * @param {Object} obj
     * */
    setup: function (obj) {
        _.forOwn(recorders, function (level, name) {
            obj[name] = this[name].bind(this);
        }, this);
    }
};

_.forOwn(recorders, function (level, name) {

    /**
     * @public
     * @memberOf {Logger}
     * @method
     *
     * @returns {Boolean}
     * */
    Logger.prototype[name] = function () {
        return this.logging.record(this.context, level, this[name], arguments);
    };
});

module.exports = Logger;
