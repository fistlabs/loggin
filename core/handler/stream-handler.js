'use strict';

/**
 * @usage
 *  logging.conf({
 *      handlers: {
 *          myHandler: {
 *              Class: 'loggin/handler/stream-handler',
 *              layout: 'compact',
 *              kwargs: {
 *                  //  any writable interface allowed
 *                  stream: process.stdout
 *              }
 *          }
 *      }
 *  });
 * @class Handler
 *
 * @param {Object} layout
 * @param {Object} params
 * */
function Handler(layout, params) {

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {Object}
     * */
    this.layout = layout;

    params = Object(params);

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {String}
     * */
    this.minLevel = params.minLevel;

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {String}
     * */
    this.maxLevel = params.maxLevel;

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {Object}
     * */
    this.stream = params.stream;
}

/**
 * @public
 * @memberOf {Handler}
 * @method
 * @constructs
 * */
Handler.prototype.constructor = Handler;

/**
 * @public
 * @memberOf {Handler}
 * @method
 *
 * @param {*} message
 * */
Handler.prototype.handle = function (message) {
    this.stream.write(message);
};

module.exports = Handler;
