'use strict';

var hasProperty = Object.prototype.hasOwnProperty;

function error(input, s) {
    var pos = input.length - s.length;
    return new SyntaxError(input + '\n' + new Array(pos + 14).join(' ') + '^');
}

function parse(s) {
    /*eslint  default-case: 0, complexity: 0*/
    var orig = s;
    var m;
    var state = 'PROPERTY';
    var parts = [];

    if (/^\s*[^\s.\[]/.test(s)) {
        state = 'IDENT';
    }

    while (state !== 'EOF') {

        switch (state) {

            case 'PROPERTY':
                m = /^\s*([^\s])([\s\S]*)/.exec(s);

                if (m === null) {
                    state = 'EOF';
                    break;
                }

                s = m[2];
                m = m[1];

                if (m === '.') {
                    state = 'IDENT';
                    break;
                }

                if (m === '[') {
                    state = 'ACCESS';
                    break;
                }

                throw error(orig, s);

            case 'IDENT':
                m = /^\s*([a-z]\w*)([\s\S]*)$/i.exec(s);

                if (m === null) {
                    throw error(orig, s);
                }

                parts[parts.length] = {
                    type: 'STRING',
                    value: m[1]
                };

                s = m[2];

                state = 'PROPERTY';

                break;

            case 'ACCESS':
                m = /^\s*(\d+|['"])([\s\S]*)$/.exec(s);

                if (m === null) {
                    throw error(orig, s);
                }

                s = m[2];
                m = m[1];

                if (m === '"') {
                    state = 'STRING1';
                    break;
                }

                if (m === '\'') {
                    state = 'STRING2';
                    break;
                }

                parts[parts.length] = {
                    type: 'NUMBER',
                    value: parseInt(m, 10)
                };

                state = 'AFTER_ACCESS';

                break;

            case 'STRING1':
                m = /^([^"]*)"([\s\S]*)$/.exec(s);

                if (m === null) {
                    throw error(orig, s);
                }

                s = m[2];

                parts[parts.length] = {
                    type: 'STRING',
                    value: m[1]
                };

                state = 'AFTER_ACCESS';

                break;

            case 'STRING2':
                m = /^([^']*)'([\s\S]*)$/.exec(s);

                if (m === null) {
                    throw error(orig, s);
                }

                s = m[2];

                parts[parts.length] = {
                    type: 'STRING',
                    value: m[1]
                };

                state = 'AFTER_ACCESS';

                break;

            case 'AFTER_ACCESS':
                m = /^\s*]([\s\S]*)$/.exec(s);

                if (m === null) {
                    throw error(orig, s);
                }

                s = m[1];

                state = 'PROPERTY';
                break;
        }
    }

    return parts;
}

function getByParts(obj, parts) {
    var i;
    var k;
    var l;

    for (i = 0, l = parts.length; i < l; i += 1) {
        k = parts[i].value;

        if (obj && (typeof obj === 'object' || typeof obj === 'function') && hasProperty.call(obj, k)) {
            obj = obj[k];

            continue;
        }

        return void 0;
    }

    return obj;
}

function get(obj, path) {
    return getByParts(obj, get.parse(path));
}

get.parse = parse;

module.exports = get;
