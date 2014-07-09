path = require('path')
fs = require('fs')
gulp = require('gulp')
coffee = require('gulp-coffee')
sass = require('gulp-sass')
gutil = require('gulp-util')
watch = require('gulp-watch')
extReplace = require('gulp-ext-replace')
runSequence = require('run-sequence')
bump = require('gulp-bump')

DIR_ROOT = __dirname
DIR_BUILD = path.join(__dirname,'./dist')
DIR_SRC = path.join(__dirname, './src')
DIR_TEST = path.join(__dirname, './test')
FILE_FIXED_STICKY_CSS = path.join(__dirname, './bower_components/filament-sticky/fixedsticky.css')

gulp.task 'scripts', ->
	gulp.src("#{DIR_SRC}/*.coffee")
	.pipe(coffee({bare: true})).on('error', gutil.log)
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:imports', ->
	gulp.src(FILE_FIXED_STICKY_CSS)
  .pipe(extReplace('.scss'))
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:main', ->
	gulp.src("#{DIR_SRC}/*.scss")
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:test', (callback) ->
	gulp.src("#{DIR_TEST}/*.scss")
	.pipe(sass(
		errLogToConsole: true
		sourceComments: 'normal'
		includePaths: [
			path.join(__dirname,'./dist/')
		]
	))
	.pipe(gulp.dest(DIR_TEST))

gulp.task 'styles', (callback) ->
	runSequence('styles:imports', 'styles:main', 'styles:test', callback)

gulp.task 'default', ['scripts', 'styles'], ->
	watch({glob: "#{DIR_SRC}/**/*.coffee"}, ['scripts'])
	watch({glob: "#{DIR_ROOT}/**/*.scss"}, ['styles'])

gulp.task 'build', ['scripts', 'styles']

gulp.task 'bump', ->
	gulp.src(['./bower.json', './package.json'])
	.pipe(bump({type:'patch'}))
	.pipe(gulp.dest('./'));