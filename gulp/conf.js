'use strict';

var gulp = require('gulp'),
		gutil = require('gulp-util'),
    path = require('path');

// keep backslashes
var paths = {
  src: 'src/',
  dist: 'dist/',
  tmp: '.tmp/'
};

exports.paths = paths;

exports.pipes = {
	scripts: function(config){
		return gulp.src([
			paths.src + '{app,components}/**/*.js',
			'!' + paths.src + '{app,components}/**/*.spec.js',
			'!' + paths.src + '{app,components}/**/*.mock.js'
		], config || {});
	},
	scss: function(config){
		return gulp.src([
			paths.src + 'assets/styles/**/*.scss',
			paths.src + '{app,components}/**/*.scss',
			'!' + paths.src + 'app/app.scss'
		], config || {});
	}
};

exports.errorHandler = function(title) {
  return function(err) {
    gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    this.emit('end');
  };
};
