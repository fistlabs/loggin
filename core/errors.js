'use strict';

/**
 * @class LogginConfError
 * @extends Error
 *
 * @param {String} message
 * */
function LogginConfError(message) {
    var error = new Error(message);

    /**
     * @public
     * @memberOf {LogginConfError}
     * @property
     * @type {String}
     * */
    this.name = error.name = this.name;

    Error.captureStackTrace(error, this.constructor);

    /**
     * @public
     * @memberOf {LogginConfError}
     * @property
     * @type {String}
     * */
    this.message = error.message;

    /**
     * @public
     * @memberOf {LogginConfError}
     * @property
     * @type {String}
     * */
    this.stack = error.stack;
}

LogginConfError.prototype = Object.create(Error.prototype);

LogginConfError.prototype.constructor = LogginConfError;

/**
 * @public
 * @memberOf {LogginConfError}
 * @property
 * @type {String}
 * */
LogginConfError.prototype.name = LogginConfError.name;

exports.LogginConfError = LogginConfError;
