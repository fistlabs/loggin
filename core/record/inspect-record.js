'use strict';

var SprintfRecord = /** @type SprintfRecord */ require('./sprintf-record');
var util = require('util');

/**
 * @class InspectRecord
 * @extends SprintfRecord
 *
 * @param {Function} caller
 * @param {String} name
 * @param {String} level
 * @param {Array|Arguments} args
 * */
function InspectRecord(caller, name, level, args) {
    SprintfRecord.call(this, caller, name, level, args);
}

InspectRecord.prototype = Object.create(SprintfRecord.prototype);

/**
 * @public
 * @memberOf {InspectRecord}
 * @method
 *
 * @constructs
 * */
InspectRecord.prototype.constructor = InspectRecord;

/**
 * @protected
 * @memberOf {InspectRecord}
 * @method
 *
 * @param {Array|Arguments} args
 *
 * @returns {String}
 * */
InspectRecord.prototype._formatMessage = function (args) {
    var i;
    var l;
    var result = new Array(args.length);

    for (i = 0, l = args.length; i < l; i += 1) {
        result[i] = util.inspect(args[i]);
    }

    return result.join(' ');
};

module.exports = InspectRecord;
