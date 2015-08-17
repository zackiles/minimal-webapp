'use strict';

var conf = require('./conf'),
    gulp = require('gulp'),
    runSequence = require('run-sequence').use(gulp),
    browserSync = require('browser-sync').create(),
    browserSyncSpa = require('browser-sync-spa');

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

  gulp.watch(conf.paths.src +'{app,components}/**/*.html', ['injector.partials'])
    .on('error',  conf.errorHandler);

  gulp.watch(conf.paths.tmp + "index.html")
    .on('change', browserSyncReload);

  cb();
});

function browserSyncReload(event){
  browserSync.reload(event.path);
}

function browserSyncInit(baseDir, browser) {
  browser = browser === undefined ? 'default' : browser;

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: {
      baseDir: baseDir
    },
    online: false,
    reloadDebounce: 5000,
    reloadDelay: 2000,
    browser: browser
  });
}
browserSync.use(browserSyncSpa({
  selector: '[ng-app]'
}));

gulp.task('serve', function(cb){
  runSequence('clean', 'wiredep', 'injector:css', 'injector:js', 'injector:partials','watch', cb);
});
gulp.task('serve-dist', function(cb){
  runSequence('clean', 'wiredep', 'injector:css', 'injector:js', 'injector:partials', 'html', function(result){
      browserSyncInit(conf.paths.dist);
      cb(result);
  });
});
