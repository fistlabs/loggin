/*eslint complexity: 0*/
'use strict';

var Logger = /** @type Logger */ require('./logger');
var LogginConfError = /** @type LogginConfError */require('./error/loggin-conf-error');

var _ = require('lodash-node');
var duck = require('./util/duck');

/**
 * @class Logging
 * */
function Logging() {

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
    this.levels = {
        INTERNAL: 0,
        DEBUG: 45,
        NOTE: 80,
        INFO: 110,
        LOG: 135,
        WARNING: 155,
        ERROR: 170,
        FATAL: 175
    };

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
            throw new LogginConfError('No such handler ' + handler);
        }
    }, this);

    if (_.has(configs, 'logLevel')) {
        this.logLevel = configs.logLevel;
    }

    return this;
};

/**
 * @public
 * @memberOf {Logging}
 * @method
 *
 * @param {String} [context]
 *
 * @returns {Logger}
 * */
Logging.prototype.getLogger = function (context) {
    var logger = new Logger(this, process.pid);

    if (context) {
        return logger.bind(context);
    }

    return logger;
};

/**
 * @public
 * @memberOf {Logger}
 * @method
 *
 * @param {String} context
 * @param {String} level
 * @param {Function} caller
 * @param {Array|Arguments} args
 *
 * @returns {Boolean}
 * */
Logging.prototype.record = function (context, level, caller, args) {
    var enabled;
    var handler;
    var i;
    var l;
    var layout;
    var levels = this.levels;
    var logLevel = this.logLevel;
    var minLevel = levels[level];
    var record;

    if (minLevel >= levels[logLevel]) {
        enabled = this.configs.enabled;

        for (i = 0, l = enabled.length; i < l; i += 1) {
            handler = this.handlers[enabled[i]];

            if (minLevel < levels[handler.level]) {
                continue;
            }

            layout = handler.layout;
            record = layout.record;

            handler.handle(layout.format(record.create(context, level, caller, args)));
        }

        return true;
    }

    return false;
};

Logging.prototype._createRecords = function (records) {
    return _.mapValues(records, function (config) {
        var RecordClass;

        if (duck.isRecord(config)) {
            return config;
        }

        if (!_.has(config, 'Class')) {
            throw new LogginConfError('Record config must be a {Record} or specify Record constructor');
        }

        RecordClass = config.Class;

        if (!_.isFunction(RecordClass)) {
            RecordClass = require(RecordClass);
        }

        if (!_.isFunction(RecordClass)) {
            throw new LogginConfError('record.Class must specify constructor');
        }

        config = new RecordClass(config.kwargs);

        if (!duck.isRecord(config)) {
            throw new LogginConfError('Record constructor must construct a record');
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
            throw new LogginConfError('Layout config must be a {Layout} or specify Layout constructor');
        }

        LayoutClass = config.Class;

        if (!_.isFunction(LayoutClass)) {
            LayoutClass = require(LayoutClass);
        }

        if (!_.isFunction(LayoutClass)) {
            throw new LogginConfError('layout.Class must specify constructor');
        }

        record = this.records[config.record];

        if (!duck.isRecord(record)) {
            throw new LogginConfError('No such record instance ' + config.record);
        }

        config = new LayoutClass(record, config.kwargs);

        if (!duck.isLayout(config)) {
            throw new LogginConfError('Layout constructor must construct a layout');
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
            throw new LogginConfError('Handler config must be a {Handler} or specify Handler constructor');
        }

        HandlerClass = config.Class;

        if (!_.isFunction(HandlerClass)) {
            HandlerClass = require(HandlerClass);
        }

        if (!_.isFunction(HandlerClass)) {
            throw new LogginConfError('handler.Class must specify constructor');
        }

        layout = this.layouts[config.layout];

        if (!duck.isLayout(layout)) {
            throw new LogginConfError('No such layout instance' + config.layout);
        }

        config = new HandlerClass(layout, config.kwargs);

        if (!duck.isHandler(config)) {
            throw new LogginConfError('Handler constructor must construct a handler');
        }

        return config;
    }, this);
};

module.exports = Logging;
