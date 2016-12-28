const gulp = require('gulp')
const browserSync = require('browser-sync')
const nodemon = require('gulp-nodemon')
const sass = require('gulp-sass')
const reload = browserSync.reload
const babel = require('gulp-babel')
const path = require('path')


gulp.task('default', ['browser-sync', 'watch', ])

gulp.task('browser-sync', ['nodemon'], () => {
	browserSync.init(null, {
		proxy: 'http://localhost:3000',
		port: 8080
	})
})

gulp.task('nodemon', cb => {
	let started = false
	return nodemon({
		script: path.join(__dirname, 'build', 'app.js')
	}).on('start', () => {
		if (!started) {
			cb()
			started = true
		}
	})
})

gulp.task('sass', () => {
	gulp.src('sass/**/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('app/public/css'))
})

gulp.task('watch', () => {
	gulp.watch(['sass/*', 'views/*'], ['sass', reload])
	gulp.watch('src/*', ['babel'])
	gulp.watch(['app/src/js/*'], ['babel-app'])
})

gulp.task('babel', () => {
	gulp.src('./src/**/*.js')
		.pipe(babel({
			presets: ['es2015']
		}).on('error', (err) => {
			console.log(err)
		}))
		.pipe(gulp.dest('./build'))
})

gulp.task('babel-app', () => {
	gulp.src('./app/src/**/*')
		.pipe(babel({
			presets: ['es2015']
		}).on('error', (err) =>{
			console.log(err)
		}))
		.pipe(gulp.dest('./app/public'))
})