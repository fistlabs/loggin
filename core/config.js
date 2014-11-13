'use strict';

var _ = require('lodash-node');

var Layout = /** @type Layout */ require('./layout/layout');
var Logging = /** @type Logging */ require('./logging');
var Handler = /** @type Handler */ require('./handler/stream-handler');

/**
 * @class Config
 */
function Config() {

    /**
     * @public
     * @memberOf {Config}
     * @property
     * @type {Object}
     * */
    this.configs = {};

    /**
     * @public
     * @memberOf {Config}
     * @property
     * @type {Object}
     * */
    this.layouts = {};

    /**
     * @public
     * @memberOf {Config}
     * @property
     * @type {Object}
     * */
    this.handlers = {};

    /**
     * @public
     * @memberOf {Config}
     * @property
     * @type {Object}
     * */
    this.loggings = {};
}

/**
 * @public
 * @memberOf {Config}
 * @method
 *
 * @param {Object} layouts
 *
 * @returns {Config}
 * */
Config.prototype.addLayouts = function (layouts) {
    _.extend(this.layouts, this._createLayouts(layouts));

    return this;
};

/**
 * @public
 * @memberOf {Config}
 * @method
 *
 * @param {Object} handlers
 *
 * @returns {Config}
 * */
Config.prototype.addHandlers = function (handlers) {
    _.extend(this.handlers, this._createHandlers(handlers));

    return this;
};

/**
 * @public
 * @memberOf {Config}
 * @method
 *
 * @param {Object} loggings
 *
 * @returns {Config}
 * */
Config.prototype.addLoggings = function (loggings) {
    _.extend(this.loggings, this._createLoggings(loggings));

    return this;
};

/**
 * @public
 * @memberOf {Config}
 * @method
 *
 * @param {Object} configs
 *
 * @returns {Config}
 * */
Config.prototype.conf = function (configs) {
    _.forOwn(configs, function (config, sect) {
        this.configs[sect] = _.extend(this.configs[sect] || {}, config);
    }, this);

    return this.addLayouts(this.configs.layouts).
        addHandlers(this.configs.handlers).
        addLoggings(this.configs.loggings);
};

/**
 * @protected
 * @memberOf {Config}
 * @method
 *
 * @param {Object} layouts
 *
 * @returns {Object}
 * */
Config.prototype._createLayouts = function (layouts) {
    return _.mapValues(layouts, function (config) {
        var LayoutClass;

        if (config instanceof Layout) {
            return config;
        }

        if (_.isFunction(config.Class)) {
            LayoutClass = config.Class;
        } else {
            LayoutClass = require(config.Class);
        }

        return new LayoutClass(config.params);
    }, this);
};

/**
 * @protected
 * @memberOf {Config}
 * @method
 *
 * @param {Object} handlers
 *
 * @returns {Object}
 * */
Config.prototype._createHandlers = function (handlers) {
    return _.mapValues(handlers, function (config) {
        var HandlerClass;

        if (config instanceof Handler) {
            return config;
        }

        if (_.isFunction(config.Class)) {
            HandlerClass = config.Class;
        } else {
            HandlerClass = require(config.Class);
        }

        return new HandlerClass(config.params, this.layouts[config.layout]);
    }, this);
};

/**
 * @protected
 * @memberOf {Config}
 * @method
 *
 * @param {Object} loggings
 *
 * @returns {Object}
 * */
Config.prototype._createLoggings = function (loggings) {
    return _.mapValues(loggings, function (config) {
        var LoggingClass;
        var logging;

        if (config instanceof Logging) {
            return config;
        }

        if (_.isFunction(config.Class)) {
            LoggingClass = config.Class;
        } else {
            LoggingClass = require(config.Class);
        }

        logging = new LoggingClass();

        _.forEach(config.handlers, function (handler) {
            return logging.addHandler(this.handlers[handler]);
        }, this);

        _.forOwn(config.records, function (opts, name) {
            var Record;

            if (_.isFunction(opts.Class)) {
                Record = opts.Class;
            } else {
                Record = require(opts.Class);
            }

            logging.addRecord(name, opts.level, Record);
        });

        return logging;
    }, this);
};

module.exports = Config;
