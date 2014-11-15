'use strict';

var sprintf = require('sprintf-js').sprintf;
var strftime = require('fast-strftime');

/**
 * @class Layout
 *
 * @param {Object} params
 * */
function Layout(params) {
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
        results[i] = sprintf(this.template, vars);
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
    vars.date = strftime(this.dateFormat, vars.date);
    return vars;
};

module.exports = Layout;
