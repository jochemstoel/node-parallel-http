var gulp        = require('gulp');
var jshint      = require('gulp-jshint');
var stylish     = require('jshint-stylish');
var beautify    = require('gulp-beautify');
var uglify      = require("gulp-uglify");
var renameGulp  = require("gulp-rename");
var runSequence = require('run-sequence');
var browserify = require('browserify');
var concat = require('gulp-concat');


gulp.task('jshint', function() {
  return gulp.src('./src/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('beautify', function() {
  gulp.src('./src/*.js')
    .pipe(beautify({indentSize: 2}))
    .pipe(gulp.dest('.'))
});

gulp.task('minifyjs', function () {
   gulp.src('./dist/node-parallel-http.js')
    .pipe(renameGulp("node-parallel-http.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', function () {
   gulp.src('./src/*.js')
    .pipe(concat('node-parallel-http.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default',
	 runSequence('beautify','build','minifyjs')
);