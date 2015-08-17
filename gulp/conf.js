'use strict';

var gutil = require('gulp-util'),
    path = require('path');

var paths = {
  src: 'src',
  dist: 'dist',
  tmp: '.tmp'
};

exports.paths = {
  src: path.join(paths.src, '/'),
  dist: path.join(paths.dist, '/'),
  tmp: path.join(paths.tmp, '/')
};

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
