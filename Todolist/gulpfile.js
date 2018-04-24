var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.task('styles', function() {

  gulp.src('assets/scss/*.scss')
      .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
      .pipe(gulp.dest('public/css/'));

});

// Watch for file changes
gulp.task('default', function() {
  gulp.watch('assets/scss/**/*.scss', ['styles']);
});
