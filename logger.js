'use strict';

module.exports = require('has-color') ?
    require('./colored') : require('./default');
