'use strict';

const gulp = require('gulp');
const source = require('vinyl-source-stream');
const browserify = require('browserify');
const watchify = require('watchify');
const babelify = require('babelify');

const path = {
  OUT: 'build.js',
  DEST_BUILD: 'public/build',
  ENTRY_POINT: 'app/app.js',
};

gulp.task('watch', () => {
  const watcher = watchify(browserify({
    entries: [path.ENTRY_POINT],
    debug: true,
  })
    .transform(babelify, {
      presets: ['es2015', 'react', 'stage-1'],
    }));

  return watcher
    .on('update', () => {
      watcher
        .bundle()
        .pipe(source(path.OUT))
        .pipe(gulp.dest(path.DEST_BUILD));
      console.log('Updated');
    })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('build', () => {
  browserify({
    entries: [path.ENTRY_POINT],
    debug: true,
  })
    .transform(babelify, {
      presets: ['es2015', 'react', 'stage-1'],
    })
    .bundle()
    .pipe(source(path.OUT))
    .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task('production', ['build']);

gulp.task('default', ['build', 'watch']);
