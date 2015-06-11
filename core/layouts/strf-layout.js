'use strict';

var AsIsLayout = /** @type AsIsLayout */ require('./asis-layout');

var strf = require('../util/strf');
var util = require('util');

/**
 * @usage
 *  logging.conf({
 *      layouts: {
 *          myLayout: {
 *              Class: 'loggin/core/layout/strf-layout',
 *              record: 'regular', //   or any other, but `Array message` variables is required
 *              kwargs: {
 *                  template: '%(date)s - %(message)s',  //  use any variables
 *                      //  that provided by record
 *              }
 *          }
 *      }
 *  });
 *
 * @class StrfLayout
 * @extends AsIsLayout
 *
 * @param {Object} record
 * @param {Object} params
 * */
function StrfLayout(record, params) {
    AsIsLayout.call(this, record, params);

    /**
     * @public
     * @memberOf {StrfLayout}
     * @property
     * @type {String}
     * */
    this.template = this.params.template;
}

StrfLayout.prototype = Object.create(AsIsLayout.prototype);

/**
 * @public
 * @memberOf {StrfLayout}
 * @method
 *
 * @constructs
 * */
StrfLayout.prototype.constructor = StrfLayout;

/**
 * @protected
 * @memberOf {StrfLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {*}
 * */
StrfLayout.prototype._formatRecord = function (record) {
    return strf.formatSign([this.template, record], util.inspect);
};

module.exports = StrfLayout;
