'use strict';

var strf = require('../util/strf');
var util = require('util');

/**
 * @usage
 *  logging.conf({
 *      layouts: {
 *          myLayout: {
 *              Class: 'loggin/core/layout/strf-layout',
 *              record: 'regular' //   or any other, but `Array message` variables is required
 *          }
 *      }
 *  });
 *
 * @class AsIsLayout
 *
 * @param {Object} record
 * @param {Object} params
 * */
function AsIsLayout(record, params) {

    /**
     * @public
     * @memberOf {AsIsLayout}
     * @property
     * @type {Object}
     * */
    this.params = Object(params);

    /**
     * @public
     * @memberOf {AsIsLayout}
     * @property
     * @type {Object}
     * */
    this.record = record;
}

/**
 * @public
 * @memberOf {AsIsLayout}
 * @method
 *
 * @constructs
 * */
AsIsLayout.prototype.constructor = AsIsLayout;

/**
 * @public
 * @memberOf {AsIsLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {*}
 * */
AsIsLayout.prototype.format = function (record) {
    return this._formatRecord(this._updateRecordAttrs(record));
};

/**
 * @protected
 * @memberOf {AsIsLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {Object}
 * */
AsIsLayout.prototype._updateRecordAttrs = function (record) {
    //  just format record message with passed args
    var inspect = this.params.showStackTraces ? eInspect : util.inspect;

    record.message = strf.formatSign(record.message, inspect);
    record.context = record.context.join('/');

    return record;
};

function eInspect(v) {
    if (v instanceof Error && v.stack) {
        return v.stack;
    }

    return util.inspect(v);
}

/**
 * @protected
 * @memberOf {AsIsLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {*}
 * */
AsIsLayout.prototype._formatRecord = function (record) {
    return record;
};

module.exports = AsIsLayout;
