'use strict';

var conf = require('./conf'),
    gulp = require('gulp'),
    url = require('url'),
    runSequence = require('run-sequence').use(gulp),
    browserSync = require('browser-sync').create(),
    browserSyncSpa = require('browser-sync-spa'),
    proxy = require('proxy-middleware');


function browserSyncReload(event){
  browserSync.reload(event.path);
}

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;
	var proxyOptions = url.parse(conf.server.proxy.location);
	proxyOptions.route = conf.server.proxy.path;
	
  browserSync.instance = browserSync.init({
		open: true,
		port: conf.server.port,
    startPath: '/',
    server: {
      baseDir: baseDir,
      middleware: [proxy(proxyOptions)]
    },
    online: false,
    reloadDebounce: 5000,
    reloadDelay: 2000,
    browser: browser
  });
}

gulp.task('watch', function(cb){
  browserSyncInit([conf.paths.tmp, conf.paths.src]);

  gulp.watch([conf.paths.src +'{app,components}/**/*.scss', conf.paths.src + 'assets/styles/**/*.scss'], ['styles'])
    .on('error',  conf.errorHandler);

  gulp.watch(conf.paths.src + '{app,components}/**/*.js', ['injector:js'])
    .on('error',  conf.errorHandler);

  gulp.watch('bower.json', ['wiredep'])
    .on('error',  conf.errorHandler);

  gulp.watch(conf.paths.tmp +'**/*.css')
    .on('change',  browserSyncReload)
    .on('error',  conf.errorHandler);

  gulp.watch(conf.paths.src +'{app,components}/**/*.html', ['injector:partials'])
    .on('error',  conf.errorHandler);

  gulp.watch(conf.paths.tmp + "index.html")
    .on('change', browserSyncReload);

  cb();
});

browserSync.use(browserSyncSpa({
  selector: '[ng-app]'
}));

gulp.task('serve', function(cb){
  runSequence(
    'clean',
    'ng-config-development',
    'wiredep',
    'injector:css',
    'injector:js',
    'injector:partials',
    'watch',
  cb);
});

gulp.task('serve-dist', function(cb){
  runSequence('build', function(result){
      browserSyncInit(conf.paths.dist);
      cb(result);
  });
});
