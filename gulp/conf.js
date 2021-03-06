'use strict';

var gulp = require('gulp'),
		gutil = require('gulp-util'),
    path = require('path');

var paths = {
	// KEEP DIR BACKSLASHES
	src: 'src/',
	dist: 'dist/',
	tmp: '.tmp/'
};

module.exports = {
	paths: paths,
  server:  {
		port: 9090,
		proxy: {
			path: '/api',
			location: 'http://localhost:3000/api'
		}
	},
	pipes: {
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
	},
  errorHandler: function(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  }
};
