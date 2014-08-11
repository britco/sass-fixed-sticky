###
Main tasks you will want to run are:
	When in development: `gulp`
	To build without watching: `gulp build`
	To release new gh-pages: `gulp pages`
###

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
pages = require('gulp-gh-pages')
minifyCSS = require('gulp-minify-css')
replace = require('gulp-replace')

DIR_ROOT = __dirname
DIR_BUILD = path.join(__dirname,'./dist')
DIR_SRC = path.join(__dirname, './src')
DIR_DEMO = path.join(__dirname, './demo')
FILE_FIXED_STICKY_CSS = path.join(__dirname, './bower_components/filament-sticky/fixedsticky.css')
FILE_GITIGNORE = path.join(__dirname, './.gitignore')

gulp.task 'scripts', ->
	###
	Build JS file for release
	###

	bundle = browserify({
		entries: ["#{DIR_SRC}/sass-fixed-sticky.coffee"]
	}).bundle({standalone: 'sassFixedSticky'})

	bundle
	.pipe(source('sass-fixed-sticky.js'))
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:imports', ->
	###
	Builds the SCSS files for release.. Removes any "position: *sticky" references since
	the native solution is buggy at the moment..
	###
	gulp.src(FILE_FIXED_STICKY_CSS)
  .pipe(extReplace('.scss'))
	.pipe(replace(/[\t]position:.*sticky[^;]*;[\n\r]/g,''))
	.pipe(gulp.dest(DIR_BUILD))

gulp.task 'styles:main', ->
	###
	Builds the main SASS plugin file
	###

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
	.pipe(minifyCSS(keepBreaks: true))
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

pages_contents_ignore = null
gulp.task 'pages', (callback) ->
	runSequence('pages:before', 'pages:main', 'pages:after', callback)

gulp.task 'pages:before', ->
	###
	Temporarily remove bower_components from gitignore
	###

	pages_contents_ignore = fs.readFileSync(FILE_GITIGNORE).toString()

	fs.writeFileSync(
		FILE_GITIGNORE,
		pages_contents_ignore.replace("bower_components\n",'')
	)

gulp.task 'pages:main', ->
	###
	Deploy pages
	###

	gulp.src([
		'./.gitignore',
		'./README.md',
		'./LICENSE.md'
		'./bower_components/jquery/dist/jquery.js',
		'./dist/*',
		'./demo/*'
	], cwdbase: true)
	.pipe(pages())
	.on('error',gutil.log)

gulp.task 'pages:after', ->
	###
	Revert changes to gitignore
	###

	fs.writeFileSync(
		FILE_GITIGNORE,
		pages_contents_ignore
	)
