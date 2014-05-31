var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var es6ify = require('es6ify');

es6ify.traceurOverrides = { blockBinding: true };

gulp.task('scripts', function() {
	browserify('./audio.js', {
		insertGlobals : false,
		debug : false
	})
	.bundle()
	.pipe(source('build.js'))
	.pipe(gulp.dest('./'))
	.on('error', function() {
		console.log(arguments);
	})
});

gulp.task('watch', function() {
	gulp.watch([
		'**/*.js',
		'!build.js',
		'!node_modules/**/*.js'
	], ['scripts']);
});

gulp.task('default', ['watch']);
