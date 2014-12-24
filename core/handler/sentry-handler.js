'use strict';

var NullHandler = /** @type NullHandler */ require('./null-handler');

var raven = require('raven');

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
    this.client = new raven.Client(params.dsn, params.options);
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
 * @param {*} message
 * */
SentryHandler.prototype.handle = function (message) {
    //  Need as-is like layout
    this.client.captureMessage(message.message, message);
};

module.exports = SentryHandler;
