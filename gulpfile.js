var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat')
  less = require('gulp-less')
  cssmin = require('gulp-minify-css')
  plumber = require('gulp-plumber')
  jasmine = require('gulp-jasmine');

var vendorjs = [
  'src/vendor/URIjs/src/URI.js',
  'src/vendor/jquery/dist/jquery.js',
  'src/vendor/localforage/dist/localforage.js',
  'src/vendor/moment/moment.js',
  'src/vendor/moment-recur/moment-recur.js',
  //'src/vendor/q/q.js',
  'src/vendor/angular/angular.js',
  'src/vendor/angular-hotkeys/build/hotkeys.js',
  'src/vendor/angular-localforage/dist/angular-localForage.js',
  'src/vendor/ui-router/release/angular-ui-router.js'
];

var appjs = [
  'src/js/**/*.js',
  '!src/js/**/*.spec.js'
];

var appspecjs = [
  'src/js/**/*.spec.js'
];

var vendorcss = [
  'src/vendor/bootstrap/less/bootstrap.less'
];

gulp.task('minifyVendorJs', function () {
  gulp.src(vendorjs)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('html/js'));
});

gulp.task('copyAppJs', function () {
  gulp.src(appjs)
    .pipe(gulp.dest('html/js'));
});

gulp.task('copyAppHTML', function () {
  gulp.src('src/js/**/*.tpl.html')
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

gulp.task('test', function () {
  gulp.src(appspecjs)
    .pipe(jasmine());
});

gulp.task('watch-js', function(){
  gulp.watch(appjs, ['copyAppJs']);
});

gulp.task('watch-html', function(){
  gulp.watch('src/js/**/*.tpl.html', ['copyAppHTML']);
});

gulp.task('watch-test', function(){
  gulp.watch(appspecjs, ['test']);
});

gulp.task('watch', ['watch-js', 'watch-html']);

gulp.task('build', ['minifyVendorJs', 'copyAppJs', 'copyAppHTML', 'minifycss']);
