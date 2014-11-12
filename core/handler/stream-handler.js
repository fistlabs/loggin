'use strict';

var Layout = /** @type Handler */ require('../layout/layout');

var _ = require('lodash-node');
var assert = require('chai').assert;

/**
 * @class Handler
 *
 * @param {Object} params
 * @param {Layout} layout
 * */
function Handler(params, layout) {
    params = Object(params);

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {Object}
     * */
    this.params = params;

    assert.instanceOf(layout, Layout);

    assert.isObject(params.stream);
    assert.isFunction(params.stream.write);
    assert.isObject(params.streams);

    _.forOwn(params.streams, function (stream) {
        assert.isObject(stream);
        assert.isFunction(stream.write);
    });

    /**
     * @public
     * @memberOf {Handler}
     * @property
     * @type {Layout}
     * */
    this._layout = layout;
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
    this._handleResult(vars, this._layout.format(vars));
};

/**
 * @protected
 * @memberOf {Handler}
 * @method
 *
 * @param {Object} vars
 * @param {*} entry
 * */
Handler.prototype._handleResult = function (vars, entry) {
    var stream = this.params.stream;

    if (this.params.streams[vars.level]) {
        stream = this.params.streams[vars.level];
    }

    stream.write(entry);
};

module.exports = Handler;
