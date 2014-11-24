'use strict';

var Layout = /** @type Layout */ require('./layout');

var styles = {
    //  dark
    black: 30,
    maroon: 31,
    green: 32,
    olive: 33,
    navy: 34,
    purple: 35,
    teal: 36,
    silver: 37,

    //  light
    grey: 90,
    red: 91,
    lime: 92,
    yellow: 93,
    blue: 94,
    fuchsia: 95,
    aqua: 96,
    white: 97
};

/**
 * @class Colored
 * @extends Layout
 *
 * @param {Object} record
 * @param {Object} params
 * */
function Colored(record, params) {
    Layout.call(this, record, params);

    params = Object(params);

    /**
     * @public
     * @memberOf {Colored}
     * @property
     * @type {Object}
     * */
    this.colors = Object(params.colors);
}

Colored.prototype = Object.create(Layout.prototype);

Colored.prototype.constructor = Colored;

/**
 * @protected
 * @memberOf {Colored}
 * @method
 *
 * @param {*} record
 *
 * @returns {*}
 * */
Colored.prototype._formatRecord = function (record) {
    record = Layout.prototype._formatRecord.call(this, record);
    record.level = Colored.stylize(this.colors[record.level], record.level);

    return record;
};

/**
 * @public
 * @static
 * @memberOf {Colored}
 * @method
 *
 * @param {String} style
 * @param {String} str
 *
 * @returns {String}
 * */
Colored.stylize = function (style, str) {
    if (styles.hasOwnProperty(style)) {
        return '\x1B[' + styles[style] + 'm' + str + '\x1B[0m';
    }

    return str;
};

// Object.keys(styles).forEach(function (k) {
//     console.log('%s %s', k, Colored.stylize(k, 'TEST'));
// });

module.exports = Colored;
