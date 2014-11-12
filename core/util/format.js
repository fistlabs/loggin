/*eslint complexity: 0*/
'use strict';

var hasProperty = Object.prototype.hasOwnProperty;
var sprintf = require('sprintf-js').sprintf;
var cache = {};
var util = require('util');

function parse(strf) {
    var tree;
    var i;
    var l;
    var argsCount;

    if (!hasProperty.call(cache, strf)) {
        tree = sprintf.parse(strf);
        argsCount = 0;
        for (i = 0, l = tree.length; i < l; i += 1) {
            if (typeof tree[i] === 'string') {
                continue;
            }

            argsCount += 1;
        }
        cache[strf] = {
            tree: tree,
            argsCount: argsCount
        };
    }

    return cache[strf];
}

function format(args, opts) {
    var arg = args[0];
    var argsCount = 0;
    var i;
    var l = args.length;
    var parseResult;
    var result = '';
    var stack = false;

    if (typeof arg === 'string') {
        parseResult = parse(arg);
        result = sprintf.format(parseResult.tree, args);
        argsCount = parseResult.argsCount;
    } else if (l) {
        if (arg instanceof Error && arg.stack) {
            result = arg.stack;
            stack = true;
        } else {
            result = util.inspect(arg, opts);
        }
    }

    for (i = argsCount + 1; i < l; i += 1) {
        arg = args[i];
        if (arg && typeof arg === 'object') {
            if (arg instanceof Error && arg.stack) {
                result += '\n' +  arg.stack;
                stack = true;
            } else {
                if (stack) {
                    result += '\n';
                    stack = false;
                } else {
                    result += ' ';
                }
                result +=  util.inspect(arg, opts);
            }
        } else {
            if (stack) {
                result += '\n';
                stack = false;
            } else {
                result += ' ';
            }
            result += arg;
        }
    }

    return result;
}

module.exports = format;
