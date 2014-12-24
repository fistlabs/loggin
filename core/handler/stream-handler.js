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
 * @class StreamHandler
 *
 * @param {Object} layout
 * @param {Object} params
 * */
function StreamHandler(layout, params) {
    params = Object(params);

    /**
     * @public
     * @memberOf {StreamHandler}
     * @property
     * @type {Object}
     * */
    this.layout = layout;

    /**
     * @public
     * @memberOf {StreamHandler}
     * @property
     * @type {String}
     * */
    this.minLevel = params.minLevel;

    /**
     * @public
     * @memberOf {StreamHandler}
     * @property
     * @type {String}
     * */
    this.maxLevel = params.maxLevel;

    /**
     * @public
     * @memberOf {StreamHandler}
     * @property
     * @type {Object}
     * */
    this.stream = params.stream;
}

/**
 * @public
 * @memberOf {StreamHandler}
 * @method
 * @constructs
 * */
StreamHandler.prototype.constructor = StreamHandler;

/**
 * @public
 * @memberOf {StreamHandler}
 * @method
 *
 * @param {*} message
 * */
StreamHandler.prototype.handle = function (message) {
    this.stream.write(message);
};

module.exports = StreamHandler;
