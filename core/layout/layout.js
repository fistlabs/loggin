'use strict';

var EOL = require('os').EOL;

var StrfLayout = /** @type StrfLayout*/ require('./strf-layout');

var strf = require('../util/strf');
var strftime = require('fast-strftime');

/**
 * @usage
 *  logging.conf({
 *      layouts: {
 *          myLayout: {
 *              Class: 'loggin/core/layout/layout',
 *              record: 'regular', //   or any other, but `Date date` and `Array message` variables is required
 *              kwargs: {
 *                  dateFormat: '%H:%M:%S', //  strftime template, special for `date` variable
 *                  template: '%(date)s - %(message)s',  //  use any variables
 *                      //  that provided by record, special case is```date```
 *              }
 *          }
 *      }
 *  });
 *
 * @class Layout
 * @extends StrfLayout
 *
 * @param {Object} record
 * @param {Object} params
 * */
function Layout(record, params) {
    StrfLayout.call(this, record, params);
    /**
     * @public
     * @memberOf {Layout}
     * @property
     * @type {String}
     * */
    this.dateFormat = this.params.dateFormat;
}

Layout.prototype = Object.create(StrfLayout.prototype);

/**
 * @public
 * @memberOf {Layout}
 * @method
 *
 * @constructs
 * */
Layout.prototype.constructor = Layout;

/**
 * @protected
 * @memberOf {Layout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {String}
 * */
Layout.prototype._formatRecord = function (record) {
    var i;
    var l;
    var message = record.message.split(EOL);
    var results = new Array(message.length);

    for (i = 0, l = message.length; i < l; i += 1) {
        record.message = message[i];
        results[i] = strf.formatSign([this.template, record]);
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
Layout.prototype._updateRecordAttrs = function (record) {
    record = StrfLayout.prototype._updateRecordAttrs.call(this, record);
    record.date = strftime(this.dateFormat, record.date);
    return record;
};

module.exports = Layout;
