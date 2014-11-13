'use strict';

var Handler = /** @type Handler */ require('./handler/stream-handler');
var Semver = require('semver');

var _ = require('lodash-node');
var assert = require('chai').assert;
var getStorage = require('./util/global-storage');
var packageJson = require('../package');
var version = new Semver(packageJson.version);

/**
 * @class Logging
 * */
function Logging() {
    function Logger(name) {

        /**
         * @public
         * @memberOf {Logging}
         * @property
         * @type {String}
         * */
        this.name = name;
    }

    Logger.prototype = {
        bind: function (name) {
            return new Logger(this.name + ':' + name);
        }
    };

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Function}
     * */
    this.Logger = Logger;

    /**
     * @protected
     * @memberOf {Logging}
     * @property
     * @type {Array}
     * */
    this._handlers = [];

    /**
     * @protected
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this._storage = Logging.getStorage();
}

/**
 * @public
 * @memberOf {Logging}
 * @method
 * @constructs
 * */
Logging.prototype.constructor = Logging;

/**
 * @public
 * @memberOf {Logging}
 * @method
 *
 * @param {Handler} handler
 *
 * @returns {Logging}
 * */
Logging.prototype.addHandler = function (handler) {
    assert.instanceOf(handler, Handler);
    this._handlers.push(handler);
    return this;
};

/**
 * @public
 * @memberOf {Logging}
 * @method
 *
 * @param {Array<Handler>} handlers
 *
 * @returns {Logging}
 * */
Logging.prototype.setHandlers = function (handlers) {
    assert.isArray(handlers);
    this._handlers = [];
    _.forEach(handlers, this.addHandler, this);
    return this;
};

/**
 * @public
 * @memberOf {Logging}
 * @method
 *
 * @param {String} name
 * @param {String} level
 * @param {Function} Record
 *
 * @returns {Logging}
 * */
Logging.prototype.addRecord = function (name, level, Record) {
    var self = this;
    assert.isString(name);
    assert.isString(level);
    assert.ok(_.has(this._storage.levels, level));
    assert.isFunction(Record);

    this.Logger.prototype[name] = function () {
        return self._record(Record, level, this.name, arguments);
    };

    return this;
};

/**
 * @public
 * @memberOf {Logging}
 * @param {String} [name]
 *
 * @returns {Object}
 * */
Logging.prototype.getLogger = function (name) {
    return new this.Logger(name || '');
};

/**
 * @protected
 * @memberOf {Logging}
 * @method
 *
 * @param {Function} Record
 * @param {String} level
 * @param {String} name
 * @param {Array|Arguments} args
 *
 * @returns {Boolean}
 * */
Logging.prototype._record = function (Record, level, name, args) {
    var i;
    var l;
    var handlers;
    var levels = this._storage.levels;
    var logLevel = this._storage.logLevel;
    var record;

    if (levels[level] < levels[logLevel]) {
        return false;
    }

    record = new Record(name, level, args);
    handlers = this._handlers;

    for (i = 0, l = handlers.length; i < l; i += 1) {
        handlers[i].handle(record.getVars());
    }

    return true;
};

/**
 * @public
 * @static
 * @memberOf {Logging}
 * @method
 *
 * @returns {Object}
 * */
Logging.getStorage = function () {
    var storage = getStorage(packageJson.name, version.major);
    if (!_.isObject(storage.levels)) {
        storage.levels = {};
    }
    return storage;
};

/**
 * @public
 * @static
 * @memberOf {Logging}
 * @method
 *
 * @param {String} level
 *
 * @returns {Logging}
 * */
Logging.setLevel = function (level) {
    var storage = Logging.getStorage();
    assert.ok(_.has(storage.levels, level));
    storage.logLevel = level;
};

module.exports = Logging;
