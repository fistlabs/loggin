'use strict';

var gulpMocha = require('gulp-mocha');
var gulpIstanbul = require('gulp-istanbul');
var istanbulPipe = gulpIstanbul();
var writePipe = gulpIstanbul.writeReports();
var mochaPipe = gulpMocha({
    ui: 'bdd',
    reporter: 'spec',
    checkLeaks: true,
    slow: Infinity
});

function runMocha(done) {

    this.src('test/*.js').pipe(mochaPipe).on('end', done);
}

function runCover(done) {
    var self = this;

    this.src([
        './loggin.js',
        'core/**/*.js'
    ])
        .pipe(istanbulPipe)
        .pipe(gulpIstanbul.hookRequire())
        .on('finish', function () {
            self.src('test/*.js')
                .pipe(mochaPipe)
                .pipe(writePipe)
                .on('end', done);
        });
}

module.exports = function () {
    this.task('unit', [], runMocha);
    this.task('cover', [], runCover);
    this.task('test', ['lint'], runCover);
};
