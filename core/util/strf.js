'use strict';

var R_TOKENS = /^(?:%(%)|%(?:\(((?:[^()]+|"[^"]*"|'[^']*')+)\))?([+-])?(\d+)?(?:\.(\d+))?([a-z])|([^%]+)|([\s\S]+))/;

var get = require('obus').get;
var hasProperty = Object.prototype.hasOwnProperty;
var inspect = require('util').inspect;

function strf() {
    return strf.format(arguments);
}

strf.cache = {};

strf.parse = function (s) {
    if (!hasProperty.call(strf.cache, s)) {
        strf.cache[s] = parse(s);
    }

    return strf.cache[s];
};

function parse(s) {
    var m;
    var parts = [];

    /*eslint no-cond-assign: 0*/
    while (m = R_TOKENS.exec(s)) {
        s = s.substr(m[0].length);

        if (m[1]) {
            parts[parts.length] = m[1];
            continue;
        }

        if (!m[6]) {
            parts[parts.length] = m[7] || m[8];
            continue;
        }

        parts[parts.length] = [m[6], m[2], m[3], m[4], m[5], m[0]];
    }

    return parts;
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
    var parts;
    var i;
    var j;
    var part;

    if (typeof value === 'string') {
        parts = strf.parse(value);

        for (i = 0, j = parts.length; i < j; i += 1) {
            part = parts[i];

            if (typeof part === 'string') {
                s += part;
                continue;
            }

            if (hasProperty.call(strf.format, part[0])) {
                if (part[1]) {
                    usesKwargs = true;
                    value = get(kwargs, part[1]);
                } else {
                    value = args[pos];
                    pos += 1;
                }

                s += strf.format[part[0]](value, part[2], part[3], part[4]);
                continue;
            }

            s += part[5];
        }

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
