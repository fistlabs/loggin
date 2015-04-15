'use strict';

var Regular = /** @type Regular */ require('./regular');

var path = require('path');
var filename = path.resolve(require('../util/main'));
var dirname = path.dirname(filename);

/**
 * @class Verbose
 * @extends Regular
 * */
function Verbose() {}

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

    Error.prepareStackTrace = function (_, stack) {
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

    record.line = callsite.getLineNumber();
    record.column = callsite.getColumnNumber();
    record.filename = path.resolve(callsite.getFileName());
    record.module = path.relative(dirname, record.filename);

    return record;
};

module.exports = Verbose;
