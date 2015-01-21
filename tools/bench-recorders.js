/*eslint no-console: 0*/
'use strict';

var Benchmark = require('benchmark');
var Suite = Benchmark.Suite;

var _ = require('lodash-node');
var logging = require('../loggin');

var levels = {
    internal: 'INTERNAL',
    debug: 'DEBUG',
    note: 'NOTE',
    info: 'INFO',
    log: 'LOG',
    warn: 'WARNING',
    error: 'ERROR',
    fatal: 'FATAL'
};

logging.conf({
    logLevel: 'SILENT'
});

var optLogging = logging.bind('optLogging');
var normLogging = logging.bind('normLogging');

Benchmark.options.minSamples = 100;

_.forOwn(levels, function (level, name) {
    normLogging[name] = function () {
        return this.logging.record(this.context, levels[name], this[name], arguments);
    };
});

//  empty
logging.record = function () {};

new Suite().
    on('cycle', function (e) {
        console.log(String(e.target));
    }).
    add('optLogging', function () {
        global.__test__ = optLogging.internal('foo');
        global.__test__ = optLogging.debug('foo');
        global.__test__ = optLogging.note('foo');
        global.__test__ = optLogging.info('foo');
        global.__test__ = optLogging.log('foo');
        global.__test__ = optLogging.warn('foo');
        global.__test__ = optLogging.error('foo');
        global.__test__ = optLogging.fatal('foo');
    }).
    add('normLogging', function () {
        global.__test__ = normLogging.internal('foo');
        global.__test__ = normLogging.debug('foo');
        global.__test__ = normLogging.note('foo');
        global.__test__ = normLogging.info('foo');
        global.__test__ = normLogging.log('foo');
        global.__test__ = normLogging.warn('foo');
        global.__test__ = normLogging.error('foo');
        global.__test__ = normLogging.fatal('foo');
    }).
    run({
        async: true,
        queued: true
    });
