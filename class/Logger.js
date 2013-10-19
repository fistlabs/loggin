'use strict';

var inherit = require('inherit');
var util = require('util');

/**
 * @class Logger
 * */
var Logger = inherit(/** @lends Logger.prototype */ {

    /**
     * @private
     * @memberOf {Logger}
     * @method
     *
     * @constructs
     * */
    __constructor: function () {

        /**
         * @public
         * @memberOf {Logger}
         * @property
         * @type {Object}
         * */
        this.levels = {
            DBG: {
                weight: 0,
                stream: process.stdout
            },
            INF: {
                weight: 1,
                stream: process.stdout
            },
            LOG: {
                weight: 2,
                stream: process.stdout
            },
            WRN: {
                weight: 3,
                stream: process.stderr
            },
            ERR: {
                weight: 4,
                stream: process.stderr
            },
            FATAL: {
                weight: 5,
                stream: process.stderr
            }
        };
    },

    /**
     * @public
     * @memberOf {Logger}
     * @property
     * @type {Number}
     * */
    logLevel: 0,

    /**
     * @public
     * @memberOf {Logger}
     * @method
     * */
    debug: function () {
        this._write('DBG', arguments, this._defaultFormat);
    },

    /**
     * @public
     * @memberOf {Logger}
     * @method
     * */
    error: function () {
        this._write('ERR', arguments, this._defaultFormat);
    },

    /**
     * @public
     * @memberOf {Logger}
     * @method
     * */
    fatal: function () {
        this._write('FATAL', arguments, this._defaultFormat);
    },

    /**
     * @public
     * @memberOf {Logger}
     * @method
     * */
    info: function () {
        this._write('INF', arguments, this._defaultFormat);
    },

    /**
     * @public
     * @memberOf {Logger}
     * @method
     * */
    log: function () {
        this._write('LOG', arguments, this._defaultFormat);
    },

    /**
     * @public
     * @memberOf {Logger}
     * @method
     * */
    warn: function () {
        this._write('WRN', arguments, this._defaultFormat);
    },

    /**
     * @protected
     * @memberOf {Logger}
     * @method
     *
     * @param {Array} buf
     *
     * @returns {String}
     * */
    _defaultFormat: function (buf) {

        return util.format.apply(util, buf);
    },

    /**
     * @protected
     * @memberOf {Logger}
     * @method
     *
     * @param {*} level
     * @param {Array} buf
     * @param {Function} theme
     *
     * @returns {String}
     * */
    _format: function (level, buf, theme) {

        return this._formatHead(level) + ': ' + theme.call(this, buf);
    },

    /**
     * @protected
     * @memberOf {Logger}
     * @method
     *
     * @param {Number} level
     *
     * @returns {String}
     * */
    _formatHead: function (level) {

        return this._formatDate(new Date()) + ' ' + this._formatLevel(level);
    },

    /**
     * @protected
     * @memberOf {Logger}
     * @method
     *
     * @param {Date} ts
     *
     * @returns {String}
     * */
    _formatDate: function (ts) {

        return String(ts);
    },

    /**
     * @protected
     * @memberOf {Logger}
     * @method
     *
     * @param {*} level
     *
     * @returns {String}
     * */
    _formatLevel: function (level) {

        return level;
    },

    /**
     * @protected
     * @memberOf {Logger}
     * @method
     *
     * @param {String} level
     * @param {Array} buf
     * @param {Function} theme
     * */
    _write: function (level, buf, theme) {

        var descr = this.levels[level];

        if ( descr.weight < this.logLevel ) {

            return;
        }

        descr.stream.write(this._format(level, buf, theme) + '\n');
    }

});

module.exports = Logger;
