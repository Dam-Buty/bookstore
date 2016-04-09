var path = require("path");

var packageJSON  = require('./package');
var jshintConfig = packageJSON.jshintConfig;

// include gulp & gulp-debug
var gulp = require('gulp');
var debug = require('gulp-debug');

// include plug-ins
var jshint = require('gulp-jshint');
var changed = require('gulp-changed');
var htmlhint = require("gulp-htmlhint");
var minifyHTML = require('gulp-htmlmin');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-cssnano');

var base = ".";

var src = "src";
var dst = "www";
var node = "node_modules";

var paths = {
  html: [
    path.join(base, src, "index.html"),
    path.join(base, src, "views/**/*.html")
  ],
  assets: [
    path.join(base, src, "assets/*.*"),
  ],
  scripts: [
    path.join(base, src, "app.js"),
    path.join(base, src, "views/**/*.js")
  ],
  vendorScripts: [
    path.join(base, node, "angular/angular.min.js"),
    path.join(base, node, "angular-route/angular-route.min.js"),
    path.join(base, node, "angular-utils-pagination/dirPagination.js"),
    path.join(base, node, "moment/min/moment-with-locales.min.js")
  ],
  styles: [path.join(base, src, "**/*.scss")],
  vendorCSS: [
    path.join(base, node, "purecss/build/pure-min.css"),
    path.join(base, node, "purecss/build/grids-responsive-min.css")
  ]
};

// JS hint
gulp.task('jshint', function() {
  gulp.src(paths.scripts)
    .pipe(jshint(jshintConfig))
    .pipe(jshint.reporter('default'));
});

// minify new or changed HTML pages
gulp.task('html', function() {
  gulp.src(paths.html, {base: src})
  .pipe(debug({title: 'Minifying HTML page :'}))
  .pipe(changed(dst))
  .pipe(htmlhint({
    "doctype-first": false
  }))
	.pipe(htmlhint.reporter())
  .pipe(minifyHTML({collapseWhitespace: true}))
  .pipe(gulp.dest(dst));
});

//JS concat, strip debugging and minify
gulp.task('scripts', function() {
    gulp.src(paths.scripts)
    .pipe(debug({title: 'Adding script file :'}))
    .pipe(concat('app.js'))
    // .pipe(stripDebug())
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest(path.join(base, dst, "js")));
});

//JS concat, strip debugging and minify
gulp.task('vendorScripts', function() {
    gulp.src(paths.vendorScripts)
    .pipe(debug({title: 'Adding vendor script :'}))
    .pipe(concat('vendor.js'))
    // .pipe(stripDebug())
    // .pipe(uglify())
    .pipe(gulp.dest(path.join(base, dst, "js")));
});

// Preprocess Sass, concat all, autoprefix and minify
gulp.task('styles', function () {
    gulp.src(paths.styles)
    .pipe(debug({title: 'Adding SASS stylesheet :'}))
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(autoprefix('last 2 versions'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.join(base, dst, "css")));
});

// minimize vendor CSS and pipe to /css
gulp.task("vendorCSS", function() {
    gulp.src(paths.vendorCSS)
    .pipe(concat('vendor.css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest(path.join(dst, "css")));
});

// just pipe the assets to the dst
gulp.task("assets", function() {
    gulp.src(paths.assets, {base: src})
    .pipe(debug({title: 'Adding asset :'}))
      .pipe(gulp.dest(dst));
});

// Rerun the task when a file changes
gulp.task('watch', function() {
  gulp.watch(paths.html, ['html']);
  gulp.watch(paths.styles, ['styles']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.assets, ['assets']);
  gulp.watch(paths.images, ['images']);
});

// default gulp task
gulp.task('default', ['html', 'styles', 'vendorCSS', 'scripts', 'vendorScripts', 'assets', 'watch']);
