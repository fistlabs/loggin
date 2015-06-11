/*eslint complexity: 0*/
'use strict';

var LEVELS = [
    'INTERNAL', // TODO deprecate ?
    'DEBUG',
    'NOTE', // TODO deprecate?
    'INFO',
    'LOG',
    'WARNING',
    'ERROR',
    'FATAL'
];

var Logger = /** @type Logger */ require('./logger');
var errors = require('./errors');

var _ = require('lodash-node');
var duck = require('./util/duck');

/**
 * @class Logging
 * @extends Logger
 * */
function Logging(name) {
    var logLevel = void 0;

    Logger.call(this, this, [name]);

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this.configs = {
        records: {},
        layouts: {},
        handlers: {},
        enabled: []
    };

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this.levels = _.mapValues(_.invert(LEVELS), Number);

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this.records = {};

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this.layouts = {};

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this.handlers = {};

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this.enabledLevels = {};

    Object.defineProperty(this, 'logLevel', {
        get: function () {
            return logLevel;
        },
        /*@this*/
        set: function (level) {
            logLevel = level;
            _.forOwn(this.levels, function (value, levelName) {
                this.enabledLevels[levelName] = value >= this.levels[this.logLevel];
            }, this);
        }
    });

    this.logLevel = logLevel;
}

Logging.prototype = Object.create(Logger.prototype);

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
 * @param {Object} configs
 *
 * @returns {Logging}
 * */
Logging.prototype.conf = function (configs) {
    configs = Object(configs);

    this.configs.records = _.extend(this.configs.records, configs.records);

    _.extend(this.records, this._createRecords(this.configs.records));

    this.configs.layouts = _.extend(this.configs.layouts, configs.layouts);

    _.extend(this.layouts, this._createLayouts(this.configs.layouts));

    this.configs.handlers = _.extend(this.configs.handlers, configs.handlers);

    _.extend(this.handlers, this._createHandlers(this.configs.handlers));

    if (_.has(configs, 'enabled')) {
        if (_.isArray(configs.enabled)) {
            this.configs.enabled = _.uniq(configs.enabled);
        } else {
            this.configs.enabled = [configs.enabled];
        }
    }

    _.forEach(this.configs.enabled, function (handler) {
        if (!duck.isHandler(this.handlers[handler])) {
            throw new errors.LogginConfError('No such handler ' + handler);
        }
    }, this);

    if (_.has(configs, 'logLevel')) {
        this.logLevel = configs.logLevel;
    }

    return this;
};

/**
 * @public
 * @memberOf {Logger}
 * @method
 *
 * @param {Array<String>} context
 * @param {String} level
 * @param {Function} caller
 * @param {Array|Arguments} args
 *
 * @returns {Boolean}
 * */
Logging.prototype.record = function (context, level, caller, args) {
    var enabled;
    var handler;
    var handlers = this.handlers;
    var i;
    var l;
    var layout;
    var levels = this.levels;
    var curLevel = levels[level];
    var record;

    if (!this.enabledLevels[level]) {
        return false;
    }

    enabled = this.configs.enabled;

    for (i = 0, l = enabled.length; i < l; i += 1) {
        handler = handlers[enabled[i]];

        //  support NaN handler.(min|max)Level
        if (curLevel < levels[handler.minLevel] || levels[handler.maxLevel] < curLevel) {
            continue;
        }

        layout = handler.layout;
        record = layout.record;

        handler.handle(layout.format(record.create(context, level, caller, args)));
    }

    return true;
};

/**
 * @protected
 * @memberOf {Logger}
 * @method
 *
 * @param {Object} records
 *
 * @returns {Object}
 * */
Logging.prototype._createRecords = function (records) {
    return _.mapValues(records, function (config) {
        var RecordClass;

        if (duck.isRecord(config)) {
            return config;
        }

        if (!_.has(config, 'Class')) {
            throw new errors.LogginConfError('Record config must be a {Record} or specify Record constructor');
        }

        RecordClass = config.Class;

        if (!_.isFunction(RecordClass)) {
            RecordClass = require(RecordClass);
        }

        if (!_.isFunction(RecordClass)) {
            throw new errors.LogginConfError('record.Class must specify constructor');
        }

        config = new RecordClass(config.kwargs);

        if (!duck.isRecord(config)) {
            throw new errors.LogginConfError('Record constructor must construct a record');
        }

        return config;
    });
};

/**
 * @protected
 * @memberOf {Logging}
 * @method
 *
 * @param {Object} layouts
 *
 * @returns {Object}
 * */
Logging.prototype._createLayouts = function (layouts) {
    return _.mapValues(layouts, function (config) {
        var LayoutClass;
        var record;

        if (duck.isLayout(config)) {
            return config;
        }

        if (!_.has(config, 'Class')) {
            throw new errors.LogginConfError('Layout config must be a {Layout} or specify Layout constructor');
        }

        LayoutClass = config.Class;

        if (!_.isFunction(LayoutClass)) {
            LayoutClass = require(LayoutClass);
        }

        if (!_.isFunction(LayoutClass)) {
            throw new errors.LogginConfError('layout.Class must specify constructor');
        }

        record = this.records[config.record];

        if (!duck.isRecord(record)) {
            throw new errors.LogginConfError('No such record instance ' + config.record);
        }

        config = new LayoutClass(record, config.kwargs);

        if (!duck.isLayout(config)) {
            throw new errors.LogginConfError('Layout constructor must construct a layout');
        }

        return config;
    }, this);
};

/**
 * @protected
 * @memberOf {Logging}
 * @method
 *
 * @param {Object} handlers
 *
 * @returns {Object}
 * */
Logging.prototype._createHandlers = function (handlers) {
    return _.mapValues(handlers, function (config) {
        var HandlerClass;
        var layout;

        if (duck.isHandler(config)) {
            return config;
        }

        if (!_.has(config, 'Class')) {
            throw new errors.LogginConfError('Handler config must be a {Handler} or specify Handler constructor');
        }

        HandlerClass = config.Class;

        if (!_.isFunction(HandlerClass)) {
            HandlerClass = require(HandlerClass);
        }

        if (!_.isFunction(HandlerClass)) {
            throw new errors.LogginConfError('handler.Class must specify constructor');
        }

        layout = this.layouts[config.layout];

        if (!duck.isLayout(layout)) {
            throw new errors.LogginConfError('No such layout instance ' + config.layout);
        }

        config = new HandlerClass(layout, config.kwargs);

        if (!duck.isHandler(config)) {
            throw new errors.LogginConfError('Handler constructor must construct a handler');
        }

        return config;
    }, this);
};

module.exports = Logging;
