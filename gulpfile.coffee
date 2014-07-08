path = require('path')
fs = require('fs')
gulp = require('gulp')
coffee = require('gulp-coffee')
sass = require('gulp-sass')
gutil = require('gulp-util')
watch = require('gulp-watch')
extReplace = require('gulp-ext-replace')

DIR_BUILD = path.join(__dirname,'./dist')
DIR_SRC = path.join(__dirname, './src')
DIR_TEST = path.join(__dirname, './test')
FILE_FIXED_STICKY_CSS = path.join(__dirname, './bower_components/filament-sticky/fixedsticky.css')

FIXED_STICKY_CSS = null

gulp.task 'scripts', ->
	gulp.src("#{DIR_SRC}/*.coffee")
	.pipe(coffee({bare: false})).on('error', gutil.log)
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles', ->
	gulp.src(FILE_FIXED_STICKY_CSS)
  .pipe(extReplace('.scss'))
	.pipe(gulp.dest(DIR_BUILD))

	gulp.src("#{DIR_SRC}/*.scss")
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'watch', ['scripts', 'styles', 'test'], ->
	watch({glob: "#{DIR_SRC}/**/*.coffee"}, ['scripts'])
	watch({glob: "#{DIR_SRC}/**/*.scss"}, ['styles'])
	watch({glob: "#{DIR_TEST}/**/*.scss"}, ['test'])

gulp.task 'test', ->
	gulp.src("#{DIR_TEST}/*.scss")
	.pipe(sass(
		errLogToConsole: true
		sourceComments: 'normal'
		includePaths: [
			path.join(__dirname,'./dist/')
		]
	))
	.pipe(gulp.dest(DIR_TEST))

gulp.task 'build', ['scripts', 'styles', 'test']