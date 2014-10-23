var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat')
  less = require('gulp-less')
  cssmin = require('gulp-minify-css')
  plumber = require('gulp-plumber');

var vendorjs = [
  'html/js/vendor/jquery/dist/jquery.js',
  //'html/js/vendor/q/q.js',
  'html/js/vendor/localforage/dist/localforage.js',
  'html/js/vendor/moment/moment.js',
  'html/js/vendor/URIjs/src/URI.js',
  'html/js/vendor/angular/angular.js',
  'html/js/vendor/angular-hotkeys/build/hotkeys.js',
  'html/js/vendor/angular-localforage/dist/angular-localForage.js',
  'html/js/vendor/ui-router/release/angular-ui-router.js'
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

gulp.task('minifycss', function () {
  gulp.src(vendorcss)
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest('html/styles'));
});

