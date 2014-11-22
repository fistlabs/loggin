'use strict';

var format = require('./util/format');
var path = require('path');
var main = require('./util/main');

/**
 * @class Record
 *
 * @param {String} context
 * @param {String} level
 * @param {Function} caller
 * @param {Array|Arguments} args
 * */
function Record(context, level, caller, args) {

    /**
     * @public
     * @memberOf {Record}
     * @property
     * @type {Function}
     * */
    this.caller = caller;

    /**
     * @public
     * @memberOf {Record}
     * @property
     * @type {String}
     * */
    this.date = new Date();

    /**
     * @public
     * @memberOf {Record}
     * @property
     * @type {String}
     * */
    this.context = context;

    /**
     * @public
     * @memberOf {Record}
     * @property
     * @type {String}
     * */
    this.level = level;

    /**
     * @public
     * @memberOf {Record}
     * @property
     * @type {String}
     * */
    this.message = this._formatMessage(args);
}

/**
 * @public
 * @memberOf {Record}
 * @method
 *
 * @constructs
 * */
Record.prototype.constructor = Record;

/**
 * @protected
 * @memberOf {Record}
 * @method
 *
 * @returns {Object}
 * */
Record.prototype._getCallSite = function () {
    var callSite;
    var stackHolder = {};
    var stackTraceLimit = Error.stackTraceLimit;
    var prepareStackTrace = Error.prepareStackTrace;

    Error.stackTraceLimit = 1;

    Error.prepareStackTrace = function (stackHolder, stack) {
        return stack;
    };

    Error.captureStackTrace(stackHolder, this.caller);

    callSite = stackHolder.stack[0];
    Error.prepareStackTrace = prepareStackTrace;
    Error.stackTraceLimit = stackTraceLimit;

    return callSite;
};

/**
 * @public
 * @memberOf {Record}
 * @method
 *
 * @returns {Object}
 * */
Record.prototype.getVars = function () {
    var moduleName;
    var self = this;

    return {
        context: this.context,
        level: this.level,
        date: this.date,
        message: this.message,
        module: function () {

            if (!moduleName) {
                moduleName = path.relative(main.dirname, self._getCallSite().getFileName());
            }

            return moduleName;
        }
    };
};

/**
 * @protected
 * @memberOf {Record}
 * @method
 *
 * @param {Array|Arguments} args
 *
 * @returns {String}
 * */
Record.prototype._formatMessage = function (args) {
    return format(args);
};

module.exports = Record;
