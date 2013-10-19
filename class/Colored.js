'use strict';

var Default = /** @type Default */ require('./Default');

var inherit = require('inherit');
var stylize = require('../format/stylize');

/**
 * @class Colored
 * @extends Default
 * */
var Colored = inherit(Default, /** @lends Default.prototype */ {

    /**
     * @protected
     * @memberOf {Default}
     * @property
     * @type {Object}
     * */
    _inspectOpts: {
        showHidden: true,
        depth: 10,
        colors: true
    },

    /**
     * @protected
     * @memberOf {Default}
     * @property
     * @type {Array<String>}
     * */
    _styles: {
        DBG: ['blue'],
        INF: ['aqua'],
        LOG: ['lime'],
        WRN: ['yellow'],
        ERR: ['red'],
        FATAL: ['fuchsia']
    },

    /**
     * @inheritdoc
     * @memberOf {Default}
     * */
    _formatDate: function (ts) {

        return stylize(['grey'], this.__base(ts));
    },

    /**
     * @inheritdoc
     * @memberOf {Default}
     * */
    _formatLevel: function (level) {

        return stylize(this._styles[level], level);
    },

    /**
     * @inheritdoc
     * @memberOf {Default}
     * */
    _formatPid: function (pid) {

        return stylize(['grey'], pid);
    }

});

module.exports = Colored;
