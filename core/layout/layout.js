'use strict';

var sprintf = require('sprintf-js').sprintf;
var strftime = require('fast-strftime');
var EOL = require('os').EOL;

/**
 * @class Layout
 *
 * @param {Object} record
 * @param {Object} params
 * */
function Layout(record, params) {

    /**
     * @public
     * @memberOf {Layout}
     * @property
     * @type {Object}
     * */
    this.record = record;

    params = Object(params);

    /**
     * @public
     * @memberOf {Layout}
     * @property
     * @type {String}
     * */
    this.template = params.template;

    /**
     * @public
     * @memberOf {Layout}
     * @property
     * @type {String}
     * */
    this.dateFormat = params.dateFormat;
}

/**
 * @public
 * @memberOf {Layout}
 * @method
 *
 * @constructs
 * */
Layout.prototype.constructor = Layout;

/**
 * @public
 * @memberOf {Layout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {String}
 * */
Layout.prototype.format = function (record) {
    var i;
    var l;
    var message;
    var results;

    record = this._formatRecord(record);

    message = record.message.split(EOL);

    results = new Array(message.length);

    for (i = 0, l = message.length; i < l; i += 1) {
        record.message = message[i];
        results[i] = sprintf(this.template, record);
    }

    return results.join('');
};

/**
 * @protected
 * @memberOf {Layout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {Object}
 * */
Layout.prototype._formatRecord = function (record) {
    record.date = strftime(this.dateFormat, record.date);
    return record;
};

module.exports = Layout;
