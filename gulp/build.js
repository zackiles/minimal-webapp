'use strict';

var conf = require('./conf'),
    gulp = require('gulp'),
    runSequence = require('run-sequence').use(gulp),
    path = require('path'),
    util = require('util'),
    wiredep = require('wiredep').stream,
    bowerFiles = require('bower-files')(),
    es = require('event-stream'),
    del = require('del'),
    $ = require('gulp-load-plugins')({
      pattern: ['gulp-*', 'uglify-save-license']
    });

gulp.task('wiredep', function () {
  return gulp.src(conf.paths.src + 'index.html')
    .pipe(wiredep({
      exclude: [/bootstrap-sass/],
      onError: function(err){
        console.error('There was an error with wiredep:', err.toString());
      }
    }))
    .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('injector:css', ['styles'], function () {
  return gulp.src(conf.paths.tmp + 'index.html')
    .pipe($.inject(gulp.src([conf.paths.tmp + '**/*.css'],{read: false}),
      {ignorePath: conf.paths.tmp, addRootSlash: false}
    ))
    .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('injector:js', ['scripts'], function () {
  return gulp.src(conf.paths.tmp + 'index.html')
    .pipe($.inject(conf.pipes.scripts().pipe($.angularFilesort()), {
      ignorePath: conf.paths.src,
      addRootSlash: false
    }))
    .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('injector:partials', ['partials'], function () {
  return gulp.src(conf.paths.tmp + 'index.html')
    .pipe($.inject(gulp.src(conf.paths.tmp + 'inject/templates.js', {read: false}), {
      starttag: '<!-- inject:partials -->',
      ignorePath: conf.paths.tmp,
      addRootSlash: false
    }).on('error', conf.errorHandler('Angular Template Cache')))
    .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('styles', function(){
  return gulp.src(conf.paths.src + 'app/app.scss')
    .pipe($.inject(conf.pipes.scss({read: false}), {
      transform: function(filePath) {
        filePath = filePath.replace(conf.paths.src + 'app/', '');
        filePath = filePath.replace(conf.paths.src + 'components/', '../components/');
        filePath = filePath.replace(conf.paths.src + 'assets/styles/', '../assets/styles/');
        return '@import \'' + filePath + '\';';
      },
      starttag: '// injector',
      endtag: '// endinjector',
      addRootSlash: false
    }))
    .pipe(gulp.dest(conf.paths.src + 'app/'))
    .pipe($.sass({style: 'expanded'}).on('error', $.sass.logError))
    .pipe($.autoprefixer())
    .pipe(gulp.dest(conf.paths.tmp +'app/'));
});

gulp.task('partials', function () {
  return gulp.src(conf.paths.src + '{app,components}/**/*.html')
    .pipe($.debug({title: 'Minifying Template:'}))
    .pipe($.htmlmin({
      removeComments : true,
      caseSensitive: true,
      keepClosingSlash: true,
      collapseWhitespace: true,
      conservativeCollapse : true,
      removeRedundantAttributes: true
    }))
    .pipe($.angularTemplatecache('inject/templates.js', {
      module: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp));
});

gulp.task('scripts', function () {
  return conf.pipes.scripts()
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('html', function () {
  var htmlFilter = $.filter('*.html', {restore: true});
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});
  var assets;

  return gulp.src(conf.paths.tmp + 'index.html')
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.replace('bower_components/bootstrap-sass/assets/fonts/bootstrap','assets/fonts'))
    .pipe($.replace('bower_components/font-awesome/fonts','assets/fonts'))
    .pipe($.minifyCss({ processImport: false }))
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.debug({title: 'Building:'}))
    .pipe($.htmlmin({
      removeComments : true,
      caseSensitive: true,
      keepClosingSlash: true,
      collapseWhitespace: true,
      conservativeCollapse : true,
      removeRedundantAttributes: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.size({ title: conf.paths.dist, showFiles: true }));
});

gulp.task('fonts', function () {
  var vendorFonts = gulp.src(bowerFiles.ext(['eot','svg','ttf','otf','woff','woff2']).files).pipe($.flatten());
  var extraFonts =  gulp.src([
		conf.paths.src + 'assets/fonts/**/*.{eot,svg,ttf,woff,otf,woff2}',
		conf.paths.src + 'bower_components/bootstrap-sass/assets/fonts/bootstrap/*.{eot,svg,ttf,woff,otf,woff2}',
		conf.paths.src + 'bower_components/font-awesome/fonts/*.{eot,svg,ttf,woff,otf,woff2}'
	]);

  return es.merge(vendorFonts, extraFonts)
		.pipe($.debug({title: 'Compressing Font:'}))
    .pipe(gulp.dest(conf.paths.dist + 'assets/fonts/'))
    .pipe($.size({ title: conf.paths.dist, showFiles: true }));
});

gulp.task('images', function () {
  return gulp.src(conf.paths.src + 'assets/images/**/*')
	  .pipe($.debug({title: 'Minifying Image:'}))
    .pipe($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(conf.paths.dist + 'assets/images/'))
    .pipe($.size({ title: conf.paths.dist, showFiles: true }));
});

gulp.task('other', function () {
  var icon = gulp.src(conf.paths.src + 'favicon.ico');
  var robots = gulp.src(conf.paths.src + 'robots.txt');

  return es.merge(icon, robots)
    .pipe(gulp.dest(conf.paths.dist))
    .pipe($.size({ title: conf.paths.dist, showFiles: true }));
});


gulp.task('clean', function (cb) {
  del([conf.paths.dist, conf.paths.tmp], cb);
});

gulp.task('build', function(cb){
  runSequence(
    'clean',
    'ng-config-production',
    'wiredep',
    'injector:css',
    'injector:js',
    'injector:partials',
    'html',
    'images',
    'fonts',
    'other',
  cb);
});
