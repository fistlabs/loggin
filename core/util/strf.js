'use strict';

var R_TOKENS = /(?:%%|%(?:\(((?:[^()]+|"[^"]*"|'[^']*')+)\))?([+-])?(\d+)?(?:\.(\d+))?([a-z]))/gi;

var get = require('obus').get;
var hasProperty = Object.prototype.hasOwnProperty;
var inspect = require('util').inspect;

function strf() {
    return strf.format(arguments);
}

strf.format = function (args) {
    /*eslint complexity: 0*/
    var l = args.length;
    var kwargs = Object(args[l - 1]);
    var pos = 1;
    var s = '';
    var stack = false;
    var usesKwargs = false;
    var value = args[0];

    if (typeof value === 'string') {
        s = value.replace(R_TOKENS, function ($0, key, sign, width, precision, type) {
            /*eslint max-params: 0*/

            if (!type) {
                return '%';
            }

            if (hasProperty.call(strf.format, type)) {
                if (key) {
                    usesKwargs = true;
                    value = get(kwargs, key);
                } else {
                    value = args[pos];
                    pos += 1;
                }

                if (value !== void 0) {
                    return strf.format[type](value, sign, width, precision);
                }
            }

            return $0;
        });
    } else if (l) {
        if (value instanceof Error && value.stack) {
            s = value.stack;
            stack = true;
        } else {
            s = inspect(value);
        }
    }

    l -= usesKwargs;

    //  need to inspect extra positional arguments
    while (pos < l) {
        value = args[pos];
        pos += 1;
        if (value && typeof value === 'object') {
            if (value instanceof Error && value.stack) {
                s += '\n' + value.stack;
                stack = true;
            } else {
                if (stack) {
                    s += '\n';
                    stack = false;
                } else {
                    s += ' ';
                }
                s += inspect(value);
            }
        } else {
            if (stack) {
                s += '\n';
                stack = false;
            } else {
                s += ' ';
            }
            s += value;
        }
    }

    return s;
};

//  %s
strf.format.s = function (value, sign, width, precision) {
    value = String(value);

    if (precision) {
        value = value.substr(0, precision);
    }

    if (width) {
        if (sign === '-') {
            while (value.length < width) {
                value += ' ';
            }
        } else {
            while (value.length < width) {
                value = ' ' + value;
            }
        }
    }

    return value;
};

//  %j
strf.format.j = function (value, sign, width, precision) {
    try {
        value = JSON.stringify(value);
    } catch (e) {
        value = '[Circular]';
    }

    return strf.format.s(value, sign, width, precision);
};

//  %d
strf.format.d = function (value, sign, width, precision) {
    /*eslint complexity: 0*/
    var pad = ' ';
    var pfx = '';

    value = parseInt(value, 10);

    if (value < 0) {
        pfx = '-';
    } else if (sign === '+') {
        pfx = '+';
    }

    value = String(Math.abs(value));

    if (precision) {
        while (value.length < precision) {
            value = '0' + value;
        }
    }

    if (!width) {
        return pfx + value;
    }

    if (sign === '-') {
        value = pfx + value;

        while (value.length < width) {
            value += pad;
        }

        return value;
    }

    if (width.length > 1 && width.charAt(0) === '0') {
        pad = '0';
        width = width.substr(1);

        while ((pfx + value).length < width) {
            value = pad + value;
        }

        return pfx + value;
    }

    value = pfx + value;

    while (value.length < width) {
        value = pad + value;
    }

    return value;
};

module.exports = strf;
