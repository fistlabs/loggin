'use strict';

var Logger = /** @type Logger */ require('./Logger');

var inherit = require('inherit');
var util = require('util');
var strftime = require('fast-strftime');

/**
 * @class Default
 * @extends Logger
 * */
var Default = inherit(Logger, /** @lends Default.prototype */ {

    /**
     * @public
     * @memberOf {Default}
     * @property
     * @type {String}
     * */
    timestampTemplate: '[%d/%b/%Y:%H:%M:%S %z]',

    /**
     * @public
     * @memberOf {Default}
     * @property
     * @type {*}
     * */
    pid: process.pid,

    /**
     * @public
     * @memberOf {Default}
     * @method
     * */
    dir: function () {
        this._write('DBG', arguments, this._formatInspect);
    },

    /**
     * @public
     * @memberOf {Default}
     * @method
     * */
    trace: function () {
        this._write('DBG', arguments, this._formatTrace);
    },

    /**
     * @protected
     * @memberOf {Default}
     * @property
     * @type {Object}
     * */
    _inspectOpts: {},

    /**
     * @inheritdoc
     * @memberOf {Default}
     * */
    _formatDate: function (ts) {

        return strftime(this.timestampTemplate, ts);
    },

    /**
     * @inheritdoc
     * @memberOf {Default}
     * */
    _formatHead: function (level) {

        return this.__base(level) + ' ' + this._formatPid(this.pid);
    },

    /**
     * @protected
     * @memberOf {Default}
     * @method
     *
     * @param {*} pid
     *
     * @returns {String}
     * */
    _formatPid: function (pid) {

        return pid;
    },

    /**
     * @protected
     * @memberOf {Default}
     * @method
     *
     * @param {Array} buf
     *
     * @returns {String}
     * */
    _formatTrace: function (buf) {

        var err = new Error();

        Error.captureStackTrace(err, this.trace);

        return this._defaultFormat(buf) + '\n' +
               err.stack.split('\n').slice(1).join('\n');
    },

    /**
     * @protected
     * @memberOf {Default}
     * @method
     *
     * @param {Array} buf
     *
     * @returns {String}
     * */
    _formatInspect: function (buf) {

        return Array.prototype.map.call(buf, this.__inspect, this).join(' ');
    },

    /**
     * @private
     * @memberOf {Default}
     * @method
     *
     * @param {*} o
     *
     * @returns {String}
     * */
    __inspect: function (o) {

        return util.inspect(o, this._inspectOpts);
    }

});

module.exports = Default;
