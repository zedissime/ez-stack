'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'sass'] ,function () {
  gulp.watch('src/**/*.html', ['firsthtml']);
  gulp.watch('src/**/*.slim', ['slim']);
  gulp.watch('src/coffeescript/**/*.coffee', ['coffee']);
  gulp.watch('src/scss/**/*.scss', ['sass']);
  // gulp.watch('tmp/javascript/**/*.js', ['scripts']);
  gulp.watch('src/assets/images/**/*', ['img']);
  gulp.watch('bower.json', ['wiredep']);
});
