'use strict';

var StringFormatter = require('../string-formatter');

var strf = new StringFormatter();
var glob = require('glob');
var path = require('path');

glob.sync(path.join(__dirname, 'lib/types/*.js')).forEach(function (filename) {
    var typeName = path.basename(filename, '.js');
    strf.addType(typeName, require(filename));
});

module.exports = strf;
