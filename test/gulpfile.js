'use strict';

const gulp     = require('gulp')
const jade     = require('gulp-jade')
const notifier = require('node-notifier')
const plumber  = require('gulp-plumber')
const postcss  = require('gulp-postcss')
const prefixer = require('autoprefixer')
const sass     = require('gulp-sass')
const sync     = require('browser-sync')

let paths = {
  dst: './dst',
  files: {
    scss: {
      src: './src/scss',
      dst: './dst/assets/css',
    },
  },
}

// error handler
const onError = function(error) {
  notifier.notify({
    'title': 'Error',
    'message': 'Compilation failure.'
  })
  console.log(error)
  this.emit('end')
}

// html
gulp.task('templates', () => {
  return gulp.src('./*.jade')
    .pipe(plumber({ errorHandler: onError }))
    .pipe(jade())
    .pipe(gulp.dest(paths.dst))
})

// sass
const processors = [
  prefixer({ browsers: 'last 2 versions' }),
]

gulp.task('sass', () => {
  return gulp.src(`${paths.files.scss.src}/*.scss`)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sass({ errLogToConsole: true }))
    .pipe(postcss(processors))
    .pipe(gulp.dest(paths.files.scss.dst))
})

// server
const server = sync.create()
const reload = sync.reload
const options = {
  server: {
    baseDir: paths.dst,
  },
}
gulp.task('server', () => sync(options))

// watch
gulp.task('watch', () => {
  gulp.watch('./*.jade', ['templates', reload])
  gulp.watch([`${paths.files.scss.src}/**/**`, '../src/**/**/**/**'], ['sass', reload])
})

// build and default tasks

gulp.task('build', () => {
  gulp.start('templates', 'sass')
})

gulp.task('default', ['build', 'server', 'watch'])
