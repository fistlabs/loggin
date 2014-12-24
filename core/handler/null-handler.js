'use strict';

/**
 * @class NullHandler
 *
 * @param {Object} layout
 * @param {Object} params
 * */
function NullHandler(layout, params) {

    /**
     * @public
     * @memberOf {NullHandler}
     * @property
     * @type {Object}
     * */
    this.params = params = Object(params);

    /**
     * @public
     * @memberOf {NullHandler}
     * @property
     * @type {Object}
     * */
    this.layout = layout;

    /**
     * @public
     * @memberOf {NullHandler}
     * @property
     * @type {String}
     * */
    this.minLevel = params.minLevel;

    /**
     * @public
     * @memberOf {NullHandler}
     * @property
     * @type {String}
     * */
    this.maxLevel = params.maxLevel;
}

/**
 * @public
 * @memberOf {NullHandler}
 * @method
 * @constructs
 * */
NullHandler.prototype.constructor = NullHandler;

/**
 * @public
 * @memberOf {NullHandler}
 * @method
 *
 * @param {*} message
 * */
NullHandler.prototype.handle = function (message) {
    /*eslint no-unused-vars: 0*/
};

module.exports = NullHandler;
