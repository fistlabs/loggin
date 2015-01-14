'use strict';

var AsisLayout = /** @type AsisLayout */ require('./asis-layout');

/**
 * @class RavenLayout
 * @extends AsisLayout
 * */
function RavenLayout(record, params) {
    AsisLayout.call(this, record, params);
}

RavenLayout.prototype = Object.create(AsisLayout.prototype);

RavenLayout.prototype.constructor = RavenLayout;

/**
 * @protected
 * @memberOf {RavenLayout}
 * @method
 *
 * @param {Object} record
 *
 * @returns {Object}
 * */
RavenLayout.prototype._updateRecordAttrs = function (record) {
    var message = record.message;

    if (message[0] instanceof Error && message.length === 1) {
        record.message = message[0];
        return record;
    }

    return AsisLayout.prototype._updateRecordAttrs.call(this, record);
};

module.exports = RavenLayout;
