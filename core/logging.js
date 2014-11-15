'use strict';

var Logger = /** @type Logger */ require('./logger');
var Record = /** @type Record */ require('./record');

var _ = require('lodash-node');

function createLevels(logLevels) {
    var levelsObj = {};

    _.forEachRight(logLevels, function (level, i, levels) {
        var last = levels.length - 1;
        var c;
        var m;
        var y;

        level = levels[last - i];

        if (i === 0) {
            y = Infinity;
        } else if (i === last) {
            y = -Infinity;
        } else {
            i -= 1;
            last -= 2;
            c = (Math.pow(5, 0.5) + 1) / 2;
            m = last * Math.pow(c, last);
            y = -(i * Math.pow(c, i) - m) / m * 2 - 1;
        }

        levelsObj[level] = y * Number.MAX_VALUE;
    });

    return levelsObj;
}

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
    this.levels = createLevels([
        'INTERNAL',
        'DEBUG',
        'NOTE',
        'INFO',
        'LOG',
        'WARNING',
        'ERROR',
        'FATAL',
        'SILENT'
    ]);

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {String}
     * */
    this.logLevel = 'NOTE';

    /**
     * @public
     * @memberOf {Logging}
     * @property
     * @type {Object}
     * */
    this.configs = {
        enabled: [],
        layouts: {},
        handlers: {}
    };

    /**
     * @protected
     * @memberOf {Logging}
     * @property
     * @type {Array}
     * */
    this.enabled = [];

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
 * @param {Object} config
 *
 * @returns {Logging}
 * */
Logging.prototype.conf = function (config) {
    config = Object(config);

    this.configs.layouts = _.extend(this.configs.layouts, config.layouts);

    _.extend(this.layouts, this._createLayouts(this.configs.layouts));

    this.configs.handlers = _.extend(this.configs.handlers, config.handlers);

    _.extend(this.handlers, this._createHandlers(this.configs.handlers));

    if (_.has(config, 'enabled')) {
        this.configs.enabled = _.flatten(config.enabled);
    }

    if (_.has(config, 'enable')) {
        this.configs.enabled = this.configs.enabled.concat(_.flatten(config.enable));
    }

    this.configs.enabled = _.uniq(this.configs.enabled);

    this.enabled = _.map(this.configs.enabled, function (name) {
        return this.handlers[name];
    }, this);

    return this;
};

/**
 * @public
 * @memberOf {Logging}
 * @param {String} [name]
 *
 * @returns {Logger}
 * */
Logging.prototype.getLogger = function (name) {
    return new Logger(this, name);
};

/**
 * @public
 * @memberOf {Logger}
 * @method
 *
 * @param {String} name
 * @param {String} level
 * @param {Array|Arguments} args
 *
 * @returns {Boolean}
 * */
Logging.prototype.record = function (name, level, args) {
    var i;
    var l;
    var handler;
    var handlers;
    var levels = this.levels;
    var logLevel = this.logLevel;
    var record;

    if (levels[level] < levels[logLevel]) {
        return false;
    }

    record = new Record(name, level, args);
    handlers = this.enabled;

    for (i = 0, l = handlers.length; i < l; i += 1) {
        handler = handlers[i];

        if (levels[level] < levels[handler.level]) {
            continue;
        }

        handler.handle(record.getVars());
    }

    return true;
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

        if (_.isObject(config) && _.isFunction(config.format)) {
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

        if (_.isObject(config) && _.isFunction(config.handle)) {
            return config;
        }

        if (_.isFunction(config.Class)) {
            HandlerClass = config.Class;
        } else {
            HandlerClass = require(config.Class);
        }

        config = _.clone(config.params);
        config.layout = this.layouts[config.layout];

        return new HandlerClass(config);
    }, this);
};

module.exports = Logging;
