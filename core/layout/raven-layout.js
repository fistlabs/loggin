'use strict';

var AsisLayout = /** @type AsisLayout */ require('./asis-layout');

var _ = require('lodash-node');

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
 * @param {Object} vars
 *
 * @returns {Object}
 * */
RavenLayout.prototype._updateRecordAttrs = function (vars) {
    var message = vars.message;
    var i = 0;
    var l = message.length;
    var newVars = {};

    if (message[0] instanceof Error) {
        for (i = 1; i < l; i += 1) {
            if (_.isObject(message[i])) {
                _.extend(newVars, message[i]);
            }
        }

        _.extend(newVars, vars, {
            message: message[0]
        });

        return newVars;
    }

    if (_.isObject(message[l - 1])) {
        vars = _.extend(newVars, message[l - 1], vars);
    }

    return AsisLayout.prototype._updateRecordAttrs.call(this, vars);
};

module.exports = RavenLayout;
