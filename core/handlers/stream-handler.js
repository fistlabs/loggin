'use strict';

var NullHandler = /** @type NullHandler*/ require('./null-handler');

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
 * @extends NullHandler
 *
 * @param {Object} layout
 * @param {Object} params
 * */
function StreamHandler(layout, params) {
    NullHandler.call(this, layout, params);

    /**
     * @public
     * @memberOf {StreamHandler}
     * @property
     * @type {Object}
     * */
    this.stream = this.params.stream;
}

StreamHandler.prototype = Object.create(NullHandler.prototype);

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
