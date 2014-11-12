'use strict';

var Handler = /** @type Handler */ require('./handler/stream-handler');

var _ = require('lodash-node');
var assert = require('chai').assert;

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
     * @type {String}
     * */
    this._level = void 0;

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
    this._levels = {};
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
 * @returns {Logging}
 * */
Logging.prototype.setLevel = function (level) {
    assert.ok(_.has(this._levels, level));
    this._level = level;
    return this;
};

/**
 * @public
 * @memberOf {Logging}
 * @method
 *
 * @param {String} levelName
 * @param {Number} weight
 *
 * @returns {Logging}
 * */
Logging.prototype.addLevel = function (levelName, weight) {
    assert.isString(levelName);
    assert.isNumber(weight);
    this._levels[levelName] = weight;
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
    assert.ok(_.has(this._levels, level));
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
    var levels = this._levels;
    var record;

    if (levels[level] < levels[this._level]) {
        return false;
    }

    record = new Record(name, level, args);
    handlers = this._handlers;

    for (i = 0, l = handlers.length; i < l; i += 1) {
        handlers[i].handle(record.getVars());
    }

    return true;
};

module.exports = Logging;
