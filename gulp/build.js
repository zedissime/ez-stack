'use strict';

var gulp = require('gulp');
var slim = require('gulp-slim');
var coffee = require('gulp-coffee');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license']
});

function handleError(err) {
  console.error(err.toString());
  this.emit('end');
}

/*
   Dev tasks
   ========================================================================== */

gulp.task('sass', function () {
  return gulp.src('src/scss/*.scss')
    .pipe($.rubySass({style: 'expanded'}))
    .on('error', handleError)
    .pipe($.autoprefixer('last 1 version'))
    .pipe(gulp.dest('tmp/css'))
    .pipe($.size());
});

gulp.task('coffee', function(){
  gulp.src('src/coffeescript/**/*.coffee')
    .pipe(coffee({bare:true})
    .on('error', handleError))
    .pipe(gulp.dest('tmp/javascript'))
}); 

gulp.task('slim', function(){
  gulp.src("src/**/*.slim")
    .pipe(slim({
      pretty: true,
    }))
    .pipe(gulp.dest('tmp'));
});
gulp.task('firsthtml', function(){
  gulp.src(["src/**/*.html",'!src/bower_components/**'])
    .pipe(gulp.dest('tmp'));
})

gulp.task('img', function () {
  return gulp.src('src/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('tmp/assets/images'))
    .pipe($.size());
});

/*
   Pre-build task
   ========================================================================== */

gulp.task('scripts', ['coffee'], function () {
  return gulp.src('tmp/javascript/**/*.js')
    .pipe($.jshint())
    .on('error',handleError)
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.size());
});

gulp.task('html', ['firsthtml','slim','sass', 'coffee', 'scripts'], function () {
  var htmlFilter = $.filter('*.html');
  var jsFilter = $.filter('**/*.js');
  var cssFilter = $.filter('**/*.css');
  var assets;

  return gulp.src('tmp/**/*.html')
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe(cssFilter.restore())
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe(htmlFilter.restore())
    .pipe(gulp.dest('dist'))
    .pipe($.size());
});

/*
   Common tasks
   ========================================================================== */

gulp.task('images', function () {
  return gulp.src('tmp/assets/images/**/*')
    .pipe($.cache($.imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    })))
    .pipe(gulp.dest('dist/assets/images'))
    .pipe($.size());
});

gulp.task('fonts', function () {
  return gulp.src($.mainBowerFiles())
    .pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/fonts'))
    .pipe($.size());
});

gulp.task('clean', function () {
  gulp.src(['tmp/**', 'dist/**'], { read: false })
  .pipe($.rimraf())
  .on('error', handleError)
});

/*
   Build
   ========================================================================== */

gulp.task('build', ['html', 'images', 'fonts']);
