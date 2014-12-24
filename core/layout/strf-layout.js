'use strict';
//  TODO separate unit tests

var strf = require('../util/strf');

/**
 * @usage
 *  logging.conf({
 *      layouts: {
 *          myLayout: {
 *              Class: 'loggin/core/layout/strf-layout',
 *              record: 'regular', //   or any other, but `Array message` variables is required
 *              kwargs: {
 *                  template: '%(date)s - %(message)s',  //  use any variables
 *                      //  that provided by record, special case is```date```
 *              }
 *          }
 *      }
 *  });
 *
 * @class StrfLayout
 *
 * @param {Object} record
 * @param {Object} params
 * */
function StrfLayout(record, params) {

    /**
     * @public
     * @memberOf {StrfLayout}
     * @property
     * @type {Object}
     * */
    this.params = params = Object(params);

    /**
     * @public
     * @memberOf {StrfLayout}
     * @property
     * @type {Object}
     * */
    this.record = record;

    /**
     * @public
     * @memberOf {StrfLayout}
     * @property
     * @type {String}
     * */
    this.template = params.template;
}

/**
 * @public
 * @memberOf {StrfLayout}
 * @method
 *
 * @constructs
 * */
StrfLayout.prototype.constructor = StrfLayout;

/**
 * @public
 * @memberOf {StrfLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {String}
 * */
StrfLayout.prototype.format = function (record) {
    return this._formatRecord(this._updateRecordAttrs(record));
};

/**
 * @protected
 * @memberOf {StrfLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {Object}
 * */
StrfLayout.prototype._updateRecordAttrs = function (record) {
    //  just format record message with passed args
    record.message = strf.format(record.message);

    return record;
};

/**
 * @protected
 * @memberOf {StrfLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {String}
 * */
StrfLayout.prototype._formatRecord = function (record) {
    return strf.format([this.template, record]);
};

module.exports = StrfLayout;
