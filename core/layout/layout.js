'use strict';

var assert = require('chai').assert;
var sprintf = require('sprintf-js').sprintf;
var strftime = require('fast-strftime');

/**
 * @class Layout
 *
 * @param {Object} params
 * */
function Layout(params) {
    params = Object(params);

    assert.isString(params.strf);
    assert.isString(params.strftime);

    /**
     * @public
     * @memberOf {Layout}
     * @property
     * @type {Object}
     * */
    this.params = params;
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
 * @param {Object} vars
 *
 * @returns {String}
 * */
Layout.prototype.format = function (vars) {
    var i;
    var l;
    var message;
    var results;

    vars = this._formatVars(vars);
    message = vars.message.split(/\r\n|\r|\n/);
    results = new Array(message.length);

    for (i = 0, l = message.length; i < l; i += 1) {
        vars.message = message[i];
        results[i] = sprintf(this.params.strf, vars);
    }

    return results.join('');
};

/**
 * @protected
 * @memberOf {Layout}
 * @method
 *
 * @param {Object} vars
 *
 * @returns {Object}
 * */
Layout.prototype._formatVars = function (vars) {
    vars.asctime = strftime(this.params.strftime, vars.asctime);
    return vars;
};

module.exports = Layout;
