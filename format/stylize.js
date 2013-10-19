'use strict';

var styles = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],

    black: [30, 39],
    maroon: [31, 39],
    green: [32, 39],
    olive: [33, 39],
    navy: [34, 39],
    purple: [35, 39],
    teal: [36, 39],
    silver: [37, 39],

    grey: [90, 39],
    red: [91, 39],
    lime: [92, 39],
    yellow: [93, 39],
    blue: [94, 39],
    fuchsia: [95, 39],
    aqua: [96, 39],
    white: [97, 39]
};

/**
 * @param {Array<String>} styles
 * @param {String} str
 *
 * @returns {String}
 * */
function stylize (styles, str) {

    var i;
    var l;

    for ( i = 0, l = styles.length; i < l; i += 1 ) {
        str = stylizeOne(styles[i], str);
    }

    return str;
}

function stylizeOne (style, str) {

    if ( styles.hasOwnProperty(style) ) {
        str = '\x1B[' + styles[style][0] + 'm' +
              str + '\x1B[' + styles[style][1] + 'm';
    }

    return str;
}

stylize.styles = styles;

module.exports = stylize;
