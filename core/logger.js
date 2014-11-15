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
 * @param {String} name
 * */
function Logger(logging, name) {

    /**
     * @public
     * @memberOf {Logger}
     * @property
     * @type {String}
     * */
    this.name = name;

    /**
     * @protected
     * @memberOf {Logger}
     * @property
     * @type {Logging}
     * */
    this._logging = logging;
}

Logger.prototype = {

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
     * @returns {Logger}
     * */
    bind: function (name) {
        return new Logger(this._logging, this.name + ':' + name);
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
        return this._logging.record(this.name, level, arguments);
    };
});

module.exports = Logger;
