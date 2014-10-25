var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat')
  less = require('gulp-less')
  cssmin = require('gulp-minify-css')
  plumber = require('gulp-plumber');

var vendorjs = [
  'src/js/vendor/URIjs/src/URI.js',
  'src/js/vendor/angular-hotkeys/build/hotkeys.js',
  'src/js/vendor/angular-localforage/dist/angular-localForage.js',
  'src/js/vendor/angular/angular.js',
  'src/js/vendor/jquery/dist/jquery.js',
  'src/js/vendor/localforage/dist/localforage.js',
  'src/js/vendor/moment-recur/moment-recur.js',
  'src/js/vendor/moment/moment.js',
  //'src/js/vendor/q/q.js',
  'src/js/vendor/ui-router/release/angular-ui-router.js'
];

var vendorcss = [
  'html/js/vendor/bootstrap/less/bootstrap.less'
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

