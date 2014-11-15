'use strict';

/**
 * @class Handler
 *
 * @param {Object} params
 * */
function Handler(params) {
    params = Object(params);

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {String}
     * */
    this.level = params.level;

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {Object}
     * */
    this.layout = params.layout;

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
 * @param {Object} vars
 * */
Handler.prototype.handle = function (vars) {
    this.stream.write(this.layout.format(vars));
};

module.exports = Handler;
