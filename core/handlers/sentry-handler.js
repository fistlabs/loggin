'use strict';

var NullHandler = /** @type NullHandler */ require('./null-handler');

var sentry = require('@sentry/minimal');

var levelMap = {
    INTERNAL: 'debug',
    DEBUG: 'debug',
    NOTE: 'debug',
    INFO: 'info',
    LOG: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    FATAL: 'fatal'
};

/**
 * @usage
 *  logging.conf({
 *      handlers: {
 *          myHandler: {
 *              Class: 'loggin/handler/sentry-handler',
 *              layout: 'compact',
 *              kwargs: {
 *                  dsn: '<Sentry dsn>',
 *                  options: {<raven Client options>}
 *              }
 *          }
 *      }
 *  });
 * @class SentryHandler
 * @extends NullHandler
 *
 * @param {Object} layout
 * @param {Object} params
 * */
function SentryHandler(layout, params) {
    NullHandler.call(this, layout, params);

    /**
     * @public
     * @memberOf {SentryHandler}
     * @property
     * @type {raven.Client}
     * */
    this.client = sentry;
}

SentryHandler.prototype = Object.create(NullHandler.prototype);

/**
 * @public
 * @memberOf {SentryHandler}
 * @method
 * @constructs
 * */
SentryHandler.prototype.constructor = SentryHandler;

/**
 * @public
 * @memberOf {SentryHandler}
 * @method
 *
 * @param {*} vars
 * */
SentryHandler.prototype.handle = function (vars) {
    var messageText = vars.message;
    var kwargs = {
        level: levelMap[vars.level],
        extra: vars
    };

    delete vars.message;

    if (messageText instanceof Error) {
        this.client.captureError(messageText, kwargs);
    } else {
        this.client.captureMessage(messageText, kwargs);
    }

};

module.exports = SentryHandler;
