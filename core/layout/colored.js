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
 * @param {Object} params
 * */
function Colored(params) {
    Layout.call(this, params);

    /**
     * @public
     * @memberOf {Colored}
     * @property
     * @type {Object}
     * */
    this.colors = Object(params).colors;
}

Colored.prototype = Object.create(Layout.prototype);

Colored.prototype.constructor = Colored;

/**
 * @protected
 * @memberOf {Colored}
 * @method
 *
 * @param {*} vars
 *
 * @returns {*}
 * */
Colored.prototype._formatVars = function (vars) {
    var level;
    vars = Layout.prototype._formatVars.call(this, vars);
    level = vars.level;

    vars.date = Colored.stylize('grey', vars.date);
    vars.level = Colored.stylize(this.colors[level], level);

    return vars;
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
