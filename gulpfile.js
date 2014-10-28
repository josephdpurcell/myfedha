var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat')
  less = require('gulp-less')
  cssmin = require('gulp-minify-css')
  plumber = require('gulp-plumber');

var vendorjs = [
  'src/vendor/URIjs/src/URI.js',
  'src/vendor/angular-hotkeys/build/hotkeys.js',
  'src/vendor/angular-localforage/dist/angular-localForage.js',
  'src/vendor/angular/angular.js',
  'src/vendor/jquery/dist/jquery.js',
  'src/vendor/localforage/dist/localforage.js',
  'src/vendor/moment-recur/moment-recur.js',
  'src/vendor/moment/moment.js',
  //'src/vendor/q/q.js',
  'src/vendor/ui-router/release/angular-ui-router.js'
];

var vendorcss = [
  'src/vendor/bootstrap/less/bootstrap.less'
];

gulp.task('minifyjs', function () {
  gulp.src(vendorjs)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('html/js'));
});

gulp.task('concatjs', function () {
  gulp.src(vendorjs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('html/js'));
});

gulp.task('minifycss', function () {
  gulp.src(vendorcss)
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest('html/styles'));
});

