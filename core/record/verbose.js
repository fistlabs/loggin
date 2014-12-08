'use strict';

var Regular = /** @type Regular */ require('./regular');

var main = require('../util/main');
var path = require('path');

/**
 * @class Verbose
 * @extends Record
 * */
function Verbose(params) {
    Regular.call(this, params);
}

Verbose.prototype = Object.create(Regular.prototype);

Verbose.prototype.constructor = Verbose;

/**
 * @protected
 * @memberOf {Verbose}
 * @method
 *
 * @returns {Object}
 * */
Verbose.prototype._getCallSite = function (caller) {
    var callSite;
    var stackHolder = {};
    var stackTraceLimit = Error.stackTraceLimit;
    var prepareStackTrace = Error.prepareStackTrace;

    Error.stackTraceLimit = 1;

    Error.prepareStackTrace = function (stackHolder, stack) {
        return stack;
    };

    Error.captureStackTrace(stackHolder, caller);

    callSite = stackHolder.stack[0];
    Error.prepareStackTrace = prepareStackTrace;
    Error.stackTraceLimit = stackTraceLimit;

    return callSite;
};

/**
 * @public
 * @memberOf {Verbose}
 * @method
 *
 * @param {String} context
 * @param {String} level
 * @param {Function} caller
 * @param {Arguments|Array} args
 *
 * @returns {*}
 * */
Verbose.prototype.create = function (context, level, caller, args) {
    var record = Regular.prototype.create.call(this, context, level, caller, args);
    var callsite = this._getCallSite(caller);

    record.callsite = callsite;
    record.line = callsite.getLineNumber();
    record.column = callsite.getColumnNumber();
    record.filename = path.resolve(callsite.getFileName());
    record.module = path.relative(main.dirname, record.filename);

    return record;
};

module.exports = Verbose;
