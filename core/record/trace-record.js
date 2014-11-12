'use strict';

var SprintfRecord = /** @type SprintfRecord */ require('./sprintf-record');

/**
 * @class TraceRecord
 * @extends SprintfRecord
 *
 * @param {Function} caller
 * @param {String} name
 * @param {String} level
 * @param {Array|Arguments} args
 * */
function TraceRecord(caller, name, level, args) {
    SprintfRecord.call(this, caller, name, level, args);
}

TraceRecord.prototype = Object.create(SprintfRecord.prototype);

/**
 * @public
 * @memberOf {TraceRecord}
 * @method
 *
 * @constructs
 * */
TraceRecord.prototype.constructor = TraceRecord;

TraceRecord.prototype._formatMessage = function (args) {
    var error = new Error();
    var message = SprintfRecord.prototype._formatMessage.call(this, args);

    error.name = '';
    Error.captureStackTrace(error, this.caller);
    message = 'Trace: ' + message + error.stack;

    return message;

};

module.exports = TraceRecord;
