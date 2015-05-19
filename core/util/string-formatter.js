'use strict';

/*jscs: disable*/
var R_TOKENS = /^(?:%(?:\(((?:[^()]+|"[^"]*"|'[^']*')+)\))?([+-])?(?:(?:([\s\S]):)?(\d+))?(?:\.(\d+))?([a-z])|([^%]+)|%?(%))/;
/*jscs: enable*/

var get = require('obus').get;
var hasProperty = Object.prototype.hasOwnProperty;
var util = require('util');

/**
 * @class StringFormatter
 * */
function StringFormatter() {

    /**
     * @private
     * @memberOf {StringFormatter}
     * @property
     * @type {Object}
     * */
    this._cache = {};

    /**
     * @public
     * @memberOf {StringFormatter}
     * @property
     * @type {Object}
     * */
    this._types = {};
}

StringFormatter.prototype.constructor = StringFormatter;

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @returns {String}
 * */
StringFormatter.prototype.format = function () {
    return this.formatSign(arguments, util.inspect);
};

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {Array} sign
 * @param {Function} inspect
 *
 * @returns {String}
 * */
StringFormatter.prototype.formatSign = function (sign, inspect) {
    if (typeof sign[0] === 'string') {
        return this._formatPattern(sign[0], sign, 1, inspect);
    }

    return this._inspectArgs(sign, 0, 0, '', inspect);
};

/**
 * @public
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} type
 * @param {Function} func
 *
 * @returns {StringFormatter}
 * */
StringFormatter.prototype.addType = function (type, func) {
    this._types[type] = func;
    return this;
};

/**
 * @private
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} s
 *
 * @returns {Object}
 * */
StringFormatter.prototype._parse = function (s) {
    if (!hasProperty.call(this._cache, s)) {
        this._cache[s] = this._parsePattern(s);
    }

    return this._cache[s];
};

/**
 * @private
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} s
 *
 * @returns {Array}
 * */
StringFormatter.prototype._parsePattern = function (s) {
    var match;
    var parts = [];

    /*eslint no-cond-assign: 0*/
    while (match = R_TOKENS.exec(s)) {
        s = s.substr(match[0].length);

        if (!match[6]) {
            parts[parts.length] = match[7] || match[8];
            continue;
        }

        if (typeof this._types[match[6]] !== 'function') {
            parts[parts.length] = match[0];
            continue;
        }

        parts[parts.length] = [match[6], match[1], match[2], match[3], match[4], match[5], match[0]];
    }

    return parts;
};

/**
 * @private
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {String} patternString
 * @param {Array} args
 * @param {Number} ofs
 * @param {Function} inspect
 *
 * @returns {String}
 * */
StringFormatter.prototype._formatPattern = function (patternString, args, ofs, inspect) {
    var i;
    var l;
    var part;
    var s = '';
    var value;
    var pos = Math.max(0, ofs);
    var parts = this._parse(patternString);
    var usesKwargs = false;
    var argc = args.length;

    for (i = 0, l = parts.length; i < l; i += 1) {
        part = parts[i];

        if (typeof part === 'string') {
            s += part;
            continue;
        }

        if (part[1]) {
            usesKwargs = true;
            value = get(args[argc - 1], part[1]);
        } else {
            if (usesKwargs && pos === argc - 1) {
                value = void 0;
            } else {
                value = args[pos];
            }

            pos += 1;
        }

        if (typeof value === 'function') {
            value = value();
        }

        s += this._types[part[0]](value, part[2], part[3], part[4], part[5]);
    }

    return s + this._inspectArgs(args, pos, Number(usesKwargs), ' ', inspect);
};

/**
 * @private
 * @memberOf {StringFormatter}
 * @method
 *
 * @param {Array} args
 * @param {Number} ofsL
 * @param {Number} ofsR
 * @param {String} s
 * @param {Function} inspect
 *
 * @returns {String}
 * */
StringFormatter.prototype._inspectArgs = function (args, ofsL, ofsR, s, inspect) {
    var l = args.length - ofsR;

    if (l - ofsL < 1) {
        return '';
    }

    s += inspect(args[ofsL]);
    ofsL += 1;

    while (ofsL < l) {
        s += ' ' + inspect(args[ofsL]);
        ofsL += 1;
    }

    return s;
};

module.exports = StringFormatter;
