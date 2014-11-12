'use strict';

var format = require('../util/format');

/**
 * @class SprintfRecord
 *
 * @param {Function} caller
 * @param {String} name
 * @param {String} level
 * @param {Array|Arguments} args
 * */
function SprintfRecord(caller, name, level, args) {

    /**
     * @public
     * @memberOf {SprintfRecord}
     * @property
     * @type {String}
     * */
    this.asctime = new Date();

    /**
     * @public
     * @memberOf {SprintfRecord}
     * @property
     * @type {Function}
     * */
    this.caller = caller;

    /**
     * @public
     * @memberOf {SprintfRecord}
     * @property
     * @type {String}
     * */
    this.name = name;

    /**
     * @public
     * @memberOf {SprintfRecord}
     * @property
     * @type {String}
     * */
    this.level = level;

    /**
     * @public
     * @memberOf {SprintfRecord}
     * @property
     * @type {String}
     * */
    this.message = this._formatMessage(args);
}

/**
 * @public
 * @memberOf {SprintfRecord}
 * @method
 *
 * @constructs
 * */
SprintfRecord.prototype.constructor = SprintfRecord;

/**
 * @public
 * @memberOf {SprintfRecord}
 * @method
 *
 * @returns {Object}
 * */
SprintfRecord.prototype.getVars = function () {

    return {
        name: this.name,
        level: this.level,
        process: process.pid,
        asctime: this.asctime,
        message: this.message
    };
};

/**
 * @protected
 * @memberOf {SprintfRecord}
 * @method
 *
 * @param {Array|Arguments} args
 *
 * @returns {String}
 * */
SprintfRecord.prototype._formatMessage = function (args) {
    return format(args);
};

module.exports = SprintfRecord;
