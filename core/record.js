'use strict';

var format = require('./util/format');

/**
 * @class Record
 *
 * @param {String} name
 * @param {String} level
 * @param {Array|Arguments} args
 * */
function Record(name, level, args) {

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
    this.name = name;

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
 * @public
 * @memberOf {Record}
 * @method
 *
 * @returns {Object}
 * */
Record.prototype.getVars = function () {

    return {
        name: this.name,
        level: this.level,
        process: process.pid,
        date: this.date,
        message: this.message
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
