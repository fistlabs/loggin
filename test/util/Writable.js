'use strict';

var StdWritable = require('stream').Writable;

function Writable () {
    StdWritable.apply(this, arguments);
    this.pends = [];
}

Writable.prototype = Object.create(StdWritable.prototype);

Writable.prototype._write = function (chunk, enc, cb) {
    this.pends.push(chunk);
    cb();
};

Writable.create = function () {

    return new Writable();
};

module.exports = Writable;
