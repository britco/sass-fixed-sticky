path = require('path')
fs = require('fs')
browserify = require('browserify')
gulp = require('gulp')
coffee = require('gulp-coffee')
sass = require('gulp-sass')
gutil = require('gulp-util')
watch = require('gulp-watch')
source = require('vinyl-source-stream')
extReplace = require('gulp-ext-replace')
runSequence = require('run-sequence')
bump = require('gulp-bump')
footer = require('gulp-footer')

DIR_ROOT = __dirname
DIR_BUILD = path.join(__dirname,'./dist')
DIR_SRC = path.join(__dirname, './src')
DIR_DEMO = path.join(__dirname, './demo')
FILE_FIXED_STICKY_CSS = path.join(__dirname, './bower_components/filament-sticky/fixedsticky.css')

gulp.task 'scripts', ->
	bundle = browserify({
		entries: ["#{DIR_SRC}/sass-fixed-sticky.coffee"]
	}).bundle({standalone: 'sassFixedSticky'})

	bundle
	.pipe(source('sass-fixed-sticky.js'))
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:imports', ->
	gulp.src(FILE_FIXED_STICKY_CSS)
  .pipe(extReplace('.scss'))
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:main', ->
	gulp.src("#{DIR_SRC}/*.scss")
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:demo', (callback) ->
	gulp.src("#{DIR_DEMO}/*.scss")
	.pipe(sass(
		errLogToConsole: true
		sourceComments: 'normal'
		includePaths: [
			path.join(__dirname,'./dist/')
		]
	))
	.pipe(gulp.dest(DIR_DEMO))

gulp.task 'styles', (callback) ->
	runSequence('styles:imports', 'styles:main', 'styles:demo', callback)

gulp.task 'default', ['scripts', 'styles'], ->
	watch({glob: "#{DIR_SRC}/**/*.coffee"}, ['scripts'])
	watch({glob: "#{DIR_ROOT}/**/*.scss"}, ['styles'])

gulp.task 'build', ['scripts', 'styles']

gulp.task 'bump', ->
	gulp.src(['./bower.json', './package.json'])
	.pipe(bump({type:'patch'}))
	.pipe(gulp.dest('./'));