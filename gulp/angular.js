'use strict';

var conf = require('./conf'),
    gulp = require('gulp'),
    ngConstant = require('gulp-ng-constant'),
    bowerFile = require('../bower.json'),
    packageFile = require('../package.json');

var ENV = {
	application: bowerFile.name || '',
	version: bowerFile.version || '',
	buildDate: new Date().toUTCString(),
	generator: packageFile.name || ''
};

gulp.task('ng-config-development', function () {
	ENV.name = 'development';
	return ngConstant({
		name: 'app.config',
		stream: true,
		constants: {
			ENV: ENV
		}
	})
  .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('ng-config-production', function () {
	ENV.name = 'production';
	return ngConstant({
		name: 'app.config',
		stream: true,
		constants: {
			ENV: ENV
		}
	})
  .pipe(gulp.dest(conf.paths.tmp));
});
