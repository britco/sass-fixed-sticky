path = require('path')
gulp = require('gulp')
coffee = require('gulp-coffee')
sass = require('gulp-sass')
gutil = require('gulp-util')

DIR_BUILD = path.join(__dirname,'./dist')
DIR_SRC = path.join(__dirname, './src')

gulp.task 'scripts', ->
	gulp.src("#{DIR_SRC}/*.coffee")
	.pipe(coffee({bare: false})).on('error', gutil.log)
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles', ->
	gulp.src("#{DIR_SRC}/*.scss")
	.pipe(sass(
		errLogToConsole: true
		sourceComments: 'normal'
	))
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'watch', ->
	gulp.watch "#{DIR_SRC}", ['build']

gulp.task 'build', ['scripts', 'styles']